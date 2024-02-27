const { Op, where } = require("sequelize");

const redisClient = require("./../config/redis");
const sequelize = require("./../config/db");
const {
  Masjid,
  MasjidFeatures,
  MasjidImages,
  Sheikh,
  MasjidFavorite,
  SearchHistory,
  Notifications,
} = require("./../models/index");
const geomPoint = require("./../utils/geomPoint");
const filesUtils = require("./../utils/filesUtils");
const AppError = require("./../config/error");
const buildObj = require("./../utils/buildObj");
const { getIO } = require("./../config/socket");

/**
 * Builds a masjid object based on the provided data, filtering out non-attribute keys and adding geom point if longitude and latitude are present.
 *
 * @param {Object} data - the data to build the masjid object from
 * @return {Object} the masjid object built from the provided data
 */
function buildMasjidObject(data) {
  let masjidObject = {};
  for (const [key, value] of Object.entries(data)) {
    if (key in Masjid.getAttributes()) {
      masjidObject[key] = value;
    }
  }

  if (data.longitude && data.latitude) {
    masjidObject.geom = geomPoint(data.longitude, data.latitude);
  }

  return masjidObject;
}

/**
 * Builds a new object containing only the attributes from the input data that are valid Masjid features.
 *
 * @param {Object} data - The input data object
 * @return {Object} The new object containing valid Masjid features
 */
function buildMasjidFeaturesObject(data) {
  let masjidFeaturesObject = {};
  for (const [key, value] of Object.entries(data)) {
    if (key in MasjidFeatures.getAttributes()) {
      masjidFeaturesObject[key] = value;
    }
  }
  return masjidFeaturesObject;
}

/**
 * Handles the uploading of images and returns the paths of the uploaded images.
 *
 * @param {array} images - An array of image paths to be uploaded
 * @return {array} An array of objects containing the image paths
 */
function handleImageUploads(images) {
  const image_paths = [];
  for (let i = 0; i < images.length; i++) {
    image_paths.push({
      image_path: images[i],
    });
  }
  return image_paths;
}

/**
 * Handles the deletion of images associated with a specific masjid.
 *
 * @param {number} masjid_id - The ID of the masjid
 * @param {Array<string>} images - The array of image paths to be deleted
 * @return {Promise<void>} A promise that resolves once the images are deleted
 */
async function handleImageDeletions(masjid_id, images) {
  await MasjidImages.destroy({
    where: {
      masjid_id: masjid_id,
      image_path: { [Op.in]: images },
    },
  });
  filesUtils.deleteFiles(images);
}

/**
 * Create a new masjid with its features and images in the database.
 *
 * @param {Object} masjid - The masjid object containing all the details
 * @return {Object} The newly created masjid object
 */
exports.addMasjid = async (masjid) => {
  try {
    const masjidObj = buildMasjidObject(masjid);
    const masjidFeaturesObj = buildMasjidFeaturesObject(masjid);
    const image_paths = handleImageUploads(masjid.images);

    const newMasjid = await Masjid.create(
      {
        ...masjidObj,
        masjid_feature: masjidFeaturesObj,
        masjid_images: image_paths,
      },
      {
        include: [MasjidFeatures, MasjidImages],
      }
    );

    // save masjid to notifications
    await Notifications.create({
      masjid_id: newMasjid.id,
    });

    getIO().emit("addMasjidAndNotifications", "New Masjid added");
    return newMasjid;
  } catch (error) {
    if (masjid.images) {
      filesUtils.deleteFiles(masjid.images);
    }
    throw error;
  }
};

/**
 * Retrieves a list of masjids based on the provided configuration.
 *
 * @param {Object} config - The configuration object for pagination and filtering
 * @return {Promise<Array>} A promise that resolves to an array of masjids
 */
