const multer = require("multer");

const AppError = require("./../config/error");
const catchAsync = require("../utils/catchAsync");
const resizeImageUtils = require("../utils/resizeImageUtils");
const { generatePath } = require("./../utils/filePathUtils");

const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Invalid file type, only images allows", true), false);
  }
};

const resizeImage = (imageType) =>
  catchAsync(async (req, res, next) => {
    if (!imageType) {
      return next(
        new AppError(
          500,
          "Some thing error in type of image in resize image middleware"
        ),
        false
      );
    }

    if (req.file) {
      const fileName = resizeImageUtils.fileName(imageType, "jpeg");
      const path = generatePath(fileName);
      await resizeImageUtils.resizeImage(req.file.buffer, fileName);
      req.body.image = fileName;
    }

    if (req.files) {
      req.body.images = [];
      for (let i = 0; i < req.files.length; i++) {
        const fileName = resizeImageUtils.fileName(imageType, "jpeg");
        const path = generatePath(fileName);
        await resizeImageUtils.resizeImage(req.files[i].buffer, fileName);
        req.body.images.push(fileName);
      }
    }

    next();
  });

const uploadSingleImage = (imageName) =>
  multer({
    storage: multerStorage,
    fileFilter: fileFilter,
  }).single(imageName);

const uploadMultiImages = (images, maxCount) =>
  multer({
    storage: multerStorage,
    fileFilter: fileFilter,
  }).array(images, maxCount);

module.exports = {
  resizeImage,
  uploadSingleImage,
  uploadMultiImages,
};
