const Joi = require("joi");

const productSchema = Joi.object({
  title: Joi.string().required().messages({
      'any.required': 'Product title is required.',
      'string.empty': 'Product title cannot be empty.'
  }),
  price: Joi.number().positive().required().messages({
      'any.required': 'Product price is required.',
      'number.positive': 'Product price must be a positive number.'
  })
});

const itemSchema = Joi.object({
  product: productSchema,
  quantity: Joi.number().greater(0).required().messages({
      'any.required': 'Quantity is required.',
      'number.base': 'Quantity must be a number.',
      'number.greater': 'Quantity must be greater than 0.'
  })
});

const itemsArraySchema = Joi.array().items(itemSchema).required().messages({
  'array.base': 'Items must be an array.',
  'any.required': 'Items array is required.'
});

module.exports = {
  itemsArraySchema
};
