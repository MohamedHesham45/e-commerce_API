
const updateProductSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Title should be a type of text',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title should have a minimum length of 3 characters',
      'string.max': 'Title should have a maximum length of 100 characters',
    }),
  description: Joi.string(),
  categoryID: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Category ID should be a valid ObjectId',
    }),
  price: Joi.number()
    .positive()
    .messages({
      'number.base': 'Price should be a number',
      'number.positive': 'Price must be a positive number',
    }),
  discountPercentage: Joi.number()
    .min(0)
    .max(100)
    .allow(null, ''),
  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock should be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock must be at least 0',
    }),
  brand: Joi.string().allow(null, ''),
  dimensions: Joi.string().allow(null, ''),
  warrantyInformation: Joi.string().allow(null, ''),
  meta: Joi.object({
    barcode: Joi.string().allow(null, ''),
  }).allow(null, ''),
  images: Joi.array().items(imageSchema).allow(null, ''),
  thumbnail: imageSchema
    .messages({
      'object.base': 'Thumbnail must be an object',
    }),
});
