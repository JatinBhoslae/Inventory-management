import mongoose from 'mongoose';

const stockLedgerSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
  },
  operation_type: {
    type: String,
    enum: ['receipt', 'delivery', 'transfer_in', 'transfer_out', 'adjustment'],
    required: true,
  },
  operation_number: {
    type: String,
    required: true,
  },
  quantity_change: {
    type: Number,
    required: true,
  },
  stock_before: {
    type: Number,
    required: true,
  },
  stock_after: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

stockLedgerSchema.index({ product: 1, createdAt: -1 });
stockLedgerSchema.index({ warehouse: 1 });
stockLedgerSchema.index({ operation_type: 1 });

const StockLedger = mongoose.model('StockLedger', stockLedgerSchema);

export default StockLedger;
