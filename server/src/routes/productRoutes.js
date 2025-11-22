import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from '../controllers/productController.js';
import { protect, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/low-stock', protect, getLowStockProducts);
router.get('/:id', protect, getProductById);
router.post('/', protect, managerOrAdmin, createProduct);
router.put('/:id', protect, managerOrAdmin, updateProduct);
router.delete('/:id', protect, managerOrAdmin, deleteProduct);

export default router;
