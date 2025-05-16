import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  try {
    const query = req.query;
    let sql = 'SELECT * FROM Products WHERE is_active = 1';
    const params = [];

    // Apply filters if they exist
    if (query.category) {
      sql += ' AND category = ?';
      params.push(query.category);
    }

    if (query.search) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${query.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (query.featured === 'true') {
      sql += ' AND featured = 1';
    }

    // Add sorting
    sql += ' ORDER BY ' + (query.sort || 'name');

    // Execute query
    const products = db.prepare(sql).all(...params);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get a single product
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM Products WHERE product_id = ?').get(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a new product
router.post('/', (req, res) => {
  try {
    const {
      sku, name, description, price, cost, category,
      subcategory, tags, material, color, weight,
      dimensions, stock_quantity, low_stock_threshold,
      eco_friendly_rating, featured, image_url
    } = req.body;
    
    // Validate required fields
    if (!sku || !name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Please provide required fields: sku, name, price, category'
      });
    }
    
    // Check if SKU already exists
    const existingSku = db.prepare('SELECT sku FROM Products WHERE sku = ?').get(sku);
    if (existingSku) {
      return res.status(400).json({
        success: false,
        error: 'Product with this SKU already exists'
      });
    }
    
    // Insert new product
    const result = db.prepare(`
      INSERT INTO Products (
        sku, name, description, price, cost, category, subcategory,
        tags, material, color, weight, dimensions, stock_quantity,
        low_stock_threshold, eco_friendly_rating, featured, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sku, name, description, price, cost, category, subcategory,
      tags, material, color, weight, dimensions, stock_quantity || 0,
      low_stock_threshold || 5, eco_friendly_rating, featured ? 1 : 0, image_url
    );
    
    // Get the inserted product
    const product = db.prepare('SELECT * FROM Products WHERE product_id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update a product
router.put('/:id', (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku, name, description, price, cost, category,
      subcategory, tags, material, color, weight,
      dimensions, stock_quantity, low_stock_threshold,
      eco_friendly_rating, featured, image_url, is_active
    } = req.body;
    
    // Check if product exists
    const product = db.prepare('SELECT * FROM Products WHERE product_id = ?').get(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Update product
    db.prepare(`
      UPDATE Products SET
        sku = COALESCE(?, sku),
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        cost = COALESCE(?, cost),
        category = COALESCE(?, category),
        subcategory = COALESCE(?, subcategory),
        tags = COALESCE(?, tags),
        material = COALESCE(?, material),
        color = COALESCE(?, color),
        weight = COALESCE(?, weight),
        dimensions = COALESCE(?, dimensions),
        stock_quantity = COALESCE(?, stock_quantity),
        low_stock_threshold = COALESCE(?, low_stock_threshold),
        eco_friendly_rating = COALESCE(?, eco_friendly_rating),
        featured = COALESCE(?, featured),
        image_url = COALESCE(?, image_url),
        is_active = COALESCE(?, is_active),
        last_updated = CURRENT_TIMESTAMP
      WHERE product_id = ?
    `).run(
      sku, name, description, price, cost, category, subcategory,
      tags, material, color, weight, dimensions, stock_quantity,
      low_stock_threshold, eco_friendly_rating, featured, image_url, is_active,
      productId
    );
    
    // Get the updated product
    const updatedProduct = db.prepare('SELECT * FROM Products WHERE product_id = ?').get(productId);
    
    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a product (soft delete)
router.delete('/:id', (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const product = db.prepare('SELECT * FROM Products WHERE product_id = ?').get(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Soft delete by setting is_active to 0
    db.prepare('UPDATE Products SET is_active = 0 WHERE product_id = ?').run(productId);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 