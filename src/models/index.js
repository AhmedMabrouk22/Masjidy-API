const sequelize = require("./../config/db");
const User = require("./userModel");
const User_Auth = require("./user_auth");
const RefreshToken = require("./refreshTokenModel");
const State = require("./stateModel");
const City = require("./cityModel");
const District = require("./districtModel");

// relationships
User.hasOne(User_Auth, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.belongsTo(State, {
  foreignKey: "state_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.belongsTo(City, {
  foreignKey: "city_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.belongsTo(District, {
  foreignKey: "district_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User_Auth.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

City.hasMany(District, {
  foreignKey: "city_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

State.hasMany(City, {
  foreignKey: "state_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

District.belongsTo(City, {
  foreignKey: "city_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

City.belongsTo(State, {
  foreignKey: "state_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize.sync({ force: false });

module.exports = {
  User,
  User_Auth,
  RefreshToken,
  State,
  City,
  District,
};
