const Category = require("../models/category");
const Product = require("../models/product");
const CustomError = require('../utils/customError');

exports.createCategory = async (req, res, next) => {
  try {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return next(new CustomError("Category already exists", 409));
    }
    const category = new Category(req.body);
    await category.save();
    res.status(201).send({ message: "Category Created successfully", category });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).send({ message: "All Categories", categories });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate({ _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!category) return next(new CustomError("Category not found", 400));
    res.status(200).send({ message: "Category Updated successfully", category });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return next(new CustomError("Category not found", 400));

    await Product.deleteMany({ categoryID: category._id });

    res
      .status(200)
      .send({ message: "Category and related products deleted successfully", category });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
