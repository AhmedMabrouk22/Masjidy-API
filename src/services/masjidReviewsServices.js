const { MasjidReviews, Masjid, User } = require("./../models/index");
const buildObj = require("./../utils/buildObj");
const AppError = require("./../config/error");

exports.createReview = (review) => {
  try {
    const reviewObj = buildObj(review, MasjidReviews.getAttributes());

    // check if user exists
    const user = User.findByPk(reviewObj.user_id);
    if (!user) {
      throw new AppError(404, "User not found", true);
    }

    // check if masjid exists
    const masjid = Masjid.findByPk(reviewObj.masjid_id);
    if (!masjid) {
      throw new AppError(404, "Masjid not found", true);
    }

    // check if user has already reviewed masjid
    const userReview = MasjidReviews.findOne({
      where: {
        user_id: reviewObj.user_id,
        masjid_id: reviewObj.masjid_id,
      },
    });
    if (userReview) {
      throw new AppError(400, "User has already reviewed masjid", true);
    }

    const newReview = MasjidReviews.create(reviewObj);
    return newReview;
  } catch (error) {
    throw error;
  }
};

exports.getAllReviews = async (masjid_id, page, limit) => {
  try {
    page = page * 1 || 1;
    limit = limit * 1 || 10;
    const skip = (page - 1) * limit;
    const reviews = await MasjidReviews.findAll({
      offset: skip,
      limit: limit,
      where: { masjid_id: masjid_id },
    });
    return reviews;
  } catch (error) {
    throw error;
  }
};

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
