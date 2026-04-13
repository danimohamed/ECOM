const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  salePrice: {
    type: Number,
    min: 0,
    default: null,
  },
  category: {
    type: String,
    required: true,
    enum: ['upperwear', 'lowerwear', 'flexgear'],
  },
  sizes: [{
    size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL'] },
    stock: { type: Number, default: 0, min: 0 },
  }],
  images: [{
    url: String,
    publicId: String,
  }],
  gradient: {
    type: String,
    default: 'linear-gradient(135deg,#1a1a1a,#3d3d3d)',
  },
  badge: {
    type: String,
    enum: ['NEW', 'BEST', 'PRE-ORDER', 'SOLD OUT', 'LIMITED', null],
    default: null,
  },
  materials: {
    type: String,
    default: '',
  },
  shippingInfo: {
    type: String,
    default: 'Ships within 3-5 business days worldwide.',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  totalStock: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  this.totalStock = this.sizes.reduce((sum, s) => sum + s.stock, 0);
  if (this.totalStock === 0 && this.badge !== 'PRE-ORDER') {
    this.badge = 'SOLD OUT';
  }
  next();
});

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
