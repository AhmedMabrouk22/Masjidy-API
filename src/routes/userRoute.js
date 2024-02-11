const express = require("express");

const { protect, restrictTo } = require("../middlewares/authmiddleware");
const {
  getLoggedUser,
  getAllUsers,
} = require("./../controllers/userController");

const router = express.Router();

router.route("/me").get(protect, getLoggedUser);

router
  .route("/")
  .get(protect, restrictTo("admin", "manager"), getLoggedUser, getAllUsers);

module.exports = router;
