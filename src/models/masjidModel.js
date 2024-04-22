const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const MasjidImages = require("./masjidImagesModel");
const filesUtils = require("./../utils/filesUtils");

const Masjid = sequelize.define(
  "masjids",
  {
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
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
    },
    street: {
      type: DataTypes.STRING,
    },
    average_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    favorites: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: ["name"],
      },
      {
        fields: ["state", "city", "region", "street"],
      },
    ],
  }
);

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
