const Joi = require('joi');

const categoryValidationSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required()
});

module.exports = { categoryValidationSchema };
