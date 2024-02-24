const { body, param, query } = require("express-validator");
const validatorMiddleware = require("./../middlewares/validatorsMiddleware");
const AppError = require("../config/error");

exports.addRecording = [
  body("title").notEmpty().withMessage("title is required"),
  body("sheikh_id")
    .notEmpty()
    .withMessage("sheikh id is required")
    .isInt()
    .withMessage("Invalid sheikh id"),
  body("type")
    .notEmpty()
    .withMessage("type is required")
    .isIn(["tilawah", "khutbah"])
    .withMessage("Invalid type"),
  body("audio_path").notEmpty().withMessage("audio path is required"),
  validatorMiddleware,
];

exports.recordingID = [
  param("recording_id")
    .notEmpty()
    .withMessage("recording id is required")
    .isInt()
    .withMessage("Invalid recording id"),
];

exports.getRecordings = [
  param("sheikh_id").optional().isInt().withMessage("Invalid sheikh id"),
  query("type")
    .optional()
    .notEmpty()
    .isIn(["tilawah", "khutbah"])
    .withMessage("Invalid type"),
  validatorMiddleware,
];

exports.addFav = [
  body("recording_id")
    .notEmpty()
    .withMessage("recording_id is required")
    .isInt()
    .withMessage("Invalid recording_id"),
  validatorMiddleware,
];
