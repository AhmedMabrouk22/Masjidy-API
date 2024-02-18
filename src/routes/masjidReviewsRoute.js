const express = require("express");

const {
  createReview,
  getAllReviews,
  setUser_idAndMasjidId,
  updateReviews,
  deleteReview,
} = require("./../controllers/masjidReviewsController");
const { protect, restrictTo } = require("./../middlewares/authmiddleware");
const reviewValidator = require("./../validators/masjidReviewsValidator");
const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .post(
    protect,
    restrictTo("user"),
    setUser_idAndMasjidId,
    reviewValidator.addReview,
    createReview
  )
  .get(getAllReviews);

router
  .route("/:review_id")
  .delete(
    protect,
    restrictTo("user", "manager", "admin"),
    reviewValidator.reviewId,
    deleteReview
  )
  .patch(
    protect,
    restrictTo("user"),
    reviewValidator.reviewId,
    reviewValidator.updateReviews,
    updateReviews
  );

module.exports = router;
