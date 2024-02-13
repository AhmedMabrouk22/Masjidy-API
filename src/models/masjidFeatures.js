const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const MasjidFeatures = sequelize.define("masjid_features", {
  masjid_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lessons: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tahajid_prayer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quran_sessions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  female_prayer_room: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  car_garage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  friday_prayer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = MasjidFeatures;
