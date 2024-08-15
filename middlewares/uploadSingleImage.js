const imagekit = require('../utils/ImageKit');
const sharp = require('sharp');
const CustomError = require('../utils/customError');

const singleImageUpload = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const resizedImageBuffer = await sharp(req.file.buffer)
        .jpeg({ quality: 70 }) 
        .toBuffer();

        const response = await imagekit.upload({
            file: resizedImageBuffer, 
            fileName: `image-${req.user.id}` + Date.now(),
            folder: 'test'
        });

        req.user.image = response.url; 
        req.user.imageId=response.fileId
        next();
    } catch (err) {
        return next(new CustomError('Image upload failed', 500));
    }
};

module.exports = singleImageUpload;
