const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProducts, 
    getProductById 
} = require('../controllers/productController'); // تأكد من اسم الملف هنا

// Define routes
router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
