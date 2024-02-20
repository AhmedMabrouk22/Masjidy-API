const lessonServices = require("./../services/lessonService");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");
const logger = require("./../config/logger");

exports.createLesson = catchAsync(async (req, res, next) => {
  const lesson = await lessonServices.createLesson(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} created lesson ${lesson.name} with ID ${lesson.id}`
  );
  res.status(201).json({
    status: httpStatus.SUCCESS,
    message: "Lesson created successfully",
    data: {
      lesson_id: lesson.id,
    },
  });
});

exports.getLessons = catchAsync(async (req, res, next) => {
  let config = {
    page: req.query.page,
    limit: req.query.limit,
  };
  if (req.query.day) {
    config.day = req.query.day;
  }

  if (req.params.masjid_id) {
    config.masjid_id = req.params.masjid_id;
  }

  if (req.params.sheikh_id) {
    config.sheikh_id = req.params.sheikh_id;
  }

  const lessons = await lessonServices.getAllLessons(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      lessons,
    },
  });
});

exports.getLesson = catchAsync(async (req, res, next) => {
  const lesson = await lessonServices.getLesson(req.params.lesson_id);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      lesson,
    },
  });
});

exports.deleteLesson = catchAsync(async (req, res, next) => {
  await lessonServices.deleteLesson(req.params.lesson_id);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} deleted lesson with ID ${req.params.lesson_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Lesson deleted successfully",
  });
});

exports.updateLesson = catchAsync(async (req, res, next) => {
  req.body.id = req.params.lesson_id;
  await lessonServices.updateLesson(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} updated lesson with ID ${req.params.lesson_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Lesson updated successfully",
    data: {
      lesson_id: req.params.lesson_id,
    },
  });
});
