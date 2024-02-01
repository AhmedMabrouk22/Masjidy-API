const winston = require("winston");

const dateFormat = () => new Date(Date.now()).toISOString();

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${
          info.message
        }`;
        return message;
      }),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${process.env.LOGGING_PATH}/error.log`,
          level: "error",
        }),
        new winston.transports.File({
          filename: `${process.env.LOGGING_PATH}/combined.log`,
        }),
      ],
    });
  }

  log(level, message) {
    this.logger.log(level, message);
  }

  info(message) {
    this.logger.info(message);
  }

  warn(message) {
    this.logger.warn(message);
  }

  error(message) {
    this.logger.error(message);
  }
}

module.exports = Logger;
