-- Green Dining E-commerce Database Schema

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Customers table
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'United Kingdom',
    customer_type TEXT CHECK(customer_type IN ('retail', 'wholesale')) DEFAULT 'retail',
    account_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    marketing_consent BOOLEAN DEFAULT 0,
    CONSTRAINT email_format CHECK (email LIKE '%_@_%._%')
);

-- Create an index on customer email for faster lookups
CREATE INDEX idx_customer_email ON Customers(email);

-- Products table
CREATE TABLE Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    cost DECIMAL(10,2) CHECK (cost > 0),
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT,
    material TEXT,
    color TEXT,
    weight DECIMAL(8,2),
    dimensions TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    eco_friendly_rating INTEGER CHECK (eco_friendly_rating BETWEEN 1 AND 5),
    featured BOOLEAN DEFAULT 0,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME,
    image_url TEXT,
    is_active BOOLEAN DEFAULT 1
);

-- Create indexes for product searches
CREATE INDEX idx_product_name ON Products(name);
CREATE INDEX idx_product_category ON Products(category);
CREATE INDEX idx_product_tags ON Products(tags);

-- Orders table
CREATE TABLE Orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'completed')) DEFAULT 'pending',
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    shipping_method TEXT,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_code TEXT,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_postal_code TEXT NOT NULL,
    shipping_country TEXT NOT NULL DEFAULT 'United Kingdom',
    notes TEXT,
    tracking_number TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Create index for order lookups
CREATE INDEX idx_order_customer ON Orders(customer_id);
CREATE INDEX idx_order_date ON Orders(order_date);
CREATE INDEX idx_order_status ON Orders(status);

-- Order Items table (junction table for Orders and Products)
CREATE TABLE OrderItems (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 20.00,
    tax_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    UNIQUE (order_id, product_id)
);

-- Create index for order item lookups
CREATE INDEX idx_orderitem_order ON OrderItems(order_id);
CREATE INDEX idx_orderitem_product ON OrderItems(product_id);

-- Inventory Movement table (for tracking stock changes)
CREATE TABLE InventoryMovements (
    movement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('purchase', 'sale', 'adjustment', 'return', 'damage')),
    reference_id INTEGER, -- Could be order_id for sales or purchase_id for restocking
    movement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_by TEXT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Customer Reviews table
CREATE TABLE CustomerReviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified_purchase BOOLEAN DEFAULT 0,
    is_approved BOOLEAN DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    UNIQUE (product_id, customer_id)
);

-- Create trigger to update product stock when order items are added
CREATE TRIGGER update_stock_after_order
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
    
    -- Add inventory movement record
    INSERT INTO InventoryMovements (product_id, quantity_change, reason, reference_id)
    VALUES (NEW.product_id, -NEW.quantity, 'sale', NEW.order_id);
END;

-- Create trigger to update last_updated timestamp when product is modified
CREATE TRIGGER update_product_timestamp
AFTER UPDATE ON Products
FOR EACH ROW
BEGIN
    UPDATE Products
    SET last_updated = CURRENT_TIMESTAMP
    WHERE product_id = NEW.product_id;
END;

-- Create view for product sales analytics
CREATE VIEW ProductSalesAnalytics AS
SELECT 
    p.product_id,
    p.name,
    p.category,
    SUM(oi.quantity) as total_units_sold,
    SUM(oi.subtotal) as total_revenue,
    COUNT(DISTINCT o.order_id) as order_count,
    AVG(oi.unit_price) as average_price
FROM Products p
JOIN OrderItems oi ON p.product_id = oi.product_id
JOIN Orders o ON oi.order_id = o.order_id
WHERE o.status != 'cancelled' AND o.status != 'refunded'
GROUP BY p.product_id
ORDER BY total_revenue DESC; 