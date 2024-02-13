const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const Masjid = sequelize.define("masjids", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ratings: {
    type: DataTypes.FLOAT,
  },
  longitude: {
    type: DataTypes.FLOAT,
    //   allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    //   allowNull: false,
  },
  geom: {
    type: DataTypes.GEOMETRY("point", 4326),
    //   allowNull: false
  },
  state_id: {
    type: DataTypes.INTEGER,
  },
  city_id: {
    type: DataTypes.INTEGER,
  },
  district_id: {
    type: DataTypes.INTEGER,
  },
  street: {
    type: DataTypes.STRING,
  },
});

module.exports = Masjid;
