const multer = require("multer");
const path = require("path");
const AppError = require("../config/error");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(__dirname, "..", "uploads", "recordings");
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = `Recordings-${uniqueSuffix}${ext}`;
    req.body.audio_path = name;
    cb(null, name);
  },
});

const uploadAudio = (fileName) =>
  multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith("audio")) {
        cb(null, true);
      } else {
        cb(new AppError(400, "Only Audio files are allowed!", true), false);
      }
    },
  }).single(fileName);

module.exports = {
  uploadAudio,
};
