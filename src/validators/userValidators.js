const { body } = require("express-validator");
const validatorMiddleware = require("./../middlewares/validatorsMiddleware");

exports.createUserValidator = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validatorMiddleware,
];

exports.checkEmail = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  validatorMiddleware,
];

exports.checkResetCode = [
  body("code").notEmpty().withMessage("Code is required"),
  validatorMiddleware,
];

exports.checkPassword = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validatorMiddleware,
];
