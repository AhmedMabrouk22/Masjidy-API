const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const State = sequelize.define("states", {
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

module.exports = State;
