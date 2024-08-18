const Product = require('../models/product');
const Category = require('../models/category'); 



exports.updateProduct = async (req, res) => {
  try {
    const { categoryName, ...updateData } = req.body;

    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(400).send({ error: 'Category not found' });
      }
      updateData.categoryID = category._id;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};