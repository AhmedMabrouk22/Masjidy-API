const userServices = require("./../services/userServices");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");
const logger = require("./../config/logger");

exports.getLoggedUser = catchAsync(async (req, res, next) => {
  const user = await userServices.getUser(req.curUser.id);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      user,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let config = {
    page: req.query.page,
    limit: req.query.limit,
  };
  const users = await userServices.getUsers(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    result: users.length,
    data: {
      users,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await userServices.deleteUser(req.params.user_id);
  logger.info(
    `Admin with ID: ${req.curUser.id} delete user with ID: ${req.params.user_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "User deleted successfully",
  });
});

exports.changeUserType = catchAsync(async (req, res, next) => {
  const type = req.body.user_type;
  const id = req.params.user_id;

  await userServices.changeUserType(id, type);
  logger.info(
    `Admin with ID: ${req.curUser.id} change user with ID: ${id} type to ${type}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "User type changed successfully",
  });
});
