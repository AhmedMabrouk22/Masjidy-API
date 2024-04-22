const { body, param } = require("express-validator");
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
    .isInt({
      min: 50,
    })
    .withMessage("capacity must be a positive number"),
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
  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isString()
    .toLowerCase(),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .toLowerCase(),
  validatorMiddleware,
];

exports.uploadAndDeleteMasjidImages = [
  body("masjid_id").notEmpty().withMessage("masjid_id is required").isInt(),
  body("images")
    .notEmpty()
    .withMessage("Masjid images is required")
    .isArray({ min: 1, max: 5 })
    .withMessage("images must be an array with at least 1 and at most 5 items"),
  validatorMiddleware,
];

exports.masjidID = [
  param("masjid_id")
    .notEmpty()
    .withMessage("masjid_id is required")
    .isInt()
    .withMessage("Invalid masjid_id"),
  validatorMiddleware,
];

exports.updateMasjid = [
  body("name")
    .notEmpty()
    .withMessage("Masjid name is required")
    .isString()
    .withMessage("Invalid name")
    .optional(),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Masjid description is required")
    .isString(),
  body("capacity")
    .optional()
    .notEmpty()
    .withMessage("capacity is required")
    .isInt({
      min: 50,
    })
    .withMessage("capacity must be a positive number"),
  body("longitude")
    .optional()
    .notEmpty()
    .withMessage("longitude is required")
    .isFloat()
    .withMessage("Invalid longitude"),
  body("latitude")
    .optional()
    .notEmpty()
    .withMessage("latitude is required")
    .isFloat()
    .withMessage("Invalid latitude"),
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
  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isString()
    .toLowerCase()
    .optional(),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .toLowerCase()
    .optional(),
  validatorMiddleware,
];

exports.addFav = [
  body("masjid_id")
    .notEmpty()
    .withMessage("masjid_id is required")
    .isInt()
    .withMessage("Invalid masjid_id"),
  validatorMiddleware,
];
