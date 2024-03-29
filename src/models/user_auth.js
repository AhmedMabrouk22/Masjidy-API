const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const User_Auth = sequelize.define(
  "user_auth",
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    reset_password_code: {
      type: DataTypes.STRING,
    },
    reset_code_expires_at: {
      type: DataTypes.DATE,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["user_id", "reset_password_code"],
      },
    ],
  }
);

module.exports = User_Auth;
