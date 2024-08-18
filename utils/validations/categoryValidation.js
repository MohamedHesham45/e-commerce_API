const Joi = require('joi');

const categoryValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Title should be a type of text',
    'string.empty': 'Title cannot be empty',
    'any.required': 'Title is a required field'
  })
});

module.exports = { categoryValidationSchema };
