const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Notifications = sequelize.define("notifications", {
  masjid_id: {
    type: DataTypes.INTEGER,
  },
  sheikh_id: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Notifications;
