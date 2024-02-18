const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");
const Masjid = require("./masjidModel");

const MasjidReviews = sequelize.define(
  "masjid_reviews",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    masjid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["masjid_id"],
      },
      {
        fields: ["user_id", "masjid_id"],
        unique: true,
      },
    ],
  }
);

MasjidReviews.afterCreate(async (review) => {
  // calculate the avg rating for the masjid
  const cnt = await MasjidReviews.count({
    where: { masjid_id: review.masjid_id },
  });
  const totalRating = await MasjidReviews.sum("rating", {
    where: { masjid_id: review.masjid_id },
  });
  const avgRating = totalRating / cnt;
  await Masjid.update(
    { average_rating: avgRating },
    { where: { id: review.masjid_id } }
  );
});

MasjidReviews.afterBulkUpdate(async (review) => {
  // get masjid_id
  const masjid_id = await MasjidReviews.findOne({
    where: {
      id: review.where.id,
      user_id: review.where.user_id,
    },
    attributes: ["masjid_id"],
  });

  // calculate the avg rating for the masjid
  const cnt = await MasjidReviews.count({
    where: { masjid_id: masjid_id.dataValues.masjid_id },
  });
  const totalRating = await MasjidReviews.sum("rating", {
    where: { masjid_id: masjid_id.dataValues.masjid_id },
  });
  const avgRating = totalRating / cnt;
  await Masjid.update(
    { average_rating: avgRating },
    { where: { id: masjid_id.dataValues.masjid_id } }
  );
});

module.exports = MasjidReviews;
