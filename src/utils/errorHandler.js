const httpStatus = require("./httpStatus");
const logger = require("./../config/logger");
const AppError = require("./../config/error");

const dbUniqueConstraintError = (error) => {
  const message = error.errors[0].message;
  return new AppError(400, message, true);
};

const tokenExpiredError = (error) => {
  const message = "Unauthorized! Access Token was expired!";
  return new AppError(401, message, true);
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
  if (error.isOperational === true) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.description,
    });
  } else {
    logger.error(error, { obj: error.stack });
    res.status(error.statusCode).json({
      status: error.status,
      message: "Something went wrong!",
    });
  }
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
    err.stack = error.stack;
    if (err.name === "SequelizeUniqueConstraintError")
      err = dbUniqueConstraintError(err);
    if (err.name === "TokenExpiredError") err = tokenExpiredError(err);
    sendErrorProd(err, req, res);
  }
};
