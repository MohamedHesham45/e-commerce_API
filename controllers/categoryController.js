const Category = require("../models/category");
const Product = require("../models/product");

exports.createCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!category)
      return res.status(400).send({ message: "Category not found" });
    res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category)
      return res.status(400).send({ message: "Category not found" });

    await Product.deleteMany({ categoryID: category._id });

    res
      .status(200)
      .send({ message: "Category and related products deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
