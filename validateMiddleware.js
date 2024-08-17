const { categorySchema, productSchema } = require('./schemas');



const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    
    const validationError = new Error(error.details[0].message);
    validationError.status = 400; 
    return next(validationError);
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    
    const validationError = new Error(error.details[0].message);
    validationError.status = 400; 
    return next(validationError);
  }
  next();
};

module.exports = {
  validateCategory,
  validateProduct
};
