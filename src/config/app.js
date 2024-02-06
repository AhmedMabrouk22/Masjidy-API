const express = require("express");
const morgan = require("morgan");

const errorHandler = require("./../utils/errorHandler");
const AppError = require("./error");
const User = require("./../models/userModel");
const logger = require("./logger");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

app.get("/user", async (req, res, next) => {
  try {
    const users = await User.findAll();
    logger.info(`IP ${req.socket.remoteAddress} Get all users`);
    return res.status(200).json({ users });
  } catch (error) {
    return next(new AppError(400, error.message, true));
  }
});

// Not page found
app.all("*", (req, res, next) => {
  return next(new AppError(404, `Can't find ${req.originalUrl}`, true));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
