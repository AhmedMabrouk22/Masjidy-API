const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");

const SheikhFeatures = sequelize.define("sheikh_features", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sheikh_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  friday_khutbah: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lead_in_tarawih: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  has_quran_sessions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = SheikhFeatures;
