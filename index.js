const express = require('express');
const bodyParser = require('body-parser');
const {
  createCategory,
  createProduct,
  getAllCategories,
  getAllProducts,
  getCategoryById,
  getProductById,
} = require('./crudOperations');
const errorMiddleware = require('./errorMiddleware'); 

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());


app.post('/categories', async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);  
  } catch (error) {
    next(error);  
  }
});


app.get('/categories', async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);  
  }
});


app.get('/categories/:id', async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);  
  }
});


app.post('/product', async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);  
  } catch (error) {
    next(error);  
  }
});


app.get('/product', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);  
  }
});


app.get('/product/:id', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);  
  }
});


app.use(errorMiddleware);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
