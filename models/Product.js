const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String, 
    required: false,
    unique: true, 
  },
  title: {
    type: String,
    required: true,
    maxlength: 100, 
  },
  description: {
    type: String,
    required: true,
    maxlength: 500, 
  },
  categoryID: {
    type: Number,
    ref: 'Category', 
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0, 
  },
  brand: {
    type: String,
    required: true,
    maxlength: 100, 
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
      min: 0, 
    },
    height: {
      type: Number,
      required: true,
      min: 0, 
    },
    depth: {
      type: Number,
      required: true,
      min: 0, 
    },
  },
  warrantyInformation: {
    type: String,
    maxlength: 255, 
  },
  availabilityStatus: {
    type: String,
    enum: ['available', 'out of stock', 'preorder'], 
    required: true,
  },
  returnPolicy: {
    type: String,
    maxlength: 500, 
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    updatedAt: {
      type: Date,
      default: Date.now, 
    },
    barcode: {
      type: String, 
      maxlength: 100,
    },
  },
  images: {
    type: [String], 
    validate: {
      validator: function (v) {
        return v.every(url => /^https?:\/\/.+\..+/.test(url));
      },
      message: 'Invalid URL format',
    },
  },
  thumbnail: {
    type: String, 
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Invalid URL format',
    },
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
