const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const District = sequelize.define("districts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ar_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = District;