exports.getAllMasjids = async (config) => {
  try {
    // Pagination
    const page = config.page * 1 || 1;
    const limit = config.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // filter
    const query = config.filter;

    const masjidFilter = buildObj(query, Masjid.getAttributes());
    const masjidFeaturesFilter = buildObj(
      query,
      MasjidFeatures.getAttributes()
    );

    if (query.capacity) {
      masjidFeaturesFilter.capacity = {
        [Op.gte]: query.capacity,
      };
    }

    if (query.name) {
      masjidFilter.name = {
        [Op.like]: `%${query.name}%`,
      };
    }

    const masjids = await Masjid.findAll({
      offset: skip,
      limit: limit,
      where: masjidFilter,
      include: [
        {
          model: MasjidImages,
          attributes: ["image_path"],
        },
        {
          model: MasjidFeatures,
          where: masjidFeaturesFilter,
          attributes: [],
        },
      ],
    });

    return masjids;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a masjid based on the provided configuration.
 *
 * @param {Object} config - The configuration object containing masjid_id and search flag.
 * @return {Promise<Object>} A promise that resolves with the retrieved masjid.
 */
exports.getMasjid = async (config) => {
  try {
    const { masjid_id } = config;
    let masjid = await Masjid.findOne({
      where: { id: masjid_id },
      include: [
        {
          model: MasjidFeatures,
          attributes: {
            exclude: ["masjid_id", "id", "createdAt", "updatedAt"],
          },
        },
        {
          model: MasjidImages,
          attributes: ["image_path"],
        },
        {
          model: Sheikh,
          attributes: ["id", "name", "image_path"],
        },
      ],
    });

    if (!masjid) {
      throw new AppError(404, "Masjid not found", true);
    }

    // save masjid in history
    if (config.search === true) {
      await SearchHistory.create({
        user_id: config.user_id,
        masjid_id: masjid_id,
      });

      // get masjid with id and name
      const masjid = await Masjid.findOne({
        where: { id: masjid_id },
        attributes: ["id", "name"],
      });

      const key = `${config.user_id} - Masjid`;
      const obj = JSON.stringify({
        id: masjid_id,
        name: masjid.dataValues.name,
      });
      await redisClient.sAdd(key, obj);
    }

    return masjid;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the masjid information, including images.
 *
 * @param {Object} masjid - the masjid object to be updated
 * @return {Promise} a Promise that resolves when the masjid information is successfully updated
 */
exports.updateMasjid = async (masjid) => {
  try {
    if (!masjid.id) {
      throw new AppError(400, "Masjid ID is required", true);
    }

    const isExist = await Masjid.findOne({ where: { id: masjid.id } });
    if (!isExist) {
      throw new AppError(404, "Masjid not found", true);
    }

    const masjidObj = buildMasjidObject(masjid);
    const masjidFeaturesObj = buildMasjidFeaturesObject(masjid);
    /*
     * for update images
     * images : it's new images
     * delete_images: it's old images and delete it
     */

    let cnt = await MasjidImages.count({
      where: {
        masjid_id: masjid.id,
      },
    });

    if (
      masjid.delete_images &&
      (masjid.delete_images.length > cnt ||
        (masjid.delete_images.length === cnt &&
          (!masjid.images || masjid.images.length === 0)))
    ) {
      throw new AppError(
        400,
        "You can't delete all images, masjid must has at least one image",
        true
      );
    }

    if (masjid.delete_images) {
      await handleImageDeletions(masjid.id, masjid.delete_images);
      cnt -= masjid.delete_images.length;
    }

    const image_paths = handleImageUploads(masjid.images);
    if (masjid.images && cnt + masjid.images.length > 5) {
      throw new AppError(400, "Only 5 images are allowed", true);
    }

    await sequelize.transaction(async (t) => {
      await Masjid.update(
        {
          ...masjidObj,
        },
        {
          where: {
            id: masjid.id,
          },
        },
        { transaction: t }
      );

      await MasjidFeatures.update(
        {
          ...masjidFeaturesObj,
        },
        {
          where: {
            masjid_id: masjid.id,
          },
        },
        { transaction: t }
      );

      for (const image of image_paths) {
        await MasjidImages.create(
          {
            masjid_id: masjid.id,
            image_path: image.image_path,
          },
          {
            where: {
              masjid_id: masjid.id,
            },
          },
          { transaction: t }
        );
      }
    });
  } catch (error) {
    if (masjid.images) {
      filesUtils.deleteFiles(masjid.images);
    }
    throw error;
  }
};

/**
 * Delete a masjid by its ID.
 *
 * @param {number} masjid_id - The ID of the masjid to be deleted
 * @return {Promise} A Promise that resolves when the masjid is deleted
 */
exports.deleteMasjid = async (masjid_id) => {
  try {
    const masjid = await Masjid.findOne({
      where: { id: masjid_id },
    });
    if (!masjid) {
      throw new AppError(404, "Masjid not found", true);
    }
    await masjid.destroy();
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the favorite masjids for a given user based on the provided configuration.
 *
 * @param {Object} config - The configuration object containing user_id, page, and limit.
 * @return {Promise<Array>} The array of favorite masjids.
 */
exports.getFavorite = async (config) => {
  try {
    if (!config.user_id) {
      throw new AppError(400, "User ID is required", true);
    }

    const page = config.page || 1;
    const limit = config.limit || 10;
    const skip = (page - 1) * limit;
    const user_id = config.user_id;

    const fav = await MasjidFavorite.findAll({
      offset: skip,
      limit: limit,
      where: { user_id: user_id },
      attributes: {
        exclude: ["masjid_id", "user_id"],
      },
      include: [
        {
          model: Masjid,
          attributes: ["id", "name"],
        },
      ],
    });
    return fav;
  } catch (error) {
    throw error;
  }
};

/**
 * Asynchronous function to add a favorite with user and masjid IDs.
 *
 * @param {Object} data - The data object containing user_id and masjid_id
 * @return {Promise} Promise that resolves when the operation is complete
 */
exports.addFavorite = async (data) => {
  try {
    if (!data.user_id || !data.masjid_id) {
      throw new AppError(400, "User ID and Masjid ID are required", true);
    }
    await MasjidFavorite.create(data);
  } catch (error) {
    throw error;
  }
};

/**
 * Asynchronously deletes a favorite based on user and masjid ID.
 *
 * @param {Object} data - an object containing user_id and masjid_id
 * @return {Promise} a promise representing the completion of the deletion
 */
exports.deleteFavorite = async (data) => {
  try {
    if (!data.user_id || !data.masjid_id) {
      throw new AppError(400, "User ID and Masjid ID are required", true);
    }
    await MasjidFavorite.destroy({
      where: {
        user_id: data.user_id,
        masjid_id: data.masjid_id,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the search history data for a given user, stores it in Redis, and returns the masjids associated with the search history.
 *
 * @param {object} config - The configuration object containing the user_id.
 * @return {Promise<Array>} An array containing the masjids associated with the search history.
 */
exports.getSearchHistory = async (config) => {
  try {
    if (!config.user_id) {
      throw new AppError(400, "User ID is required", true);
    }

    // cheek if user_id is exist in redis and return data
    const key = `${config.user_id} - Masjid`;
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

    // get distinct masjid_id form search history
    const history = await SearchHistory.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("masjid_id")), "masjid_id"],
      ],
      where: { user_id: config.user_id },
      group: ["masjid_id"],
    });

    // get name and id for each masjid in history
    const masjids = await Masjid.findAll({
      where: { id: history.map((h) => h.masjid_id) },
      attributes: ["id", "name"],
    });

    // save data in redis
    for (const masjid of masjids) {
      const elm = JSON.stringify({
        id: masjid.dataValues.id,
        name: masjid.dataValues.name,
      });
      await redisClient.sAdd(key, elm);
    }

    return masjids;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the top 5 most searched masjids in the search history and returns their names and ids.
 *
 * @param {void}
 * @return {Promise<Array>} An array of masjids with their names and ids
 */
exports.getMostSearch = async () => {
  try {
    // get top 5 most searched masjids in search history
    const history = await SearchHistory.findAll({
      attributes: [
        "masjid_id",
        [sequelize.fn("COUNT", sequelize.col("masjid_id")), "masjid_count"],
      ],
      group: ["masjid_id"],
      order: [[sequelize.literal("masjid_count"), "DESC"]],
      limit: 5,
    });

    // get name and id for each masjid in history
    const masjids = await Masjid.findAll({
      where: { id: history.map((h) => h.masjid_id) },
      attributes: ["id", "name"],
    });

    return masjids;
  } catch (error) {
    throw error;
  }
};
