const { body } = require("express-validator");
const validatorMiddleware = require("./../middlewares/validatorsMiddleware");

exports.createMasjid = [
  body("name")
    .notEmpty()
    .withMessage("Masjid name is required")
    .isString()
    .withMessage("Invalid name"),
  body("description")
    .notEmpty()
    .withMessage("Masjid description is required")
    .isString(),
  body("capacity")
    .notEmpty()
    .withMessage("capacity is required")
    .isInt()
    .withMessage("capacity must be a number"),
  body("longitude")
    .notEmpty()
    .withMessage("longitude is required")
    .isFloat()
    .withMessage("Invalid longitude"),
  body("latitude")
    .notEmpty()
    .withMessage("latitude is required")
    .isFloat()
    .withMessage("Invalid latitude"),
  body("images")
    .notEmpty()
    .withMessage("Masjid images is required")
    .isArray({ min: 1, max: 5 })
    .withMessage("Invalid images"),
  body("lessons")
    .optional()
    .isBoolean()
    .withMessage("lessons must be a boolean"),
  body("tahajid_prayer")
    .optional()
    .isBoolean()
    .withMessage("tahajid_prayer must be a boolean"),
  body("quran_sessions")
    .optional()
    .isBoolean()
    .withMessage("quran_sessions must be a boolean"),
  body("female_prayer_room")
    .optional()
    .isBoolean()
    .withMessage("female_prayer_room must be a boolean"),
  body("car_garage")
    .optional()
    .isBoolean()
    .withMessage("car_garage must be a boolean"),
  body("friday_prayer")
    .optional()
    .isBoolean()
    .withMessage("friday_prayer must be a boolean"),

  // Todo: add state,city,district,street
  validatorMiddleware,
];
