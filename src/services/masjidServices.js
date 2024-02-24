const { Op, where } = require("sequelize");

const sequelize = require("./../config/db");
const {
  Masjid,
  MasjidFeatures,
  MasjidImages,
  Sheikh,
  MasjidFavorite,
} = require("./../models/index");
const geomPoint = require("./../utils/geomPoint");
const filesUtils = require("./../utils/filesUtils");
const AppError = require("./../config/error");

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

function buildMasjidFeaturesObject(data) {
  let masjidFeaturesObject = {};
  for (const [key, value] of Object.entries(data)) {
    if (key in MasjidFeatures.getAttributes()) {
      masjidFeaturesObject[key] = value;
    }
  }
  return masjidFeaturesObject;
}

function handleImageUploads(images) {
  const image_paths = [];
  for (let i = 0; i < images.length; i++) {
    image_paths.push({
      image_path: images[i],
    });
  }
  return image_paths;
}

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
    return newMasjid;
  } catch (error) {
    if (masjid.images) {
      filesUtils.deleteFiles(masjid.images);
    }
    throw error;
  }
};

/**
 * Retrieves a list of masjids with optional pagination.
 *
 * @param {number} page - The page number for pagination
 * @param {number} limit - The limit of items per page
 * @return {Promise<Array>} An array of masjid objects
 */
exports.getAllMasjids = async (page, limit) => {
  try {
    page = page * 1 || 1;
    limit = limit * 1 || 10;
    const skip = (page - 1) * limit;

    const masjids = await Masjid.findAll({
      offset: skip,
      limit: limit,
      include: {
        model: MasjidImages,
        attributes: ["image_path"],
      },
    });

    return masjids;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a specific masjid by its ID along with its features and images.
 *
 * @param {number} masjid_id - The ID of the masjid to retrieve
 * @return {object} The masjid object with its features and images
 */
exports.getMasjid = async (masjid_id) => {
  try {
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
