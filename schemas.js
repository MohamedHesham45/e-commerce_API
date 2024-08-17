
const Joi = require('joi');
const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// ^: Start of the string.
// [0-9a-fA-F]{8}: Eight hexadecimal characters.
// -: Hyphen.
// [0-9a-fA-F]{4}: Four hexadecimal characters.
// -: Hyphen.
// [0-9a-fA-F]{4}: Four hexadecimal characters.
// -: Hyphen.
// [0-9a-fA-F]{4}: Four hexadecimal characters.
// -: Hyphen.
// [0-9a-fA-F]{12}: Twelve hexadecimal characters.
// $: End of the string.

const categorySchema = Joi.object({
  _id: Joi.string().pattern(guidRegex).required(), 
  name: Joi.string().required()
});

const productSchema = Joi.object({
  _id: Joi.string().pattern(guidRegex).required(), 
  title: Joi.string().required(),
  description: Joi.string().required(),
  categoryID: Joi.string().pattern(guidRegex).required(), 
  price: Joi.number().greater(0).required(),
  discountPercentage: Joi.number().min(0).max(100).required(),
  stock: Joi.number().integer().min(0).required(),
  brand: Joi.string().required(),
  dimensions: Joi.object({
    width: Joi.number().greater(0).required(),
    height: Joi.number().greater(0).required(),
    depth: Joi.number().greater(0).required()
  }).required(),
  warrantyInformation: Joi.string().optional(),
  availabilityStatus: Joi.string().valid('available', 'out of stock', 'preorder').required(),
  returnPolicy: Joi.string().optional(),
  meta: Joi.object({
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
    barcode: Joi.string().optional()
  }).required(),
  images: Joi.array().items(Joi.string().uri()).optional(), 
  thumbnail: Joi.string().uri().optional() 
});

module.exports = {
  categorySchema,
  productSchema
};
