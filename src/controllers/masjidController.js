const masjidServices = require("./../services/masjidServices");
const catchAsync = require("./../utils/catchAsync");
const httpStatus = require("./../utils/httpStatus");
const logger = require("./../config/logger");

exports.addMasjid = catchAsync(async (req, res, next) => {
  const masjid = await masjidServices.addMasjid(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} add masjid ${masjid.name} with ID ${masjid.id}`
  );
  res.status(201).json({
    status: httpStatus.SUCCESS,
    message: "Masjid added successfully",
    data: {
      masjid_id: masjid.id,
    },
  });
});

exports.deleteMasjid = catchAsync(async (req, res, next) => {
  await masjidServices.deleteMasjid(req.params.masjid_id);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} delete masjid with ID ${req.params.masjid_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Masjid deleted successfully",
  });
});

exports.getMasjid = catchAsync(async (req, res, next) => {
  let config = {};
  config.masjid_id = req.params.masjid_id;
  if (req.url.startsWith("/search")) {
    config.search = true;
    config.user_id = req.curUser.id;
  }

  const masjid = await masjidServices.getMasjid(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: {
      masjid,
    },
  });
});

exports.getAllMasjids = catchAsync(async (req, res, next) => {
  let config = {
    page: req.query.page,
    limit: req.query.limit,
  };
  if (req.query.page) delete req.query.page;
  if (req.query.limit) delete req.query.limit;
  config.filter = req.query;

  const masjids = await masjidServices.getAllMasjids(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    result: masjids.length,
    data: {
      masjids,
    },
  });
});

exports.updateMasjid = catchAsync(async (req, res, next) => {
  req.body.id = req.params.masjid_id;

  await masjidServices.updateMasjid(req.body);
  logger.info(
    `${req.curUser.user_type} with ID ${req.curUser.id} update masjid with ID ${req.params.masjid_id}`
  );
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Masjid updated successfully",
    data: {
      masjid_id: req.params.masjid_id,
    },
  });
});

exports.getFavorite = catchAsync(async (req, res, next) => {
  const config = {
    page: req.query.page,
    limit: req.query.limit,
    user_id: req.curUser.id,
  };
  const masjids = await masjidServices.getFavorite(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { masjids },
  });
});

exports.addFavorite = catchAsync(async (req, res, next) => {
  const data = {
    user_id: req.curUser.id,
    masjid_id: req.body.masjid_id,
  };
  await masjidServices.addFavorite(data);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Favorite added successfully",
  });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const data = {
    user_id: req.curUser.id,
    masjid_id: req.params.masjid_id,
  };
  await masjidServices.deleteFavorite(data);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Favorite deleted successfully",
  });
});

exports.getSearchHistory = catchAsync(async (req, res, next) => {
  const config = {
    user_id: req.curUser.id,
  };
  const history = await masjidServices.getSearchHistory(config);
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { history },
  });
});

exports.getMostSearch = catchAsync(async (req, res, next) => {
  const history = await masjidServices.getMostSearch();
  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { history },
  });
});
