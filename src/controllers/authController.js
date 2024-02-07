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
