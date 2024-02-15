const { DataTypes } = require("sequelize");

const sequelize = require("./../config/db");

const SheikhPhoneNumbers = sequelize.define("sheikh_phone_numbers", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sheikh_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  is_whatsapp: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = SheikhPhoneNumbers;
