const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");

const SearchHistory = sequelize.define("search_history", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  masjid_id: {
    type: DataTypes.INTEGER,
  },
  sheikh_id: {
    type: DataTypes.INTEGER,
  },
});

module.exports = SearchHistory;
