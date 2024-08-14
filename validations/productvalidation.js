const Joi = require('joi');

const productValidationSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  categoryID: Joi.number().required(),  // Only categoryID is required
  price: Joi.number(),
  discountPercentage: Joi.number().min(0).max(100),
  stock: Joi.number(),
  brand: Joi.string(),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    depth: Joi.number(),
  }),
  warrantyInformation: Joi.string(),
  availabilityStatus: Joi.string().valid('In Stock', 'Out of Stock'),
  returnPolicy: Joi.string(),
  meta: Joi.object({
    barcode: Joi.string(),
  }),
  images: Joi.array().items(Joi.string()),
  thumbnail: Joi.string(),
});

module.exports = { productValidationSchema };
