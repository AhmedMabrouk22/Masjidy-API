const Redis = require("redis");

const logger = require("./logger");

const client = Redis.createClient();

client.on("connect", () => {
  logger.info("Redis Connected");
});

client.connect().catch((err) => {
  logger.error("Redis Connection Error", err);
});

module.exports = client;
