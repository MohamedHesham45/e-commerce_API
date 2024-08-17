const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  _idid: {
    type: Number, 
    required: true,
    unique: true, 
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100, 
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
