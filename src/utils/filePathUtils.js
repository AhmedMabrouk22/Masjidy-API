const path = require("path");

const generatePath = (fileName) => {
  let uploadPath = "";
  if (process.env.NODE_ENV === "development") {
    uploadPath = path.join(__dirname, "..");
  }
  if (fileName.startsWith("Masjid")) {
    return path.join(uploadPath, process.env.UPLOADS_PATH, "masjids", fileName);
  }
};

module.exports = {
  generatePath,
};
