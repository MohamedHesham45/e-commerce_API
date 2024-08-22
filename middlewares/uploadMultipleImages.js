const imagekit = require('../utils/ImageKit');
const CustomError = require('../utils/customError');

const multipleImagesUpload = async (req, res, next) => {
    if (!req.files || !req.files['images'] || req.files['images'].length === 0) {
        return next();
    }
    try {
        const uploadPromises = req.files['images'].map(file => {
            return imagekit.upload({
                file: file.buffer,
                fileName: `image-${req.user.id}-${Date.now()}.jpeg`, 
                folder: 'e-commerce' 
                });
        });

        const responses = await Promise.all(uploadPromises);

        req.body.images = responses.map(response => response.url);
        next();
    } catch (err) {
        return next(new CustomError('Image upload failed', 500));
    }
};

module.exports = multipleImagesUpload;
