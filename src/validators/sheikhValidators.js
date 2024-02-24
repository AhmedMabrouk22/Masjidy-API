const { body, param } = require("express-validator");
const validatorMiddleware = require("./../middlewares/validatorsMiddleware");
const AppError = require("../config/error");

exports.addSheikh = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("image").optional().notEmpty().withMessage("Image is required"),
  body("masjid_id").notEmpty().withMessage("Masjid id is required"),
  body("phone_numbers")
    .optional()
    .isArray()
    .withMessage("Phone numbers must be array")
    .custom((value) => {
      for (let i = 0; i < value.length; i++) {
        if (!value[i].phone_number || value[i].is_whatsapp === undefined) {
          throw new AppError(400, "Invalid phone number", true);
        }
      }
      return true;
    }),
  body("friday_khutbah")
    .optional()
    .isBoolean()
    .withMessage("Friday khutbah must be a boolean"),
  body("lead_in_tarawih")
    .optional()
    .isBoolean()
    .withMessage("Lead in tarawih must be a boolean"),
  body("has_quran_sessions")
    .optional()
    .isBoolean()
    .withMessage("Has quran sessions must be a boolean"),
  validatorMiddleware,
];

exports.sheikhId = [
  param("sheikh_id")
    .notEmpty()
    .withMessage("sheikh_id is required")
    .isInt()
    .withMessage("Invalid sheikh_id"),
  validatorMiddleware,
];

exports.addFav = [
  body("sheikh_id")
    .notEmpty()
    .withMessage("sheikh_id is required")
    .isInt()
    .withMessage("Invalid sheikh_id"),
  validatorMiddleware,
];
