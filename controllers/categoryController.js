const Category = require('../models/category');
const CustomError = require('../utils/CustomError');
const { categoryValidationSchema } = require('../validations/categoryValidation');

exports.createCategory = async (req, res) => {
  try {
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) throw new CustomError(error.details[0].message, 400);
    
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) throw new CustomError("Category not found", 404);
    res.status(200).json(category);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) throw new CustomError(error.details[0].message, 400);

    const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!category) throw new CustomError("Category not found", 404);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
  
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) throw new CustomError("Category not found", 404);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
