const express = require("express");

const {
  getNotifications,
} = require("./../controllers/notificationsController");
const { protect, restrictTo } = require("./../middlewares/authmiddleware");

const router = express.Router();

router.route("/").get(protect, restrictTo("user"), getNotifications);

module.exports = router;
