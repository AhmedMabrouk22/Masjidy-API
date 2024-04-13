const { body, param } = require("express-validator");
const validatorMiddleware = require("./../middlewares/validatorsMiddleware");
const AppError = require("../config/error");

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

exports.deleteUserValidator = [
  param("user_id").notEmpty().withMessage("User ID is required"),
  param("user_id").custom((value, { req }) => {
    if (value == req.curUser.id) {
      throw new AppError(400, "You cannot delete your own account", true);
    }
    return true;
  }),
  validatorMiddleware,
];

exports.changeUserType = [
  param("user_id").notEmpty().withMessage("User ID is required").isInt({
    min: 1,
  }),
  param("user_id").custom((value, { req }) => {
    if (value == req.curUser.id) {
      throw new AppError(400, "You cannot change your own account type", true);
    }
    return true;
  }),
  body("user_type")
    .notEmpty()
    .withMessage("user type is require")
    .isIn(["user", "admin", "manager"])
    .withMessage("Invalid user type"),
  validatorMiddleware,
];
