const { Recordings, RecordingFavorite, Sheikh } = require("./../models/index");
const buildObj = require("./../utils/buildObj");
const fileUtils = require("./../utils/filesUtils");
const AppError = require("./../config/error");

/**
 * Asynchronously adds a recording using the provided data.
 *
 * @param {Object} data - the data for the recording
 * @return {Promise<Object>} a promise that resolves to the newly created recording
 */
exports.addRecording = async (data) => {
  try {
    const recordingObj = buildObj(data, Recordings.getAttributes());
    const newRecording = await Recordings.create(recordingObj);
    return newRecording;
  } catch (error) {
    if (data.audio_path) {
      fileUtils.deleteFiles([data.audio_path]);
    }
    throw error;
  }
};

/**
 * Deletes a recording by its ID.
 *
 * @param {string} recording_id - The ID of the recording to be deleted
 * @return {Promise<void>} A promise that resolves when the recording is successfully deleted
 */
exports.deleteRecording = async (recording_id) => {
  try {
    const recording = await Recordings.findOne({
      where: { id: recording_id },
    });
    if (!recording) {
      throw new AppError(404, "Recording not found", true);
    }
    await recording.destroy();
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves recordings based on the provided configuration.
 *
 * @param {Object} config - Configuration object containing page, limit, sheikh_id, and type
 * @return {Array} An array of recordings based on the provided configuration
 */
exports.getRecordings = async (config) => {
  try {
    const page = config.page * 1 || 1;
    const limit = config.limit * 1 || 10;
    const skip = (page - 1) * limit;

    let where = {};
    if (config.sheikh_id) {
      where.sheikh_id = config.sheikh_id;
    }

    if (config.type) {
      where.type = config.type;
    }

    const recordings = await Recordings.findAll({
      offset: skip,
      limit: limit,
      where,
    });
    return recordings;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a recording by its ID.
 *
 * @param {string} recording_id - The ID of the recording to retrieve
 * @return {Promise<object>} The recording object
 */
exports.getRecording = async (recording_id) => {
  try {
    const recording = await Recordings.findOne({
      where: { id: recording_id },
    });
    if (!recording) {
      throw new AppError(404, "Recording not found", true);
    }
    return recording;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the favorite recordings for a user based on the provided configuration.
 *
 * @param {Object} config - The configuration object containing user_id, page, and limit.
 * @return {Promise<Array>} A promise that resolves to an array of favorite recordings.
 */
exports.getFavorite = async (config) => {
  try {
    if (!config.user_id) {
      throw new AppError(400, "User ID is required", true);
    }

    const page = config.page || 1;
    const limit = config.limit || 10;
    const skip = (page - 1) * limit;
    const user_id = config.user_id;
    const fav = await RecordingFavorite.findAll({
      offset: skip,
      limit: limit,
      where: { user_id: user_id },
      attributes: {
        exclude: ["recording_id", "user_id"],
      },
      include: [
        {
          model: Recordings,
          attributes: ["id", "title"],
          include: [
            {
              model: Sheikh,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    return fav;
  } catch (error) {
    throw error;
  }
};

/**
 * Adds a favorite recording for a user.
 *
 * @param {Object} data - The data object containing user_id and recording_id
 * @return {Promise} A promise that resolves when the recording favorite is created
 */
exports.addFavorite = async (data) => {
  try {
    if (!data.user_id || !data.recording_id) {
      throw new AppError(400, "User ID and Recording ID are required", true);
    }
    await RecordingFavorite.create(data);
  } catch (error) {
    throw error;
  }
};

/**
 * Asynchronously deletes a favorite recording for a user.
 *
 * @param {object} data - An object containing user_id and recording_id
 * @return {Promise<void>} A promise that resolves with no value upon successful deletion
 */
exports.deleteFavorite = async (data) => {
  try {
    if (!data.user_id || !data.recording_id) {
      throw new AppError(400, "User ID and Recording ID are required", true);
    }
    await RecordingFavorite.destroy({
      where: {
        user_id: data.user_id,
        recording_id: data.recording_id,
      },
    });
  } catch (error) {
    throw error;
  }
};
