import express from 'express';
import Warehouse from '../models/Warehouse.js';
import { protect, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ name: 1 });
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, managerOrAdmin, async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, managerOrAdmin, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (warehouse) {
      res.json(warehouse);
    } else {
      res.status(404).json({ message: 'Warehouse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, managerOrAdmin, async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (warehouse) {
      await warehouse.deleteOne();
      res.json({ message: 'Warehouse removed' });
    } else {
      res.status(404).json({ message: 'Warehouse not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
