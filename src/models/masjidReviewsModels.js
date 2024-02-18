const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const MasjidReviews = sequelize.define(
  "masjid_reviews",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    masjid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["masjid_id"],
      },
      {
        fields: ["user_id", "masjid_id"],
        unique: true,
      },
    ],
  }
);

module.exports = MasjidReviews;
