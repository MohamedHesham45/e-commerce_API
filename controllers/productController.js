const Product = require("../models/product");
const Category = require("../models/category");
const CustomError = require('../utils/customError');
const { log } = require("console");

exports.createProduct = async (req, res, next) => {
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
      image,
    } = req.body;

    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return next(new CustomError("Category not found", 400));

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
      image,
    });

    await newProduct.save();
    res.status(201).send({ message: "Product Created successfully", ...newProduct._doc, categoryName: categoryName });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryID', 'name');

    if (!product) {
      return next(new CustomError('Product not found', 404));
    }


    res.status(200).send({
      message:"Product match ID",
      product,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};

exports.getProductsByCategoryAndDiscount = async (req, res, next) => {
  try {
    const categories = await Category.find();

    const productsByCategoryPromises = categories.map(async (category) => {
      return {

        [category.name]: await Product.find({ categoryID: category._id }).limit(5),
      };
    });

    const productsByCategory = await Promise.all(productsByCategoryPromises);

    const productsWithHighDiscount = await Product.find({
      discountPercentage: { $gt: 0 },
    })
      .sort({ discountPercentage: -1 })
      .limit(5);

    res.status(200).send({
      message:"Products by Category and Discount",
      productsByCategory,
      productsWithHighDiscount,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));

  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { categoryName, ...updateData } = req.body;

    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return next(new CustomError("Category not found", 400));

      }
      updateData.categoryID = category._id;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) {
      return next(new CustomError("Product not found", 404));

    }

    res.status(200).send({
      message:"Product updated successfully",
      product});
  } catch (error) {
    return next(new CustomError(error.message, 500));

  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new CustomError("Product not found", 404));

    }

    res.status(200).send({ message: "Product deleted successfully", product });
  } catch (error) {
    return next(new CustomError(error.message, 500));

  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const {
      title,
      category,
      minPrice,
      maxPrice,
      brand,
      minStock,
      maxStock,
      rating,
      sale,
      page = 1,
      limit = 10
    } = req.query;

    const searchConditions = {};

    if (title) {
      searchConditions.title = new RegExp(title, 'i');
    }

    if (category) {
      const categoryDoc = await Category.findOne({ name: new RegExp(category, 'i') });
      console.log(categoryDoc)
      if (categoryDoc) {
        searchConditions.categoryID = categoryDoc._id;
      } else {
        return next(new CustomError("Not have this category ", 409));
      }
    }

    if (minPrice || maxPrice) {
      searchConditions.price = {};
      if (minPrice) searchConditions.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchConditions.price.$lte = parseFloat(maxPrice);
    }

    if (brand) {
      searchConditions.brand = new RegExp(brand, 'i');
    }

    if (minStock || maxStock) {
      searchConditions.stock = {};
      if (minStock) searchConditions.stock.$gte = parseInt(minStock);
      if (maxStock) searchConditions.stock.$lte = parseInt(maxStock);
    }

    if (rating) {
      const ratingValue = parseFloat(rating);
      if (!isNaN(ratingValue)) {
        searchConditions.rating = {
          $gte: Math.floor(ratingValue),
          $lte: Math.floor(ratingValue) + 0.9,
        };
      }
    }

    if (sale === 'true') {
      searchConditions.discountPercentage = { $exists: true, $ne: null };
    } else if (sale === 'false') {
      searchConditions.discountPercentage = { $exists: false };
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const [products, totalProducts] = await Promise.all([
      Product.find(searchConditions)
        .populate('categoryID', 'name')
        .skip(skip)
        .limit(pageSize),
      Product.countDocuments(searchConditions)
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).send({
      message:"Product match yor query",
      products,
      pagination: {
        total: totalProducts,
        pages: totalPages,
        page: pageNumber,
        prev: pageNumber > 1,
        next: pageNumber < totalPages,
      }
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
};


