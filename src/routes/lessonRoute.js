const express = require("express");

const {
  createLesson,
  getLessons,
  deleteLesson,
  updateLesson,
  getLesson,
} = require("./../controllers/lessonController");
const { protect, restrictTo } = require("./../middlewares/authmiddleware");
const lessonValidator = require("./../validators/lessonValidators");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    lessonValidator.createLesson,
    createLesson
  )
  .get(lessonValidator.getLessons, getLessons);

router
  .route("/:lesson_id")
  .get(lessonValidator.lessonId, getLesson)
  .delete(
    protect,
    restrictTo("admin", "manager"),
    lessonValidator.lessonId,
    deleteLesson
  )
  .put(
    protect,
    restrictTo("admin", "manager"),
    lessonValidator.lessonId,
    lessonValidator.createLesson,
    updateLesson
  );

module.exports = router;
