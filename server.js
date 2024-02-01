const dotenv = require("./src/config/environment");
const sequelize = require("./src/config/db");
const app = require("./src/config/app");
const Logger = require("./src/config/logger");

const logger = new Logger();

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected successfully");
  })
  .catch((err) => {
    logger.error(err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`);
});
