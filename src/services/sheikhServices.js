const { Op } = require("sequelize");

const redisClient = require("./../config/redis");
const sequelize = require("./../config/db");
const {
  Sheikh,
  SheikhFeatures,
  SheikhPhoneNumbers,
  Masjid,
  SheikhFavorite,
  SearchHistory,
  Notifications,
} = require("./../models/index");
const buildObject = require("./../utils/buildObj");
const fileUtils = require("./../utils/filesUtils");
const AppError = require("./../config/error");
const { getIO } = require("./../config/socket");

exports.addSheikh = async (sheikh) => {
  try {
    let sheikhObj = buildObject(sheikh, Sheikh.getAttributes());
    const sheikhFeatures = buildObject(sheikh, SheikhFeatures.getAttributes());

    if (sheikh.image) {
      sheikhObj.image_path = sheikh.image;
    }

    const newSheikh = await Sheikh.create(
      {
        ...sheikhObj,
        sheikh_feature: sheikhFeatures,
        sheikh_phone_numbers: sheikh.phone_numbers,
      },
      {
        include: [SheikhFeatures, SheikhPhoneNumbers],
      }
    );

    // save sheikh to notifications
    await Notifications.create({
      sheikh_id: newSheikh.id,
    });

    getIO().emit("addMasjidAndNotifications", "New Sheikh added");

    return newSheikh;
  } catch (error) {
    if (sheikh.image) {
      fileUtils.deleteFiles([sheikh.image]);
    }
    throw error;
  }
};

exports.getAllSheikhs = async (config) => {
  try {
    // Pagination
    const page = config.page * 1 || 1;
    const limit = config.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // filter
    const query = config.filter;

    const sheikhFilter = buildObject(query, Sheikh.getAttributes());
    const sheikhFeaturesFilter = buildObject(
      query,
      SheikhFeatures.getAttributes()
    );

    if (query.name) {
      sheikhFilter.name = {
        [Op.like]: `%${query.name}%`,
      };
    }
    const sheikhs = await Sheikh.findAll({
      offset: skip,
      limit: limit,
      where: sheikhFilter,
      include: [
        {
          model: SheikhFeatures,
          where: sheikhFeaturesFilter,
          attributes: [],
        },
      ],
    });
    return sheikhs;
  } catch (error) {
    throw error;
  }
};

