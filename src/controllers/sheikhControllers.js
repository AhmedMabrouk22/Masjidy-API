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
  let config = {
    page: req.query.page,
    limit: req.query.limit,
  };
  if (req.query.page) delete req.query.page;
  if (req.query.limit) delete req.query.limit;
  config.filter = req.query;

  const sheikhs = await sheikhServices.getAllSheikhs(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    result: sheikhs.length,
    data: {
      sheikhs,
    },
  });
});

exports.getSheikh = catchAsync(async (req, res, next) => {
  let config = {};
  config.sheikh_id = req.params.sheikh_id;

  if (req.url.startsWith("/search")) {
    config.search = true;
    config.user_id = req.curUser.id;
  }

  const sheikh = await sheikhServices.getSheikh(config);
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

exports.getFavorite = catchAsync(async (req, res, next) => {
  const config = {
    page: req.query.page,
    limit: req.query.limit,
    user_id: req.curUser.id,
  };
  const sheikhs = await sheikhServices.getFavorite(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { sheikhs },
  });
});

exports.addFavorite = catchAsync(async (req, res, next) => {
  const data = {
    user_id: req.curUser.id,
    sheikh_id: req.body.sheikh_id,
  };
  await sheikhServices.addFavorite(data);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Favorite added successfully",
  });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const data = {
    user_id: req.curUser.id,
    sheikh_id: req.params.sheikh_id,
  };
  await sheikhServices.deleteFavorite(data);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Favorite deleted successfully",
  });
});

exports.getSearchHistory = catchAsync(async (req, res, next) => {
  const config = {
    user_id: req.curUser.id,
  };
  const history = await sheikhServices.getSearchHistory(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { history },
  });
});

exports.getMostSearch = catchAsync(async (req, res, next) => {
  const history = await sheikhServices.getMostSearch();
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { history },
  });
});
