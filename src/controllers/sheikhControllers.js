const sheikhServices = require("./../services/sheikhServices");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");
const logger = require("./../config/logger");

exports.addSheikh = catchAsync(async (req, res, next) => {
  const sheikh = await sheikhServices.addSheikh(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} added sheikh ${sheikh.name} with ID ${sheikh.id}`
  );
  res.status(201).json({
    status: httpStatus.SUCCESS,
    message: "Sheikh added successfully",
    data: {
      sheikh_id: sheikh.id,
    },
  });
});

exports.deleteSheikh = catchAsync(async (req, res, next) => {
  await sheikhServices.deleteSheikh(req.params.sheikh_id);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} deleted sheikh with ID ${req.params.sheikh_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Sheikh deleted successfully",
  });
});

exports.getAllSheikhs = catchAsync(async (req, res, next) => {
  const sheikhs = await sheikhServices.getAllSheikhs(
    req.query.page,
    req.query.limit
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    result: sheikhs.length,
    data: {
      sheikhs,
    },
  });
});

exports.getSheikh = catchAsync(async (req, res, next) => {
  const sheikh = await sheikhServices.getSheikh(req.params.sheikh_id);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      sheikh,
    },
  });
});

exports.updateSheikh = catchAsync(async (req, res, next) => {
  req.body.id = req.params.sheikh_id;
  const sheikh = await sheikhServices.updateSheikh(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} updated with ID ${req.params.sheikh_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Sheikh updated successfully",
    data: {
      sheikh_id: req.params.sheikh_id,
    },
  });
});
