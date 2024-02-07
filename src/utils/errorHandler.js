const httpStatus = require("./httpStatus");
const logger = require("./../config/logger");
const AppError = require("./../config/error");

const dbUniqueConstraintError = (error) => {
  const message = error.errors[0].message;
  return new AppError(400, message, true);
};

const sendErrorDev = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.description,
    error: error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.description,
  });
};

module.exports = (error, req, res, next) => {
  // logger.error(error.message, { obj: error.stack });
  error.statusCode = error.statusCode || 500;
  error.status = error.status || httpStatus.ERROR;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "test"
  ) {
    let err = { ...error };
    if (err.name === "SequelizeUniqueConstraintError")
      err = dbUniqueConstraintError(err);
    sendErrorProd(err, req, res);
  }
};
