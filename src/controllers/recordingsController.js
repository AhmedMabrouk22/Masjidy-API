const fs = require("fs");
const stream = require("stream");

const recordingsServices = require("./../services/recordingsServices");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");
const logger = require("./../config/logger");
const { generatePath } = require("./../utils/filePathUtils");

exports.addRecordings = catchAsync(async (req, res, next) => {
  const recording = await recordingsServices.addRecording(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} added recording ${recording.title} with ID ${recording.id}`
  );
  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: {
      recording_id: recording.id,
    },
  });
});

exports.deleteRecording = catchAsync(async (req, res, next) => {
  await recordingsServices.deleteRecording(req.params.recording_id);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} deleted recording with ID ${req.params.recording_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Recording deleted successfully",
  });
});

exports.getRecordings = catchAsync(async (req, res, next) => {
  let config = {
    page: req.query.page,
    limit: req.query.limit,
    sheikh_id: req.params.sheikh_id,
    type: req.query.type,
  };

  const recordings = await recordingsServices.getRecordings(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: recordings,
  });
});

exports.getRecording = catchAsync(async (req, res, next) => {
  const recording = await recordingsServices.getRecording(
    req.params.recording_id
  );

  const range = req.headers.range;

  // get audio status
  const audio_path = generatePath(recording.dataValues.audio_path);
  const audioSize = fs.statSync(audio_path).size;

  if (range) {
    // parse range
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${audioSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "audio/mpeg",
    };
    res.writeHead(206, headers);
    const stream = fs.createReadStream(audio_path, { start, end });
    stream.pipe(res);
  } else {
    const head = {
      "Content-Length": audioSize,
      "Content-Type": "audio/mpeg",
    };
    res.writeHead(200, head);

    const audioStream = fs.createReadStream(audio_path);
    const audioReadable = new stream.Readable();
    audioReadable._read = () => {};
    audioReadable.pipe(res);

    audioStream.on("data", (chunk) => {
      audioReadable.push(chunk);
    });

    audioStream.on("end", () => {
      audioReadable.push(null);
    });
  }
});

exports.downloadRecording = catchAsync(async (req, res, next) => {
  const recording = await recordingsServices.getRecording(
    req.params.recording_id
  );
  const audio_path = generatePath(recording.dataValues.audio_path);
  const stat = fs.statSync(audio_path);

  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Content-Length": stat.size,
    "Content-Disposition": `attachment; filename=${recording.dataValues.audio_path}`,
  });
  const audioStream = fs.createReadStream(audio_path);
  audioStream.pipe(res);
});

exports.getFavorite = catchAsync(async (req, res, next) => {
  const config = {
    page: req.query.page,
    limit: req.query.limit,
    user_id: req.curUser.id,
  };

  const recordings = await recordingsServices.getFavorite(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { recordings },
  });
});

exports.addFavorite = catchAsync(async (req, res, next) => {
  const data = {
    user_id: req.curUser.id,
    recording_id: req.body.recording_id,
  };
  await recordingsServices.addFavorite(data);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Favorite added successfully",
  });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const data = {
    user_id: req.curUser.id,
    recording_id: req.params.recording_id,
  };
  await recordingsServices.deleteFavorite(data);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Favorite deleted successfully",
  });
});
