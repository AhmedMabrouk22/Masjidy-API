const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");

const User_Auth = sequelize.define(
  "user_auth",
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
    reset_password_code: {
      type: DataTypes.STRING,
    },
    reset_code_expires_at: {
      type: DataTypes.DATE,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id"],
      },
    ],
  }
);

User_Auth.removeAttribute("id");

module.exports = User_Auth;
