import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  unit_of_measure: {
    type: String,
    required: true,
  },
  initial_stock: {
    type: Number,
    default: 0,
  },
  current_stock: {
    type: Number,
    default: 0,
  },
  min_stock_level: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

productSchema.index({ name: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ current_stock: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
