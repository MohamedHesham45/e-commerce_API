const Product = require('../models/product');
const CustomError = require('../utils/CustomError');
const { productValidationSchema } = require('../validations/productValidation');

exports.createProduct = async (req, res) => {
  try {
    const { error } = productValidationSchema.validate(req.body);
    if (error) throw new CustomError(error.details[0].message, 400);
    
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new CustomError("Product not found", 404);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { error } = productValidationSchema.validate(req.body);
    if (error) throw new CustomError(error.details[0].message, 400);

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) throw new CustomError("Product not found", 404);
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new CustomError("Product not found", 404);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