exports.getSheikh = async (config) => {
  try {
    const { sheikh_id } = config;
    const sheikh = await Sheikh.findOne({
      where: { id: sheikh_id },
      include: [
        {
          model: SheikhFeatures,
          attributes: {
            exclude: ["id", "sheikh_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: SheikhPhoneNumbers,
          attributes: {
            exclude: ["id", "sheikh_id", "createdAt", "updatedAt"],
          },
        },
        {
          model: Masjid,
          attributes: ["id", "name"],
        },
      ],
    });
    if (!sheikh) {
      throw new AppError(404, "Sheikh not found", true);
    }

    // save sheikh in history
    if (config.search === true) {
      await SearchHistory.create({
        user_id: config.user_id,
        sheikh_id: sheikh_id,
      });

      // get sheikh with id and name
      const sheikh = await Sheikh.findOne({
        where: { id: sheikh_id },
        attributes: ["id", "name"],
      });

      const key = `${config.user_id} - Sheikh`;
      const obj = JSON.stringify({
        id: sheikh_id,
        name: sheikh.dataValues.name,
      });
      await redisClient.sAdd(key, obj);
    }
    return sheikh;
  } catch (error) {
    throw error;
  }
};

exports.updateSheikh = async (sheikh) => {
  try {
    const sheikhObj = buildObject(sheikh, Sheikh.getAttributes());
    const sheikhFeatures = buildObject(sheikh, SheikhFeatures.getAttributes());
    if (sheikh.image) {
      sheikhObj.image_path = sheikh.image;
    }
    const isExist = await Sheikh.findOne({
      where: { id: sheikh.id },
    });

    if (!isExist) {
      throw new AppError(404, "Sheikh not found", true);
    }

    // sheikh has only one image, so i will delete the old image and update the new one
    if (isExist.dataValues.image_path && sheikh.image) {
      fileUtils.deleteFiles([isExist.dataValues.image_path]);
    }

    await Sheikh.sequelize.transaction(async (t) => {
      await Sheikh.update(
        sheikhObj,
        {
          where: { id: sheikh.id },
        },
        { transaction: t }
      );

      await SheikhFeatures.update(
        sheikhFeatures,
        {
          where: { sheikh_id: sheikh.id },
        },
        { transaction: t }
      );

      // Todo: update phone numbers
    });
  } catch (error) {
    if (sheikh.image) {
      fileUtils.deleteFiles([sheikh.image]);
    }
    throw error;
  }
};

exports.deleteSheikh = async (sheikh_id) => {
  try {
    const sheikh = await Sheikh.findOne({ where: { id: sheikh_id } });
    if (!sheikh) {
      throw new AppError(404, "Sheikh not found", true);
    }
    await sheikh.destroy();
  } catch (error) {
    throw error;
  }
};

exports.getFavorite = async (config) => {
  try {
    if (!config.user_id) {
      throw new AppError(400, "User ID is required", true);
    }

    const page = config.page || 1;
    const limit = config.limit || 10;
    const skip = (page - 1) * limit;
    const user_id = config.user_id;
    const fav = await SheikhFavorite.findAll({
      where: { user_id },
      offset: skip,
      limit: limit,
      attributes: {
        exclude: ["sheikh_id", "user_id"],
      },
      include: [
        {
          model: Sheikh,
          attributes: ["id", "name", "image_path"],
        },
      ],
    });
    return fav;
  } catch (error) {
    throw error;
  }
};

exports.addFavorite = async (data) => {
  try {
    if (!data.user_id || !data.sheikh_id) {
      throw new AppError(400, "User ID and Sheikh ID are required", true);
    }
    await SheikhFavorite.create(data);
  } catch (error) {
    throw error;
  }
};

exports.deleteFavorite = async (data) => {
  try {
    if (!data.user_id || !data.sheikh_id) {
      throw new AppError(400, "User ID and Sheikh ID are required", true);
    }
    await SheikhFavorite.destroy({
      where: {
        user_id: data.user_id,
        sheikh_id: data.sheikh_id,
      },
    });
  } catch (error) {
    throw error;
  }
};

exports.getSearchHistory = async (config) => {
  try {
    if (!config.user_id) {
      throw new AppError(400, "User ID is required", true);
    }

    // cheek if user_id is exist in redis and return data
    const key = `${config.user_id} - Sheikh`;
    const values = await redisClient.sMembers(key);
    const data = [];
    if (values.length > 0) {
      // loop through values and pare each value to json
      for (const val of values) {
        const obj = JSON.parse(val);
        data.push(obj);
      }
      return data;
    }

    // get distinct sheikh_id form search history
    const history = await SearchHistory.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("sheikh_id")), "sheikh_id"],
      ],
      where: { user_id: config.user_id },
      group: ["sheikh_id"],
    });

    // get name and id for each sheikh in history
    const sheikhs = await Sheikh.findAll({
      where: { id: history.map((h) => h.sheikh_id) },
      attributes: ["id", "name"],
    });

    // save data in redis
    for (const sheikh of sheikhs) {
      const elm = JSON.stringify({
        id: sheikh.dataValues.id,
        name: sheikh.dataValues.name,
      });
      await redisClient.sAdd(key, elm);
    }

    return sheikhs;
  } catch (error) {
    throw error;
  }
};

exports.getMostSearch = async () => {
  try {
    // get top 5 most searched sheikhs in search history
    const history = await SearchHistory.findAll({
      attributes: [
        "sheikh_id",
        [sequelize.fn("COUNT", sequelize.col("sheikh_id")), "sheikh_count"],
      ],
      group: ["sheikh_id"],
      order: [[sequelize.literal("sheikh_count"), "DESC"]],
      limit: 5,
    });

    // get name and id for each sheikh in history
    const sheikhs = await Masjid.findAll({
      where: { id: history.map((h) => h.sheikh_id) },
      attributes: ["id", "name"],
    });

    return sheikhs;
  } catch (error) {
    throw error;
  }
};
