const { MasjidReviews, Masjid, User } = require("./../models/index");
const buildObj = require("./../utils/buildObj");
const AppError = require("./../config/error");

/**
 * Creates a new review in the database.
 *
 * @param {Object} review - The review object to be created
 * @return {Object} The newly created review object
 */
exports.createReview = async (review) => {
  try {
    const reviewObj = buildObj(review, MasjidReviews.getAttributes());

    // check if user exists
    const user = await User.findByPk(reviewObj.user_id);
    if (!user) {
      throw new AppError(404, "User not found", true);
    }

    // check if masjid exists
    const masjid = await Masjid.findByPk(reviewObj.masjid_id);
    if (!masjid) {
      throw new AppError(404, "Masjid not found", true);
    }

    // check if user has already reviewed masjid
    const userReview = await MasjidReviews.findOne({
      where: {
        user_id: reviewObj.user_id,
        masjid_id: reviewObj.masjid_id,
      },
    });
    if (userReview) {
      throw new AppError(400, "User has already reviewed masjid", true);
    }

    const newReview = await MasjidReviews.create(reviewObj);
    return newReview;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves all reviews based on the provided configuration.
 *
 * @param {Object} config - The configuration object containing page, limit, and masjid_id
 * @return {Array} The array of reviews based on the provided configuration
 */
exports.getAllReviews = async (config) => {
  try {
    const page = config.page * 1 || 1;
    const limit = config.limit * 1 || 10;
    const skip = (page - 1) * limit;
    let where = {};
    if (config.masjid_id) {
      where.masjid_id = config.masjid_id;
    }
    const reviews = await MasjidReviews.findAll({
      offset: skip,
      limit: limit,
      where,
      attributes: {
        exclude: ["user_id"],
      },
      include: {
        model: User,
        attributes: ["id", "first_name", "last_name", "image_path"],
      },
    });
    return reviews;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a review in the database if it exists and belongs to the user.
 *
 * @param {Object} review - Object containing user_id, review_id, rating, and comment
 * @return {Promise} Promise that resolves when the review is updated
 */
exports.updateReview = async (review) => {
  try {
    // check if review exists and belongs to user
    const { user_id, review_id, rating, comment } = review;
    const isExist = await MasjidReviews.findOne({
      where: { id: review_id, user_id },
    });

    if (!isExist) {
      throw new AppError(404, "Review not found", true);
    }
    await MasjidReviews.update(
      { rating, comment },
      {
        where: { id: review_id, user_id },
      }
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a review if it exists and belongs to the user.
 *
 * @param {number} review_id - The ID of the review to be deleted
 * @param {object} user - The user object who is trying to delete the review
 * @return {Promise<void>} - A Promise that resolves when the review is deleted
 */
exports.deleteReview = async (review_id, user) => {
  try {
    // check if review exists and belongs to user
    let where = {
      id: review_id,
    };
    if (user.user_type == "user") {
      where.user_id = user.id;
    }
    const isExist = await MasjidReviews.findOne({
      where,
    });
    if (!isExist) {
      throw new AppError(404, "Review not found", true);
    }
    await MasjidReviews.destroy({
      where,
    });
  } catch (error) {
    throw error;
  }
};
