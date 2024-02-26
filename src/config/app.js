const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const errorHandler = require("./../utils/errorHandler");
const AppError = require("./../config/error");

const authRouter = require("./../routes/authRoute");
const userRouter = require("./../routes/userRoute");
const masjidRouter = require("./../routes/masjidRoute");
const sheikhRouter = require("./../routes/sheikhRoute");
const masjidReviewRouter = require("./../routes/masjidReviewsRoute");
const lessonRouter = require("./../routes/lessonRoute");
const recordingRouter = require("./../routes/recordingsRouter");
const notificationsRouter = require("./../routes/notificationsRoute");
const { initSocket } = require("./socket");

const app = express();
const server = require("http").createServer(app);

initSocket(server);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../", "uploads")));
app.use(cors());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/masjids", masjidRouter);
app.use("/api/v1/sheikhs", sheikhRouter);
app.use("/api/v1/masjid-reviews", masjidReviewRouter);
app.use("/api/v1/lessons", lessonRouter);
app.use("/api/v1/recordings", recordingRouter);
app.use("/api/v1/notifications", notificationsRouter);

// Not page found
app.all("*", (req, res, next) => {
  return next(new AppError(404, `Can't find ${req.originalUrl}`, true));
});

// Global error handler
app.use(errorHandler);

module.exports = server;
