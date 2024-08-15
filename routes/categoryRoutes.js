const express = require('express');
const router = express.Router();
const {createCategory,getCategories,getCategoryById,u,updateCategory,deleteCategory} = require('../controllers/categoryController');

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.patch('/:id',updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
