const httpStatus = require("./../utils/httpStatus");

class AppError extends Error {
  constructor(statusCode, description, isOperational) {
    super(description);
    this.status = `${statusCode}`.startsWith("4")
      ? httpStatus.FAIL
      : httpStatus.ERROR;
    this.statusCode = statusCode;
    this.description = description;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

module.exports = AppError;
