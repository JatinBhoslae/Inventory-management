import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, unit_of_measure, initial_stock, min_stock_level } = req.body;

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const product = await Product.create({
      name,
      sku,
      category: category || null,
      unit_of_measure,
      initial_stock: initial_stock || 0,
      current_stock: initial_stock || 0,
      min_stock_level: min_stock_level || 0,
      is_active: true,
    });

    const populatedProduct = await Product.findById(product._id).populate('category');
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.sku = req.body.sku || product.sku;
      product.category = req.body.category !== undefined ? req.body.category : product.category;
      product.unit_of_measure = req.body.unit_of_measure || product.unit_of_measure;
      product.min_stock_level = req.body.min_stock_level !== undefined ? req.body.min_stock_level : product.min_stock_level;
      product.is_active = req.body.is_active !== undefined ? req.body.is_active : product.is_active;

      const updatedProduct = await product.save();
      const populatedProduct = await Product.findById(updatedProduct._id).populate('category');
      res.json(populatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$current_stock', '$min_stock_level'] },
      is_active: true,
    }).populate('category').sort({ current_stock: 1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
