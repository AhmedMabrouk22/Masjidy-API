const express = require("express");

const errorHandler = require("./../utils/errorHandler");
const AppError = require("./error");

const app = express();

app.get("/", (req, res, next) => {
  res.json({ ok: "ok" });
});

// Not page found
app.all("*", (req, res, next) => {
  return next(new AppError(404, `Can't find ${req.originalUrl}`, true));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
