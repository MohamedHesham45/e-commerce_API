const Product = require("../models/Product");
const Category = require("../models/Category");

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryName,
      price,
      discountPercentage,
      stock,
      brand,
      dimensions,
      warrantyInformation,
      meta,
      images,
      thumbnail,
    } = req.body;

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(400).send({ error: "Category not found" });
    }

    const newProduct = new Product({
      title,
      description,
      categoryID: category._id,
      price,
      discountPercentage,
      stock,
      brand,
      dimensions,
      warrantyInformation,
      meta,
      images,
      thumbnail,
    });

    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
exports.getProductsByCategoryAndDiscount = async (req, res) => {
  try {
    const categories = await Category.find();

    const productsByCategoryPromises = categories.map(async (category) => {
      return {
        category: category.name,
        products: await Product.find({ categoryID: category._id }).limit(5),
      };
    });

    const productsByCategory = await Promise.all(productsByCategoryPromises);

    const productsWithHighDiscount = await Product.find({
      discountPercentage: { $gt: 0 },
    })
      .sort({ discountPercentage: -1 })
      .limit(5);

    res.status(200).json({
      productsByCategory,
      productsWithHighDiscount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { categoryName, ...updateData } = req.body;

    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(400).send({ error: "Category not found" });
      }
      updateData.categoryID = category._id;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
