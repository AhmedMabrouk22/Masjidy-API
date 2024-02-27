const sequelize = require("../config/db");
const { Lesson, LessonTime, Masjid, Sheikh } = require("./../models/index");
const buildObj = require("./../utils/buildObj");
const AppError = require("./../config/error");

/**
 * Creates a new lesson.
 *
 * @param {Object} lesson - The lesson object to be created
 * @return {Promise} The newly created lesson
 */
exports.createLesson = async (lesson) => {
  try {
    const lessonObj = buildObj(lesson, Lesson.getAttributes());
    const newLesson = await Lesson.create(
      {
        ...lessonObj,
        lesson_times: lesson.date,
      },
      {
        include: [LessonTime],
      }
    );

    return newLesson;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves lessons based on the provided configuration.
 *
 * @param {Object} config - The configuration object containing page, limit, masjid_id, sheikh_id, and day.
 * @return {Array} An array of lessons that match the provided configuration.
 */
exports.getAllLessons = async (config) => {
  try {
    const page = config.page * 1 || 1;
    const limit = config.limit * 1 || 10;
    const skip = (page - 1) * limit;

    let where = {};
    if (config.masjid_id) {
      where.masjid_id = config.masjid_id;
    }

    if (config.sheikh_id) {
      where.sheikh_id = config.sheikh_id;
    }

    if (config.day) {
      where.day = config.day;
    }

    const lessons = await Lesson.findAll({
      offset: skip,
      limit: limit,
      where: where,
      include: [
        {
          model: LessonTime,
          attributes: {
            exclude: ["lesson_id", "id", "createdAt", "updatedAt"],
          },
        },
        {
          model: Masjid,
          attributes: ["name", "id"],
        },
        {
          model: Sheikh,
          attributes: ["id", "name", "image_path"],
        },
      ],
    });
    return lessons;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a lesson by its ID, along with associated lesson time, masjid, and sheikh information.
 *
 * @param {number} lesson_id - The ID of the lesson to retrieve
 * @return {object} The retrieved lesson object
 */
exports.getLesson = async (lesson_id) => {
  try {
    const lesson = await Lesson.findOne({
      where: { id: lesson_id },
      attributes: {
        exclude: ["masjid_id", "sheikh_id"],
      },
      include: [
        {
          model: LessonTime,
          attributes: {
            exclude: ["lesson_id", "id", "createdAt", "updatedAt"],
          },
        },
        {
          model: Masjid,
          attributes: ["name", "id"],
        },
        {
          model: Sheikh,
          attributes: ["id", "name", "image_path"],
        },
      ],
    });
    if (!lesson) {
      throw new AppError(404, "Lesson not found", true);
    }
    return lesson;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a lesson by its ID.
 *
 * @param {number} lesson_id - The ID of the lesson to be deleted
 * @return {Promise} A Promise that resolves when the lesson is deleted
 */
exports.deleteLesson = async (lesson_id) => {
  try {
    const lesson = await Lesson.findOne({ where: { id: lesson_id } });
    if (!lesson) {
      throw new AppError(404, "Lesson not found", true);
    }
    await lesson.destroy();
  } catch (error) {
    throw error;
  }
};

/**
 * Update a lesson in the database.
 *
 * @param {Object} lesson - The lesson object to be updated
 * @return {Promise} A promise that resolves once the lesson is updated
 */
exports.updateLesson = async (lesson) => {
  try {
    const lessonObj = buildObj(lesson, Lesson.getAttributes());
    const lessonTimeObj = buildObj(lesson, LessonTime.getAttributes());

    // check if lesson is exists
    const lessonExists = await Lesson.findOne({ where: { id: lesson.id } });
    if (!lessonExists) {
      throw new AppError(404, "Lesson not found", true);
    }

    await sequelize.transaction(async (t) => {
      await Lesson.update(
        lessonObj,
        {
          where: { id: lesson.id },
        },
        { transaction: t }
      );

      await LessonTime.update(
        lessonTimeObj,
        {
          where: { lesson_id: lesson.id },
        },
        { transaction: t }
      );
    });
  } catch (error) {
    throw error;
  }
};
