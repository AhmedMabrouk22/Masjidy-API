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
  // body("user_type")
  //   .optional()
  //   .isIn(["admin", "manger", "user"])
  //   .withMessage("Invalid user type")
  //   .custom((value) => {
  //     if (
  //       (value === "admin" || value === "manager") &&
  //       req.curUser.user_type === "admin"
  //     ) {
  //       return true;
  //     }
  //     throw new Error("You don't have permission to perform this action");
  //   }),
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
