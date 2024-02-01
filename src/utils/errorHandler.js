const httpStatus = require("./httpStatus");

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
  // add error logging
  error.statusCode = error.statusCode || 500;
  error.status = error.status || httpStatus.ERROR;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, req, res);
  }
};
