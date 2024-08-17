

const { categorySchema, productSchema } = require('./schemas'); 
const connectDB = require('./database');


const validateCategory = (category) => {
  const { error } = categorySchema.validate(category);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

const validateProduct = (product) => {
  const { error } = productSchema.validate(product);
  if (error) {
    throw new Error(error.details[0].message);
  }
};


const createCategory = async (category) => {
  validateCategory(category); 
  const db = await connectDB();
  const result = await db.collection('Category').insertOne(category);
  return await db.collection('Category').findOne({ _id: result.insertedId });
};
 
const createProduct = async (product) => {
  validateProduct(product);
  const db = await connectDB();
  const result = await db.collection('Product').insertOne(product);
  return await db.collection('Product').findOne({ _id: result.insertedId });
};

const getAllCategories = async () => {
  const db = await connectDB();
  return await db.collection('Category').find().toArray();
};

const getAllProducts = async () => {
  const db = await connectDB();
  return await db.collection('Product').find().toArray();
};

const getCategoryById = async (id) => {
  if (!id) {
    throw new Error('Invalid category ID format');
  }
  const db = await connectDB();
  const category = await db.collection('Category').findOne({ _id: id });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const getProductById = async (id) => {
    if (!id) {
    throw new Error('Invalid product ID format');
  }
  const db = await connectDB();
  const product = await db.collection('Product').findOne({ _id: id });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

module.exports = {
  createCategory,
  createProduct,
  getAllCategories,
  getAllProducts,
  getCategoryById,
  getProductById
};
