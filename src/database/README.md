# Green Dining E-commerce Database

This document outlines the database schema for the Green Dining e-commerce platform, designed to store and manage eco-friendly dining products, customer information, orders, and analytics data.

## Database Overview

The database follows a relational model with a focus on data integrity, scalability, and security. It's designed to support all e-commerce operations while enabling powerful analytics and reporting.

## Tables Structure

### 1. Customers
Stores information about registered users and customers.

| Column | Type | Description |
|--------|------|-------------|
| customer_id | INTEGER | Primary key, auto-incrementing |
| first_name | TEXT | Customer's first name |
| last_name | TEXT | Customer's last name |
| email | TEXT | Unique customer email (with format validation) |
| phone | TEXT | Contact phone number |
| address_line1 | TEXT | Primary address line |
| address_line2 | TEXT | Secondary address line (optional) |
| city | TEXT | City name |
| postal_code | TEXT | Postal/ZIP code |
| country | TEXT | Country (defaults to 'United Kingdom') |
| customer_type | TEXT | Customer classification: 'retail' or 'wholesale' |
| account_created | DATETIME | Timestamp of account creation |
| last_login | DATETIME | Timestamp of last login |
| marketing_consent | BOOLEAN | GDPR-compliant marketing permission |

#### Data Types Represented:
- **Nominal**: first_name, last_name, email, city, country
- **Ordinal**: customer_type
- **Interval**: account_created, last_login
- **Ratio**: N/A (could add purchase metrics)

### 2. Products
Contains all product information, inventory data, and categorization.

| Column | Type | Description |
|--------|------|-------------|
| product_id | INTEGER | Primary key, auto-incrementing |
| sku | TEXT | Unique Stock Keeping Unit |
| name | TEXT | Product name |
| description | TEXT | Detailed product description |
| price | DECIMAL | Retail price (with non-zero constraint) |
| cost | DECIMAL | Product cost price |
| category | TEXT | Primary product category |
| subcategory | TEXT | Secondary product category |
| tags | TEXT | Searchable tags (comma-separated) |
| material | TEXT | Primary material used |
| color | TEXT | Product color |
| weight | DECIMAL | Product weight |
| dimensions | TEXT | Product dimensions (format: LxWxH) |
| stock_quantity | INTEGER | Current inventory level |
| low_stock_threshold | INTEGER | Minimum quantity before alert |
| eco_friendly_rating | INTEGER | Sustainability rating (1-5) |
| featured | BOOLEAN | Whether product is featured |
| date_added | DATETIME | When product was added |
| last_updated | DATETIME | When product was last modified |
| image_url | TEXT | Primary product image URL |
| is_active | BOOLEAN | Whether product is currently available |

#### Data Types Represented:
- **Nominal**: name, description, category, tags, material, color
- **Ordinal**: eco_friendly_rating
- **Interval**: date_added, last_updated
- **Ratio**: price, cost, weight, stock_quantity

### 3. Orders
Tracks customer orders, payment status, and shipping information.

| Column | Type | Description |
|--------|------|-------------|
| order_id | INTEGER | Primary key, auto-incrementing |
| customer_id | INTEGER | Foreign key to Customers table |
| order_date | DATETIME | When order was placed |
| status | TEXT | Order processing status |
| payment_method | TEXT | How customer paid |
| payment_status | TEXT | Current payment state |
| shipping_method | TEXT | Delivery method used |
| shipping_cost | DECIMAL | Cost of delivery |
| tax_amount | DECIMAL | Tax applied to order |
| discount_code | TEXT | Any promo code used |
| discount_amount | DECIMAL | Discount value applied |
| subtotal | DECIMAL | Pre-tax, pre-shipping total |
| total_amount | DECIMAL | Final order amount |
| shipping_address_* | TEXT | Delivery address details |
| notes | TEXT | Order-specific notes |
| tracking_number | TEXT | Shipping tracking information |

#### Data Types Represented:
- **Nominal**: payment_method, shipping_method, discount_code
- **Ordinal**: status, payment_status
- **Interval**: order_date
- **Ratio**: shipping_cost, tax_amount, discount_amount, subtotal, total_amount

### 4. OrderItems
Junction table connecting orders to products with quantity and pricing details.

| Column | Type | Description |
|--------|------|-------------|
| order_item_id | INTEGER | Primary key, auto-incrementing |
| order_id | INTEGER | Foreign key to Orders table |
| product_id | INTEGER | Foreign key to Products table |
| quantity | INTEGER | Number of items ordered |
| unit_price | DECIMAL | Price at time of purchase |
| subtotal | DECIMAL | Line item subtotal |
| tax_rate | DECIMAL | Applied tax rate percentage |
| tax_amount | DECIMAL | Line item tax amount |
| discount_amount | DECIMAL | Line item discount |

#### Data Types Represented:
- **Nominal**: N/A
- **Ordinal**: N/A
- **Interval**: N/A
- **Ratio**: quantity, unit_price, subtotal, tax_rate, tax_amount, discount_amount

### 5. Additional Supporting Tables
- **InventoryMovements**: Tracks all stock changes with reason codes
- **CustomerReviews**: Stores customer product ratings and reviews

## Database Relationships

- A Customer can place many Orders (one-to-many)
- An Order contains many OrderItems (one-to-many)
- A Product can appear in many OrderItems (one-to-many)
- A Product can have many InventoryMovements (one-to-many)
- A Customer can submit many CustomerReviews (one-to-many)
- A Product can have many CustomerReviews (one-to-many)

## Data Integrity Features

1. **Primary Keys**: All tables have auto-incrementing integer primary keys
2. **Foreign Key Constraints**: Maintain referential integrity between tables
3. **Uniqueness Constraints**: Prevent duplicate emails, SKUs, and order items
4. **Check Constraints**: Validate data ranges (ratings, prices, quantities)
5. **Default Values**: Provide sensible defaults for common fields
6. **Triggers**: Automate inventory updates and timestamp maintenance

## Indexing Strategy

Indexes have been created on frequently queried columns to optimize search performance:
- Customer emails (for login lookups)
- Product names, categories, and tags (for product searches)
- Order customer IDs and dates (for order history)
- OrderItem relationships (for order details)

## Analytics Support

The database includes a view (ProductSalesAnalytics) to facilitate common reporting needs. Additional views can be created as reporting requirements evolve.

## Data Privacy Considerations

- Personal customer data is segregated in the Customers table
- The schema supports GDPR-compliant marketing opt-in/out
- Sensitive payment information is not stored directly in the database

## Implementation Notes

- The schema is implemented using SQLite for development
- Could be migrated to PostgreSQL, MySQL, or SQL Server for production
- Additional optimization may be required for high-volume scenarios
- Consider data partitioning strategies for very large datasets 