import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  try {
    const query = req.query;
    let sql = `
      SELECT o.*, c.first_name, c.last_name, c.email
      FROM Orders o
      JOIN Customers c ON o.customer_id = c.customer_id
    `;
    const params = [];

    // Apply filters if they exist
    if (query.status) {
      sql += ' WHERE o.status = ?';
      params.push(query.status);
    }

    if (query.customer_id) {
      sql += query.status ? ' AND' : ' WHERE';
      sql += ' o.customer_id = ?';
      params.push(query.customer_id);
    }

    if (query.date_from) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' o.order_date >= ?';
      params.push(query.date_from);
    }

    if (query.date_to) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' o.order_date <= ?';
      params.push(query.date_to);
    }

    if (query.min_total) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' o.total_amount >= ?';
      params.push(query.min_total);
    }

    // Add sorting
    sql += ' ORDER BY ' + (query.sort || 'o.order_date DESC');

    // Execute query
    const orders = db.prepare(sql).all(...params);
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get a single order with order items
router.get('/:id', (req, res) => {
  try {
    // Get order details
    const order = db.prepare(`
      SELECT o.*, c.first_name, c.last_name, c.email, c.phone
      FROM Orders o
      JOIN Customers c ON o.customer_id = c.customer_id
      WHERE o.order_id = ?
    `).get(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Get order items
    const orderItems = db.prepare(`
      SELECT oi.*, p.name, p.sku, p.image_url
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `).all(req.params.id);
    
    // Include order items with the order data
    order.items = orderItems;
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a new order
router.post('/', (req, res) => {
  try {
    const {
      customer_id, payment_method, payment_status, shipping_method,
      shipping_cost, tax_amount, discount_code, discount_amount,
      subtotal, total_amount, shipping_address_line1, shipping_address_line2,
      shipping_city, shipping_postal_code, shipping_country, notes,
      items
    } = req.body;
    
    // Validate required fields
    if (!customer_id || !payment_method || !payment_status || !subtotal || 
        !total_amount || !shipping_address_line1 || !shipping_city || 
        !shipping_postal_code || !items || !items.length) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Check if customer exists
    const customer = db.prepare('SELECT customer_id FROM Customers WHERE customer_id = ?').get(customer_id);
    if (!customer) {
      return res.status(400).json({
        success: false,
        error: 'Customer does not exist'
      });
    }
    
    // Begin transaction
    const transaction = db.transaction(() => {
      // Insert order
      const orderResult = db.prepare(`
        INSERT INTO Orders (
          customer_id, payment_method, payment_status, shipping_method,
          shipping_cost, tax_amount, discount_code, discount_amount,
          subtotal, total_amount, shipping_address_line1, shipping_address_line2,
          shipping_city, shipping_postal_code, shipping_country, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        customer_id, payment_method, payment_status, shipping_method,
        shipping_cost || 0, tax_amount || 0, discount_code, discount_amount || 0,
        subtotal, total_amount, shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_postal_code, shipping_country || 'United Kingdom', notes
      );
      
      const orderId = orderResult.lastInsertRowid;
      
      // Insert order items
      const insertOrderItem = db.prepare(`
        INSERT INTO OrderItems (
          order_id, product_id, quantity, unit_price, subtotal,
          tax_rate, tax_amount, discount_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const item of items) {
        // Check if product exists and has enough stock
        const product = db.prepare('SELECT product_id, stock_quantity FROM Products WHERE product_id = ?').get(item.product_id);
        
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} does not exist`);
        }
        
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Not enough stock for product with ID ${item.product_id}`);
        }
        
        // Insert order item
        insertOrderItem.run(
          orderId, item.product_id, item.quantity, item.unit_price,
          item.subtotal, item.tax_rate || 20, item.tax_amount || 0, item.discount_amount || 0
        );
      }
      
      return orderId;
    });
    
    // Execute transaction
    const orderId = transaction();
    
    // Get the new order with items
    const order = db.prepare(`
      SELECT o.*, c.first_name, c.last_name, c.email
      FROM Orders o
      JOIN Customers c ON o.customer_id = c.customer_id
      WHERE o.order_id = ?
    `).get(orderId);
    
    const orderItems = db.prepare(`
      SELECT oi.*, p.name, p.sku
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `).all(orderId);
    
    order.items = orderItems;
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    // Check if order exists
    const order = db.prepare('SELECT * FROM Orders WHERE order_id = ?').get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Update order status
    db.prepare('UPDATE Orders SET status = ? WHERE order_id = ?').run(status, orderId);
    
    // Get updated order
    const updatedOrder = db.prepare('SELECT * FROM Orders WHERE order_id = ?').get(orderId);
    
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update order tracking
router.patch('/:id/tracking', (req, res) => {
  try {
    const orderId = req.params.id;
    const { tracking_number } = req.body;
    
    // Check if order exists
    const order = db.prepare('SELECT * FROM Orders WHERE order_id = ?').get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Update tracking number
    db.prepare('UPDATE Orders SET tracking_number = ? WHERE order_id = ?').run(tracking_number, orderId);
    
    // Get updated order
    const updatedOrder = db.prepare('SELECT * FROM Orders WHERE order_id = ?').get(orderId);
    
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 