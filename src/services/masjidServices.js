const sequelize = require("./../config/db");
const { Masjid, MasjidFeatures, MasjidImages } = require("./../models/index");
const geomPoint = require("./../utils/geomPoint");
const filesUtils = require("./../utils/filesUtils");

exports.addMasjid = async (masjid) => {
  try {
    const {
      name,
      description,
      ratings,
      longitude,
      latitude,
      state_id,
      city_id,
      district_id,
      street,
      capacity,
      lessons,
      tahajid_prayer,
      quran_sessions,
      female_prayer_room,
      car_garage,
      friday_prayer,
      images,
    } = masjid;

    // Transaction for create masjid, masjid features and masjid images in db
    const point = geomPoint(longitude, latitude);
    const result = await sequelize.transaction(async (t) => {
      const newMasjid = await Masjid.create(
        {
          name,
          description,
          ratings,
          longitude,
          latitude,
          state_id,
          city_id,
          district_id,
          street,
          geom: point,
        },
        { transaction: t }
      );

      await MasjidFeatures.create(
        {
          masjid_id: newMasjid.id,
          capacity,
          lessons,
          tahajid_prayer,
          quran_sessions,
          female_prayer_room,
          car_garage,
          friday_prayer,
        },
        { transaction: t }
      );

      for (let i = 0; i < images.length; i++) {
        await MasjidImages.create(
          {
            masjid_id: newMasjid.id,
            image_path: images[i],
          },
          { transaction: t }
        );
      }

      return newMasjid;
    });
    return result.dataValues;
  } catch (error) {
    if (masjid.images) {
      filesUtils.deleteFiles(masjid.images);
    }
    throw error;
  }
};

// Todo: Get all masjids

// Todo: Get masjid

// Todo: Update masjid

// Todo: Delete masjid
