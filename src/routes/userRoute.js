const express = require("express");

const { protect, restrictTo } = require("../middlewares/authmiddleware");
const {
  getLoggedUser,
  getAllUsers,
  deleteUser,
  changeUserType,
} = require("./../controllers/userController");

const userValidator = require("./../validators/userValidators");
const { signup } = require("./../controllers/authController");

const router = express.Router();

router.route("/me").get(protect, getLoggedUser);

router
  .route("/")
  .get(protect, restrictTo("admin", "manager"), getAllUsers)
  .post(
    protect,
    restrictTo("admin"),
    userValidator.createUserValidator,
    signup
  );

router
  .route("/:user_id")
  .delete(
    protect,
    restrictTo("admin"),
    userValidator.deleteUserValidator,
    deleteUser
  )
  .patch(
    protect,
    restrictTo("admin"),
    userValidator.changeUserType,
    changeUserType
  );

module.exports = router;
