const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isLowercase: true,
        max: 300,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 8,
      },
    },
    image_path: {
      type: DataTypes.STRING,
    },
    user_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin", "manager"]],
      },
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
  },
  {
    timestamps: true,
  }
);

module.exports = User;
