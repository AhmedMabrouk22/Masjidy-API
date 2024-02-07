const sequelize = require("./../config/db");
const { DataTypes } = require("sequelize");
const City = require("./cityModel");
const State = require("./stateModel");
const District = require("./districtModel");
const User_Auth = require("./user_auth");

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

User.hasOne(User_Auth, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.belongsTo(State, { foreignKey: "state_id" });
User.belongsTo(City, { foreignKey: "city_id" });
User.belongsTo(District, { foreignKey: "district_id" });

module.exports = User;
