const express = require("express");

const {
  addRecordings,
  deleteRecording,
  getRecordings,
  getRecording,
  downloadRecording,
} = require("./../controllers/recordingsController");
const { uploadAudio } = require("./../middlewares/uploadAudioMiddleware");
const { protect, restrictTo } = require("./../middlewares/authmiddleware");
const recordingsValidator = require("./../validators/recordingsValidators");

const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadAudio("audio"),
    recordingsValidator.addRecording,
    addRecordings
  )
  .get(recordingsValidator.getRecordings, getRecordings);

router
  .route("/:recording_id")
  .delete(
    protect,
    restrictTo("admin", "manager"),
    recordingsValidator.recordingID,
    deleteRecording
  )
  .get(recordingsValidator.recordingID, getRecording);

router
  .route("/download/:recording_id")
  .get(recordingsValidator.recordingID, downloadRecording);
module.exports = router;
