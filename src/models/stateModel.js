const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");
const City = require("./cityModel");

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

State.hasMany(City, {
  foreignKey: "state_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = State;
