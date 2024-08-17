const imagekit = require("../utils/ImageKit");
const CustomError = require("../utils/customError");

const deleteImage = async (req, res, next) => {
  try {
    await imagekit.deleteFile(req.user.imageId);
  } catch (err) {
    return next(new CustomError("Image deletion failed", 500));
  }
};

module.exports = deleteImage;