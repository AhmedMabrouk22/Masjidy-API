const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../config/error");
const { RefreshToken, User } = require("./../models/index");

const verifyExpiration = (token) =>
  token.expireAt.getTime() < new Date(Date.now()).getTime();

exports.protect = catchAsync(async (req, res, next) => {
  // get access and refresh token
  let accessToken, refreshToken;
  if (
    req.headers.access_token &&
    req.headers.access_token.startsWith("Bearer") &&
    req.headers.refresh_token &&
    req.headers.refresh_token.startsWith("Bearer")
  ) {
    accessToken = req.headers.access_token.split(" ")[1];
    refreshToken = req.headers.refresh_token.split(" ")[1];
  }

  if (!accessToken || !refreshToken) {
    return next(new AppError(401, "Please login", true));
  }

  // verify access token
  const decoded = await promisify(jwt.verify)(
    accessToken,
    process.env.JWT_SECRET
  );

  // check if refresh token is exist in DB
  const token = await RefreshToken.findOne({
    where: {
      token: refreshToken,
      user_id: decoded.id,
    },
  });

  if (!token) {
    return next(new AppError(401, "Please login", true));
  }

  // check if refresh token is expired
  if (verifyExpiration(token.dataValues)) {
    return next(
      new AppError(401, "Refresh token expired, please login again", true)
    );
  }

  // get user
  const user = await User.findOne({
    where: {
      id: decoded.id,
    },
    attributes: [
      "id",
      "email",
      "first_name",
      "last_name",
      "image_path",
      "user_type",
    ],
  });

  req.curUser = user.dataValues;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.curUser.user_type)) {
      return next(
        new AppError(
          403,
          "You don't have permission to perform this action",
          true
        )
      );
    }
    next();
  };
};
