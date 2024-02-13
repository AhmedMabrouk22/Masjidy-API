const sharp = require("sharp");

const AppError = require("../config/error");
const { generatePath } = require("./filePathUtils");

const fileName = (fileType, fileExtension) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  return `${fileType}-${uniqueSuffix}.${fileExtension}`;
};

const resizeImage = async (buffer, imageName) => {
  try {
    const filePath = generatePath(imageName);
    await sharp(buffer)
      .resize(330, 200)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(filePath);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  resizeImage,
  fileName,
};
