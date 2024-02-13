const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const MasjidImages = sequelize.define(
  "masjid_images",
  {
    masjid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["masjid_id"],
      },
    ],
  }
);

module.exports = MasjidImages;
