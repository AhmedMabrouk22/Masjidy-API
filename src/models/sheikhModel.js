const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");
const filesUtils = require("./../utils/filesUtils");

const Sheikh = sequelize.define("sheikhs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_path: {
    type: DataTypes.STRING,
  },
  masjid_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Sheikh.beforeDestroy = async (sheikh) => {
  filesUtils.deleteFiles([sheikh.image_path]);
};

module.exports = Sheikh;
