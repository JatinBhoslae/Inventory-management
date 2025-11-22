import express from 'express';
import Product from '../models/Product.js';
import StockLedger from '../models/StockLedger.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/ledger', protect, async (req, res) => {
  try {
    const { product, warehouse, operation_type, limit = 100 } = req.query;
    
    const filter = {};
    if (product) filter.product = product;
    if (warehouse) filter.warehouse = warehouse;
    if (operation_type) filter.operation_type = operation_type;

    const ledger = await StockLedger.find(filter)
      .populate('product')
      .populate('warehouse')
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/receipt', protect, async (req, res) => {
  try {
    const { product_id, warehouse_id, quantity, operation_number } = req.body;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const stock_before = product.current_stock;
    const stock_after = stock_before + quantity;

    product.current_stock = stock_after;
    await product.save();

    await StockLedger.create({
      product: product_id,
      warehouse: warehouse_id,
      operation_type: 'receipt',
      operation_number,
      quantity_change: quantity,
      stock_before,
      stock_after,
      user: req.user._id,
    });

    res.json({ message: 'Receipt recorded successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/delivery', protect, async (req, res) => {
  try {
    const { product_id, warehouse_id, quantity, operation_number } = req.body;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.current_stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const stock_before = product.current_stock;
    const stock_after = stock_before - quantity;

    product.current_stock = stock_after;
    await product.save();

    await StockLedger.create({
      product: product_id,
      warehouse: warehouse_id,
      operation_type: 'delivery',
      operation_number,
      quantity_change: -quantity,
      stock_before,
      stock_after,
      user: req.user._id,
    });

    res.json({ message: 'Delivery recorded successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/adjustment', protect, async (req, res) => {
  try {
    const { product_id, warehouse_id, new_quantity, operation_number, reason } = req.body;

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const stock_before = product.current_stock;
    const quantity_change = new_quantity - stock_before;

    product.current_stock = new_quantity;
    await product.save();

    await StockLedger.create({
      product: product_id,
      warehouse: warehouse_id,
      operation_type: 'adjustment',
      operation_number,
      quantity_change,
      stock_before,
      stock_after: new_quantity,
      user: req.user._id,
    });

    res.json({ message: 'Stock adjustment recorded successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ is_active: true });
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$current_stock', '$min_stock_level'] },
      is_active: true,
    });

    const recentReceipts = await StockLedger.countDocuments({
      operation_type: 'receipt',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const recentDeliveries = await StockLedger.countDocuments({
      operation_type: 'delivery',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.json({
      totalProducts,
      lowStockCount,
      recentReceipts,
      recentDeliveries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
