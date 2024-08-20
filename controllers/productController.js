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

exports.searchProducts = async (req, res) => {
    try {
      const { name, minPrice, maxPrice, brand, minStock, maxStock, rating, sale, page = 1, limit = 10 } = req.query;
  
      const searchConditions = {};
  
      if (name) {
        // Search in both title and category name
        const category = await Category.findOne({ name: new RegExp(name, 'i') });
        searchConditions.$or = [
          { title: new RegExp(name, 'i') }, // Search by title
        ];
  
        if (category) {
          searchConditions.$or.push({ categoryID: category._id }); // Search by category name
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
  
      if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).send({ error: 'Invalid page number' });
      }
      if (isNaN(pageSize) || pageSize <= 0) {
        return res.status(400).send({ error: 'Invalid limit' });
      }
  
      const skip = (pageNumber - 1) * pageSize;
      const products = await Product.find(searchConditions)
        .populate('categoryID', 'name')
        .skip(skip)
        .limit(pageSize);
  
      const totalProducts = await Product.countDocuments(searchConditions);
      const totalPages = Math.ceil(totalProducts / pageSize);
  
      res.status(200).send({
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
      res.status(500).send({ error: error.message });
    }
  };
  