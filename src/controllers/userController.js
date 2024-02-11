const userServices = require("./../services/userServices");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");

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
  const users = await userServices.getUsers();
  res.status(200).json({
    status: httpStatus.SUCCESS,
    result: users.length,
    data: {
      users,
    },
  });
});
