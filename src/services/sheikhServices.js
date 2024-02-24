const {
  Sheikh,
  SheikhFeatures,
  SheikhPhoneNumbers,
  Masjid,
  SheikhFavorite,
} = require("./../models/index");
const buildObject = require("./../utils/buildObj");
const fileUtils = require("./../utils/filesUtils");
const AppError = require("./../config/error");

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
    return newSheikh;
  } catch (error) {
    if (sheikh.image) {
      fileUtils.deleteFiles([sheikh.image]);
    }
    throw error;
  }
};

exports.getAllSheikhs = async (page, limit) => {
  try {
    page = page * 1 || 1;
    limit = limit * 1 || 10;
    const skip = (page - 1) * limit;
    const sheikhs = await Sheikh.findAll({
      offset: skip,
      limit: limit,
    });
    return sheikhs;
  } catch (error) {
    throw error;
  }
};

exports.getSheikh = async (sheikh_id) => {
  try {
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
