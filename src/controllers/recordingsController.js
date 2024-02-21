const fs = require("fs");
const stream = require("stream");

const recordingsServices = require("./../services/recordingsServices");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");
const { generatePath } = require("./../utils/filePathUtils");

exports.addRecordings = catchAsync(async (req, res, next) => {
  const recording = await recordingsServices.addRecording(req.body);
  //   TODO: add logger
  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: {
      recording_id: recording.id,
    },
  });
});

exports.deleteRecording = catchAsync(async (req, res, next) => {
  await recordingsServices.deleteRecording(req.params.recording_id);
  //   TODO: add logger
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
