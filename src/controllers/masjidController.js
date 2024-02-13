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
