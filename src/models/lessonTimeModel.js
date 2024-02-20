const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");

const LessonTime = sequelize.define(
  "lesson_times",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ],
        ],
      },
    },
    prayer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["fajr", "dhuhr", "asr", "maghrib", "isha"]],
      },
    },
  },
  {
    indexes: [
      {
        fields: ["lesson_id"],
      },
    ],
  }
);

module.exports = LessonTime;
