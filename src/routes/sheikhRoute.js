const express = require("express");

const {
  addSheikh,
  deleteSheikh,
  getAllSheikhs,
  getSheikh,
  updateSheikh,
} = require("./../controllers/sheikhControllers");
const sheikhValidators = require("./../validators/sheikhValidators");
const uploadImage = require("./../middlewares/uploadImageMiddleware");
const { protect, restrictTo } = require("./../middlewares/authmiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadImage.uploadSingleImage("image"),
    uploadImage.resizeImage("Sheikh"),
    sheikhValidators.addSheikh,
    addSheikh
  )
  .get(getAllSheikhs);

router
  .route("/:sheikh_id")
  .get(sheikhValidators.sheikhId, getSheikh)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadImage.uploadSingleImage("image"),
    uploadImage.resizeImage("Sheikh"),
    sheikhValidators.sheikhId,
    sheikhValidators.addSheikh,
    updateSheikh
  )
  .delete(
    protect,
    restrictTo("admin", "manager"),
    sheikhValidators.sheikhId,
    deleteSheikh
  );
module.exports = router;
