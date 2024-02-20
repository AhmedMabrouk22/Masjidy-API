const express = require("express");

const { protect, restrictTo } = require("../middlewares/authmiddleware");
const {
  getLoggedUser,
  getAllUsers,
} = require("./../controllers/userController");

const userValidator = require("./../validators/userValidators");
const { signup } = require("./../controllers/authController");

const router = express.Router();

router.route("/me").get(protect, getLoggedUser);

router
  .route("/")
  .get(protect, restrictTo("admin", "manager"), getLoggedUser, getAllUsers)
  .post(
    protect,
    restrictTo("admin"),
    userValidator.createUserValidator,
    signup
  );

module.exports = router;
