const imagekit=require('../utils/ImageKit')
const CustomError = require('../utils/customError');

const multipleImagesUpload = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new CustomError('No files uploaded', 400));
    }

    try {
        const uploadPromises = req.files.map(file => {
            return imagekit.upload({
                file: file.buffer,
                fileName: file.originalname + Date.now(),
                folder: 'test'
            });
        });

        const responses = await Promise.all(uploadPromises);
        req.body.image = responses.map(response => response.url);
        next();
    } catch (err) {
        return next(new CustomError('Image upload failed', 500));
    }
};

module.exports=multipleImagesUpload
