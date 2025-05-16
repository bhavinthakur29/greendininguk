import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up database path
const dbPath = path.join(__dirname, 'greendining.db');
const schemaPath = path.join(__dirname, '..', '..', 'src', 'database', 'schema.sql');

// Create database connection
const db = new Database(dbPath, { 
  verbose: console.log 
});

// Initialize database if it doesn't exist
const initializeDatabase = () => {
  try {
    // Read the schema SQL script
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Check if tables already exist
    const tablesExist = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Customers'").get();
    
    if (!tablesExist) {
      console.log('Initializing database with schema...');
      
      // Execute schema as a transaction
      db.exec(schema);
      
      // Insert sample data if needed
      insertSampleData();
      
      console.log('Database initialized successfully');
    } else {
      console.log('Database already initialized');
    }
    
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

// Insert sample data for testing
const insertSampleData = () => {
  try {
    // Sample customers
    const customers = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+44 7123 456789',
        address_line1: '123 Main St',
        city: 'London',
        postal_code: 'SW1A 1AA',
        country: 'United Kingdom',
        customer_type: 'retail'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '+44 7234 567890',
        address_line1: '456 Oak Ave',
        city: 'Manchester',
        postal_code: 'M1 1AE',
        country: 'United Kingdom',
        customer_type: 'wholesale'
      }
    ];
    
    // Sample products
    const products = [
      {
        sku: 'ECO-PLATE-01',
        name: 'Bamboo Dinner Plate',
        description: 'Eco-friendly dinner plate made from sustainable bamboo',
        price: 12.99,
        cost: 5.50,
        category: 'Tableware',
        subcategory: 'Plates',
        tags: 'bamboo,eco-friendly,sustainable',
        material: 'Bamboo',
        color: 'Natural',
        weight: 0.3,
        dimensions: '25x25x2',
        stock_quantity: 100,
        eco_friendly_rating: 5,
        featured: 1
      },
      {
        sku: 'ECO-CUTLERY-01',
        name: 'Wooden Cutlery Set',
        description: 'Set of 4 wooden utensils - fork, knife, spoon, and napkin',
        price: 8.99,
        cost: 3.20,
        category: 'Cutlery',
        subcategory: 'Sets',
        tags: 'wooden,disposable,biodegradable',
        material: 'Birch Wood',
        color: 'Light Brown',
        weight: 0.1,
        dimensions: '16x3x2',
        stock_quantity: 200,
        eco_friendly_rating: 4,
        featured: 0
      }
    ];
    
    // Insert customers
    const insertCustomer = db.prepare(`
      INSERT INTO Customers (
        first_name, last_name, email, phone, address_line1, 
        city, postal_code, country, customer_type
      ) VALUES (
        @first_name, @last_name, @email, @phone, @address_line1, 
        @city, @postal_code, @country, @customer_type
      )
    `);
    
    // Insert products
    const insertProduct = db.prepare(`
      INSERT INTO Products (
        sku, name, description, price, cost, category, subcategory, 
        tags, material, color, weight, dimensions, stock_quantity, 
        eco_friendly_rating, featured
      ) VALUES (
        @sku, @name, @description, @price, @cost, @category, @subcategory, 
        @tags, @material, @color, @weight, @dimensions, @stock_quantity, 
        @eco_friendly_rating, @featured
      )
    `);
    
    // Execute inserts
    for (const customer of customers) {
      insertCustomer.run(customer);
    }
    
    for (const product of products) {
      insertProduct.run(product);
    }
    
    console.log('Sample data inserted successfully');
    
  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
};

// Initialize the database
initializeDatabase();

export default db; 