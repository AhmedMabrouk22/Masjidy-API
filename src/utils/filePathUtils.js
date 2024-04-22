const path = require("path");

const generatePath = (fileName) => {
  let uploadPath = path.join(__dirname, "..");
  // if (process.env.NODE_ENV === "development") {
  //   uploadPath = path.join(__dirname, "..");
  // }

  if (fileName.startsWith("Masjid")) {
    return path.join(uploadPath, process.env.UPLOADS_PATH, "masjids", fileName);
  } else if (fileName.startsWith("Sheikh")) {
    return path.join(uploadPath, process.env.UPLOADS_PATH, "sheikhs", fileName);
  } else if (fileName.startsWith("Recordings")) {
    return path.join(
      uploadPath,
      process.env.UPLOADS_PATH,
      "recordings",
      fileName
    );
  }
};

module.exports = {
  generatePath,
};
