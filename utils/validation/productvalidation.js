const Joi = require("joi");

const imageSchema = Joi.object({
  buffer: Joi.binary().required()
    .messages({
      'binary.base': 'Image file data must be provided',
      'any.required': 'Image file data is required',
    }),
  mimetype: Joi.string().regex(/^image\//).required()
    .messages({
      'string.base': 'Image type must be a string',
      'string.pattern.base': 'Invalid image type',
      'any.required': 'Image type is required',
    }),
});

const createProductSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Title should be a type of text',
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title should have a minimum length of 3 characters',
    'string.max': 'Title should have a maximum length of 100 characters',
    'any.required': 'Title is a required field',
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description should be a type of text',
    'string.empty': 'Description cannot be empty',
    'any.required': 'Description is a required field',
  }),
  categoryName: Joi.string().required().messages({
    'string.base': 'Category name should be a type of text',
    'string.empty': 'Category name cannot be empty',
    'any.required': 'Category name is a required field',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price should be a number',
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is a required field',
  }),
  discountPercentage: Joi.number().min(0).max(100).allow(null, ''),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stock should be a number',
    'number.integer': 'Stock must be an integer',
    'number.min': 'Stock must be at least 0',
    'any.required': 'Stock is a required field',
  }),
  brand: Joi.string().allow(null, ''),
  dimensions: Joi.string().allow(null, ''),
  warrantyInformation: Joi.string().allow(null, ''),
  meta: Joi.object({
    barcode: Joi.string().allow(null, ''),
  }).allow(null, ''),
  images: Joi.array().items(imageSchema).required().messages({
    'array.base': 'The images field must be an array of image objects',
    'any.required': 'images must at least one image is required',
  }),
  image: imageSchema.required().messages({
    'object.base': 'image must be an object',
    'any.required': 'image is a required field',
  }),
});

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
  image: imageSchema
    .messages({
      'object.base': 'image must be an object',
    }),
});
module.exports = { updateProductSchema, createProductSchema };

