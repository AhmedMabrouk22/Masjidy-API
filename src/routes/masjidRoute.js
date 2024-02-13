const express = require("express");

const { addMasjid } = require("./../controllers/masjidController");
const masjidValidators = require("./../validators/masjidValidators");
const uploadImage = require("./../middlewares/uploadImageMiddleware");

const { protect, restrictTo } = require("./../middlewares/authmiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadImage.uploadMultiImages("images", 5),
    uploadImage.resizeImage("Masjid"),
    masjidValidators.createMasjid,
    addMasjid
  );

module.exports = router;
