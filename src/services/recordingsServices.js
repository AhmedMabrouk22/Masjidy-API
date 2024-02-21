const { Recordings } = require("./../models/index");
const buildObj = require("./../utils/buildObj");
const fileUtils = require("./../utils/filesUtils");
const AppError = require("./../config/error");

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
