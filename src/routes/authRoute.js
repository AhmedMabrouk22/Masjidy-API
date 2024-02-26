const express = require("express");

const {
  signup,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
  refreshToken,
} = require("../controllers/authController");
const userValidators = require("./../validators/userValidators");
const { protect } = require("./../middlewares/authmiddleware");
const router = express.Router();

router.route("/signup").post(userValidators.createUserValidator, signup);
router
  .route("/login")
  .post(userValidators.checkEmail, userValidators.checkPassword, login);
router.route("/forgetPassword").post(userValidators.checkEmail, forgetPassword);
router
  .route("/verifyResetCode")
  .post(
    userValidators.checkEmail,
    userValidators.checkResetCode,
    verifyResetCode
  );
router
  .route("/resetPassword")
  .post(userValidators.checkEmail, userValidators.checkPassword, resetPassword);

router.route("/refreshToken").post(refreshToken);
router.get("/me", protect);

module.exports = router;
