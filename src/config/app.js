const express = require("express");
const morgan = require("morgan");

const errorHandler = require("./../utils/errorHandler");
const AppError = require("./error");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Not page found
app.all("*", (req, res, next) => {
  return next(new AppError(404, `Can't find ${req.originalUrl}`, true));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
