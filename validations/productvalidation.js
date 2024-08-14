const Joi = require('joi');

const productValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  categoryID: Joi.number(),
  price: Joi.number(),
  discountPercentage: Joi.number(),
  stock: Joi.number(),
  brand: Joi.string(),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    depth: Joi.number(),
  }),
  warrantyInformation: Joi.string(),
  availabilityStatus: Joi.string(),
  returnPolicy: Joi.string(),
  meta: Joi.object({
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
    barcode: Joi.string()
  }),
  images: Joi.array().items(Joi.string()),
  thumbnail: Joi.string()
});

module.exports = { productValidationSchema };
