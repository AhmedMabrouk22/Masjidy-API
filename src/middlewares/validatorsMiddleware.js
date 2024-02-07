const { validationResult } = require("express-validator");

const AppError = require("../config/error");

module.exports = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new AppError(400, error.array()[0].msg, true));
  }
  next();
};
