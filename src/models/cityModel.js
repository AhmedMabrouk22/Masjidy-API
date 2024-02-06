const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");
const District = require("./districtModel");

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

City.hasMany(District, {
  foreignKey: "city_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = City;
