const masjidReviewsServices = require("../services/masjidReviewsServices");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("../utils/httpStatus");
const logger = require("./../config/logger");

exports.setUser_idAndMasjidId = (req, res, next) => {
  if (!req.body.user_id) req.body.user_id = req.curUser.id;
  if (!req.body.masjid_id) req.body.masjid_id = req.params.masjid_id;
  next();
};

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await masjidReviewsServices.createReview(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} created review for masjid with ID ${req.params.masjid_id}`
  );
  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await masjidReviewsServices.getAllReviews(
    req.params.masjid_id,
    req.query.page,
    req.query.limit
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.updateReviews = catchAsync(async (req, res, next) => {
  req.body.id = req.params.review_id;
  req.body.user_id = req.curUser.id;
  await masjidReviewsServices.updateReview(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} updated review with ID ${req.params.review_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Review updated successfully",
    data: {
      review_id: req.params.review_id,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await masjidReviewsServices.deleteReview(req.params.review_id, req.curUser);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} deleted review with ID ${req.params.review_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Review deleted successfully",
  });
});
