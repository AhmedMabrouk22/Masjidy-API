const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");

const Lesson = sequelize.define(
  "lessons",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    masjid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sheikh_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["masjid_id"],
      },
      {
        fields: ["sheikh_id"],
      },
    ],
  }
);

module.exports = Lesson;
