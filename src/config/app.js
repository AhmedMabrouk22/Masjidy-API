const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

const errorHandler = require("./../utils/errorHandler");
const AppError = require("./../config/error");

const authRouter = require("./../routes/authRoute");
const userRouter = require("./../routes/userRoute");
const masjidRouter = require("./../routes/masjidRoute");
const sheikhRouter = require("./../routes/sheikhRoute");
const masjidReviewRouter = require("./../routes/masjidReviewsRoute");
const lessonRouter = require("./../routes/lessonRoute");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../", "uploads")));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/masjids", masjidRouter);
app.use("/api/v1/sheikhs", sheikhRouter);
app.use("/api/v1/masjid-reviews", masjidReviewRouter);
app.use("/api/v1/lessons", lessonRouter);

// Not page found
app.all("*", (req, res, next) => {
  return next(new AppError(404, `Can't find ${req.originalUrl}`, true));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
