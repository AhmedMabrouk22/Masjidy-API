const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const errorHandler = require("./../utils/errorHandler");
const authRouter = require("./../routes/authRoute");
const AppError = require("./../config/error");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/v1/auth", authRouter);

// Not page found
app.all("*", (req, res, next) => {
  return next(new AppError(404, `Can't find ${req.originalUrl}`, true));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
