const fs = require("fs");

const logger = require("./../config/logger");
const { generatePath } = require("./filePathUtils");

const unlinkFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      logger.error(err.message, { obj: err.stack });
    } else {
      logger.info("File deleted successfully");
    }
  });
};

const deleteFiles = (filesPaths) => {
  for (const file of filesPaths) {
    const path = generatePath(file);
    unlinkFile(path);
  }
};

module.exports = { deleteFiles };
