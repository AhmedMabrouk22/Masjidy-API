const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const MasjidImages = require("./masjidImagesModel");
const filesUtils = require("./../utils/filesUtils");

const Masjid = sequelize.define("masjids", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    //   allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    //   allowNull: false,
  },
  geom: {
    type: DataTypes.GEOMETRY("point", 4326),
    //   allowNull: false
  },
  state_id: {
    type: DataTypes.INTEGER,
  },
  city_id: {
    type: DataTypes.INTEGER,
  },
  district_id: {
    type: DataTypes.INTEGER,
  },
  street: {
    type: DataTypes.STRING,
  },
  average_rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

Masjid.beforeDestroy(async (masjid) => {
  const images = await MasjidImages.findAll({
    where: { masjid_id: masjid.id },
    attributes: ["image_path"],
  });
  for (const image of images) {
    filesUtils.deleteFiles([image.image_path]);
  }
});

module.exports = Masjid;
