const express = require("express");

const {
  addSheikh,
  deleteSheikh,
  getAllSheikhs,
  getSheikh,
  updateSheikh,
  getFavorite,
  addFavorite,
  deleteFavorite,
} = require("./../controllers/sheikhControllers");
const sheikhValidators = require("./../validators/sheikhValidators");
const uploadImage = require("./../middlewares/uploadImageMiddleware");
const { protect, restrictTo } = require("./../middlewares/authmiddleware");
const recordingsRoute = require("./recordingsRouter");

const router = express.Router();

router.use("/:sheikh_id/recordings", recordingsRoute);
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
  .route("/favorite")
  .get(protect, restrictTo("user"), getFavorite)
  .post(protect, restrictTo("user"), sheikhValidators.addFav, addFavorite);

router
  .route("/favorite/:sheikh_id")
  .delete(
    protect,
    restrictTo("user"),
    sheikhValidators.sheikhId,
    deleteFavorite
  );

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
