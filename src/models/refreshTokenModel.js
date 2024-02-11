const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const RefreshToken = sequelize.define(
  "refresh_tokens",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    token: {
      type: DataTypes.STRING,
    },
    expireAt: {
      type: DataTypes.DATE,
    },
  },
  {
    indexes: [
      {
        fields: ["token"],
      },
    ],
  }
);

module.exports = RefreshToken;
