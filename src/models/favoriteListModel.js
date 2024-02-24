const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");

const SheikhFavorite = sequelize.define(
  "sheikh_favorites",
  {
    sheikh_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["sheikh_id", "user_id"],
        unique: true,
      },
    ],
  }
);

const MasjidFavorite = sequelize.define(
  "masjid_favorites",
  {
    masjid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["masjid_id", "user_id"],
        unique: true,
      },
    ],
  }
);

const RecordingFavorite = sequelize.define(
  "recording_favorites",
  {
    recording_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["recording_id", "user_id"],
        unique: true,
      },
    ],
  }
);

module.exports = {
  SheikhFavorite,
  MasjidFavorite,
  RecordingFavorite,
};
