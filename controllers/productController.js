const Product = require('../models/product');
const Category = require('../models/category'); 
const CustomError = require('../utils/CustomError');
const { productValidationSchema } = require('../validations/productValidation');
const mongoose = require('mongoose');



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
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new CustomError("Product not found", 404);
    const { error } = productValidationSchema.validate(req.body);
    if (error) throw new CustomError(error.details[0].message, 400);
    Object.assign(product, req.body);
    res.status(200).json(product);
    
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};


exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cleanedId = id.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanedId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(cleanedId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};
