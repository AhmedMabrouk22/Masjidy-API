const { validationResult } = require("express-validator");

const AppError = require("../config/error");
const filesUtils = require("./../utils/filesUtils");

module.exports = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    if (req.body.images) {
      filesUtils.deleteFiles(req.body.images);
    } else if (req.body.image) {
      filesUtils.deleteFiles([req.body.image]);
    }

    return next(new AppError(400, error.array()[0].msg, true));
  }
  next();
};
