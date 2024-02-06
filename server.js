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

const dotenv = require("./src/config/environment");
const logger = require("./src/config/logger");
const sequelize = require("./src/config/db");
const app = require("./src/config/app");

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected successfully");
    sequelize
      .sync({ force: true })
      .then(() => {
        logger.info("database synced");
      })
      .catch((err) => {
        logger.error("Error syncing database:", err);
      });
  })
  .catch((err) => {
    logger.error(err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`APP running on PORT ${PORT}`);
});
