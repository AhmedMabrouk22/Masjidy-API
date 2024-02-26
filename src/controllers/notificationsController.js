const notificationsServices = require("./../services/notificationsServices");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");

exports.getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await notificationsServices.getNotifications();
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      notifications,
    },
  });
});
