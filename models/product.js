const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // the requer one in mongo
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryID: { type: Number, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number },
  stock: { type: Number, required: true },
  //here
  brand: { type: String },
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number }
  },
  warrantyInformation: { type: String },
  availabilityStatus: { type: String },
  returnPolicy: { type: String },
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: { type: String }
  },
  images: [String],
  thumbnail: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
