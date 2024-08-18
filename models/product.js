const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryID: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number },
  stock: { type: Number, required: true },
  brand: { type: String },
  dimensions: { type: String },
  warrantyInformation: { type: String },
  meta: { barcode: { type: String } },
  images: [String],
  thumbnail: { type: String },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewText: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
  rating: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.methods.calculateRating = function () {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    this.rating = sum / this.reviews.length;
  } else {
    this.rating = 0;
  }
  return this.rating;
};

module.exports = mongoose.model("Product", productSchema);
