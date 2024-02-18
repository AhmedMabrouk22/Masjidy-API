const { body, param } = require("express-validator");
const validatorMiddleware = require("./../middlewares/validatorsMiddleware");

exports.addReview = [
  body("masjid_id").exists().withMessage("Masjid id is required"),
  body("user_id").exists().withMessage("User id is required"),
  body("rating").exists().withMessage("Rating is required"),
  body("comment").exists().withMessage("Comment is required"),
  validatorMiddleware,
];

exports.reviewId = [
  param("review_id").exists().withMessage("Review id is required"),
  validatorMiddleware,
];

exports.updateReviews = [
  body("rating").exists().withMessage("Rating is required"),
  body("comment").exists().withMessage("Comment is required"),
  validatorMiddleware,
];
