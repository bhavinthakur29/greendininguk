import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get all customers
router.get('/', (req, res) => {
  try {
    const query = req.query;
    let sql = 'SELECT * FROM Customers';
    const params = [];

    // Apply filters if they exist
    if (query.type) {
      sql += ' WHERE customer_type = ?';
      params.push(query.type);
    }

    if (query.search) {
      sql += query.type ? ' AND' : ' WHERE';
      sql += ' (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${query.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Add sorting
    sql += ' ORDER BY ' + (query.sort || 'last_name');

    // Execute query
    const customers = db.prepare(sql).all(...params);
    
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get a single customer
router.get('/:id', (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM Customers WHERE customer_id = ?').get(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    // Get customer orders
    const orders = db.prepare('SELECT * FROM Orders WHERE customer_id = ? ORDER BY order_date DESC').all(req.params.id);
    
    // Include orders with the customer data
    customer.orders = orders;
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a new customer
router.post('/', (req, res) => {
  try {
    const {
      first_name, last_name, email, phone, address_line1,
      address_line2, city, postal_code, country, customer_type,
      marketing_consent
    } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name || !email || !address_line1 || !city || !postal_code) {
      return res.status(400).json({
        success: false,
        error: 'Please provide required fields: first_name, last_name, email, address_line1, city, postal_code'
      });
    }
    
    // Check if email already exists
    const existingEmail = db.prepare('SELECT email FROM Customers WHERE email = ?').get(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: 'Customer with this email already exists'
      });
    }
    
    // Insert new customer
    const result = db.prepare(`
      INSERT INTO Customers (
        first_name, last_name, email, phone, address_line1,
        address_line2, city, postal_code, country, customer_type,
        marketing_consent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      first_name, last_name, email, phone, address_line1,
      address_line2, city, postal_code, country || 'United Kingdom', 
      customer_type || 'retail', marketing_consent ? 1 : 0
    );
    
    // Get the inserted customer
    const customer = db.prepare('SELECT * FROM Customers WHERE customer_id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update a customer
router.put('/:id', (req, res) => {
  try {
    const customerId = req.params.id;
    const {
      first_name, last_name, email, phone, address_line1,
      address_line2, city, postal_code, country, customer_type,
      marketing_consent
    } = req.body;
    
    // Check if customer exists
    const customer = db.prepare('SELECT * FROM Customers WHERE customer_id = ?').get(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    // If email is being changed, check it doesn't conflict
    if (email && email !== customer.email) {
      const existingEmail = db.prepare('SELECT email FROM Customers WHERE email = ? AND customer_id != ?').get(email, customerId);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: 'Another customer with this email already exists'
        });
      }
    }
    
    // Update customer
    db.prepare(`
      UPDATE Customers SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        address_line1 = COALESCE(?, address_line1),
        address_line2 = COALESCE(?, address_line2),
        city = COALESCE(?, city),
        postal_code = COALESCE(?, postal_code),
        country = COALESCE(?, country),
        customer_type = COALESCE(?, customer_type),
        marketing_consent = COALESCE(?, marketing_consent),
        last_login = CURRENT_TIMESTAMP
      WHERE customer_id = ?
    `).run(
      first_name, last_name, email, phone, address_line1,
      address_line2, city, postal_code, country, customer_type,
      marketing_consent, customerId
    );
    
    // Get the updated customer
    const updatedCustomer = db.prepare('SELECT * FROM Customers WHERE customer_id = ?').get(customerId);
    
    res.json({
      success: true,
      data: updatedCustomer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a customer
router.delete('/:id', (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Check if customer exists
    const customer = db.prepare('SELECT * FROM Customers WHERE customer_id = ?').get(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    // Check if customer has orders
    const orders = db.prepare('SELECT COUNT(*) as count FROM Orders WHERE customer_id = ?').get(customerId);
    if (orders.count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete customer with existing orders. Consider anonymizing instead.'
      });
    }
    
    // Delete customer
    db.prepare('DELETE FROM Customers WHERE customer_id = ?').run(customerId);
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 