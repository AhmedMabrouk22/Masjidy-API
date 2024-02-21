const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");
const fileUtils = require("./../utils/filesUtils");

const Recordings = sequelize.define("recordings", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  audio_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sheikh_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["tilawah", "khutbah"]],
    },
  },
});

Recordings.afterDestroy(async (recordings) => {
  if (recordings.audio_path) {
    fileUtils.deleteFiles([recordings.audio_path]);
  }
});

module.exports = Recordings;
