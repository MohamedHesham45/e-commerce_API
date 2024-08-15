const CustomError = require('../utils/customError');

module.exports = (schema) => async (req, res, next) => {
    try {
        let bodyValidtion={...req.body}
        
        if (req.file) {
            bodyValidtion={...req.body,
                image:{
                    buffer: req.file.buffer,
                    mimetype: req.file.mimetype,
                    }
                }
        }
        
        await schema.validateAsync(bodyValidtion, { abortEarly: false });
        next();
    } catch (err) {
        const messages = err.details.map(detail => detail.message).join(', ');
        return next(new CustomError(messages, 400));
    }
};
