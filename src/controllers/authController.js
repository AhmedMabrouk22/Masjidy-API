const catchAsync = require("./../utils/catchAsync");
const userServices = require("./../services/userServices");
const httpStatus = require("./../utils/httpStatus");

exports.signup = catchAsync(async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  const user = await userServices.createUser({
    first_name,
    last_name,
    email,
    password,
  });

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userServices.login(email, password);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      user,
    },
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  await userServices.forgetPassword(email);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Password reset code sent to your email",
  });
});

exports.verifyResetCode = catchAsync(async (req, res, next) => {
  const { email, code } = req.body;
  await userServices.verifyResetCode(email, code);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Password reset code verified",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;
  const user = await userServices.resetPassword(email, password);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Password reset successfully",
    access_token: user.access_token,
    refresh_token: user.refresh_token,
  });
});
