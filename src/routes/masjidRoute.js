const express = require("express");

const {
  addMasjid,
  deleteMasjid,
  getMasjid,
  getAllMasjids,
  updateMasjid,
  getFavorite,
  addFavorite,
  deleteFavorite,
  getSearchHistory,
  getMostSearch,
} = require("./../controllers/masjidController");
const masjidValidators = require("./../validators/masjidValidators");
const uploadImage = require("./../middlewares/uploadImageMiddleware");
const { protect, restrictTo } = require("./../middlewares/authmiddleware");
const masjidReviewRouter = require("./masjidReviewsRoute");

const router = express.Router();

router.use(
  "/:masjid_id/reviews",
  masjidValidators.masjidID,
  masjidReviewRouter
);

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadImage.uploadMultiImages("images", 5),
    uploadImage.resizeImage("Masjid"),
    masjidValidators.createMasjid,
    addMasjid
  )
  .get(getAllMasjids);

router
  .route("/search-history")
  .get(protect, restrictTo("user"), getSearchHistory);
router
  .route("/favorite")
  .get(protect, restrictTo("user"), getFavorite)
  .post(protect, restrictTo("user"), masjidValidators.addFav, addFavorite);

router
  .route("/favorite/:masjid_id")
  .delete(
    protect,
    restrictTo("user"),
    masjidValidators.masjidID,
    deleteFavorite
  );

router.route("/most-search").get(getMostSearch);
router
  .route("/search/:masjid_id")
  .get(protect, restrictTo("user"), masjidValidators.masjidID, getMasjid);

router
  .route("/:masjid_id")
  .get(masjidValidators.masjidID, getMasjid)
  .patch(
    protect,
    restrictTo("admin", "manager"),
    uploadImage.uploadMultiImages("images", 5),
    uploadImage.resizeImage("Masjid"),
    masjidValidators.masjidID,
    masjidValidators.updateMasjid,
    updateMasjid
  )
  .delete(
    protect,
    restrictTo("admin", "manager"),
    masjidValidators.masjidID,
    deleteMasjid
  );

module.exports = router;
