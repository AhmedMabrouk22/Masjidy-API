const { body, param, query } = require("express-validator");

const validatorMiddleware = require("./../middlewares/validatorsMiddleware");

exports.createLesson = [
  body("name").notEmpty().withMessage("Name is required"),
  body("masjid_id")
    .notEmpty()
    .withMessage("Masjid id is required")
    .isInt()
    .withMessage("Invalid masjid id"),
  body("sheikh_id")
    .notEmpty()
    .withMessage("Masjid id is required")
    .isInt()
    .withMessage("Invalid masjid id"),
  body("date")
    .notEmpty()
    .withMessage("date is required")
    .isArray({
      min: 1,
      max: 7,
    })
    .withMessage("date must be an array and length must be 1 to 7"),
  body("date.*.day")
    .notEmpty()
    .withMessage("Day is required")
    .isIn([
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ])
    .withMessage(
      "Invalid day, day must be in sunday, monday, tuesday, wednesday, thursday, friday, saturday"
    ),
  body("date.*.prayer")
    .notEmpty()
    .withMessage("Prayer is required")
    .isIn(["fajr", "dhuhr", "asr", "maghrib", "isha"])
    .withMessage(
      "Invalid prayer, prayer must be in fajr, dhuhr, asr, maghrib, isha"
    ),

  validatorMiddleware,
];

exports.lessonId = [
  param("lesson_id")
    .notEmpty()
    .withMessage("Lesson id is required")
    .isInt()
    .withMessage("Invalid lesson id"),
  validatorMiddleware,
];

exports.getLessons = [
  query("day")
    .optional()
    .isIn([
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ])
    .withMessage("Invalid day"),
  query("prayer")
    .optional()
    .isIn(["fajr", "dhuhr", "asr", "maghrib", "isha"])
    .withMessage("Invalid prayer"),

  param("masjid_id").optional().isInt().withMessage("Invalid masjid id"),
  param("sheikh_id").optional().isInt().withMessage("Invalid sheikh_id"),
  validatorMiddleware,
];

exports.lessonID = [
  param("lesson_id")
    .notEmpty()
    .withMessage("Lesson id is required")
    .isInt()
    .withMessage("Invalid lesson id"),
  validatorMiddleware,
];
