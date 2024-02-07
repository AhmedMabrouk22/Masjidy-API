process.on("uncaughtException", (error) => {
  logger.error(error.message, { obj: error.stack });
  sequelize
    .close()
    .then(() => {
      logger.info("Database connection closed successfully");
    })
    .catch((err) => {
      logger.error("Error closing database connection:", err);
    })
    .finally(() => {
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });
});

process.on("exit", () => {
  logger.info("Process exiting...");
});

const logger = require("./src/config/logger");
const sequelize = require("./src/config/db");
const app = require("./src/config/app");

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connection established successfully");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`APP running on PORT ${PORT} on ${process.env.NODE_ENV} mode`);
});

module.exports = server;
