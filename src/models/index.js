const sequelize = require("./../config/db");
const User = require("./userModel");
const User_Auth = require("./user_auth");
const RefreshToken = require("./refreshTokenModel");
const Masjid = require("./masjidModel");
const MasjidFeatures = require("./masjidFeatures");
const MasjidImages = require("./masjidImagesModel");
const Sheikh = require("./sheikhModel");
const SheikhFeatures = require("./sheikhFeatureModel");
const SheikhPhoneNumbers = require("./sheikhPhonenumbersModel");
const MasjidReviews = require("./masjidReviewsModels");
const Lesson = require("./lessonModel");
const LessonTime = require("./lessonTimeModel");
const Recordings = require("./recordingsModel");
const SearchHistory = require("./searchHistoryModel");
const Notifications = require("./notificationModel");
const {
  SheikhFavorite,
  MasjidFavorite,
  RecordingFavorite,
} = require("./favoriteListModel");
const logger = require("../config/logger");

// relationships

// user
User.hasOne(User_Auth, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User_Auth.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(MasjidFavorite, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(SheikhFavorite, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(RecordingFavorite, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Masjid
Masjid.hasOne(MasjidFeatures, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

MasjidFeatures.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Masjid.hasMany(MasjidImages, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

MasjidImages.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Masjid.hasMany(Sheikh, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Sheikh.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Masjid.hasMany(Lesson, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Lesson.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Sheikh
Sheikh.hasOne(SheikhFeatures, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SheikhFeatures.belongsTo(Sheikh, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Sheikh.hasMany(SheikhPhoneNumbers, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SheikhPhoneNumbers.belongsTo(Sheikh, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Sheikh.hasMany(Lesson, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Lesson.belongsTo(Sheikh, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Recordings
Sheikh.hasMany(Recordings, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Recordings.belongsTo(Sheikh, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Reviews
Masjid.hasMany(MasjidReviews, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

MasjidReviews.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(MasjidReviews, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

MasjidReviews.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Lessons
Lesson.hasMany(LessonTime, {
  foreignKey: "lesson_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

LessonTime.belongsTo(Lesson, {
  foreignKey: "lesson_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Favorite
Recordings.hasMany(RecordingFavorite, {
  foreignKey: "recording_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RecordingFavorite.belongsTo(Recordings, {
  foreignKey: "recording_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Masjid.hasMany(MasjidFavorite, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

MasjidFavorite.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Sheikh.hasMany(SheikhFavorite, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SheikhFavorite.belongsTo(Sheikh, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// History
SearchHistory.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SearchHistory.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Masjid.hasMany(SearchHistory, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SearchHistory.belongsTo(Sheikh, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Notifications
Notifications.belongsTo(Masjid, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Masjid.hasMany(Notifications, {
  foreignKey: "masjid_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Notifications.belongsTo(Sheikh, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Sheikh.hasMany(Notifications, {
  foreignKey: "sheikh_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

if (process.env.NODE_ENV !== "test") {
  sequelize
    .sync({ force: false, alter: true })
    .then(() => {
      logger.info("Database synced");
    })
    .catch((err) => {
      logger.error(err);
    });
}

module.exports = {
  User,
  User_Auth,
  RefreshToken,
  Masjid,
  MasjidFeatures,
  MasjidImages,
  Sheikh,
  SheikhFeatures,
  SheikhPhoneNumbers,
  MasjidReviews,
  Lesson,
  LessonTime,
  Recordings,
  SheikhFavorite,
  MasjidFavorite,
  RecordingFavorite,
  SearchHistory,
  Notifications,
};
