const Joi = require("joi");

const creatCategoryValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Category name should be a type of text",
    "string.empty": "Category name cannot be empty",
    "any.required": "Category name is a required field",
  }),
});

const updateCategoryValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Category name should be a type of text",
    "string.empty": "Category name cannot be empty",
    "any.required": "Category name is a required field",
  }),
});

module.exports = { updateCategoryValidation, creatCategoryValidation };
