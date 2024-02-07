const { Sequelize } = require("sequelize");
require("./environment");

let dbConfig = {
  dialect: "postgres",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  // logging: (msg) => logger.info(msg),
  logging: false,
};

// if (process.env.NODE_ENV === "test") {
//   dbConfig.database = process.env.TEST_DATABASE_NAME;
// }

const sequelize = new Sequelize(dbConfig);

module.exports = sequelize;
