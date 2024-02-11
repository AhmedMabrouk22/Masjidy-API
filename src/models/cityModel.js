const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const City = sequelize.define("cites", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ar_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = City;
