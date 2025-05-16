+----------------+       +-------------------+       +----------------+
|   Customers    |       |      Orders       |       |    Products    |
+----------------+       +-------------------+       +----------------+
| customer_id PK |<----->| customer_id FK    |       | product_id PK  |
| first_name     |       | order_id PK       |       | sku            |
| last_name      |       | order_date        |       | name           |
| email          |       | status            |       | description    |
| phone          |       | payment_method    |       | price          |
| address_line1  |       | payment_status    |       | cost           |
| address_line2  |       | shipping_method   |       | category       |
| city           |       | shipping_cost     |       | subcategory    |
| postal_code    |       | tax_amount        |       | tags           |
| country        |       | discount_code     |       | material       |
| customer_type  |       | discount_amount   |       | color          |
| account_created|       | subtotal          |       | weight         |
| last_login     |       | total_amount      |       | dimensions     |
| marketing_cons |       | shipping_address  |       | stock_quantity |
+----------------+       | notes             |       | low_stock_thres|
        ^                | tracking_number   |       | eco_rating     |
        |                +-------------------+       | featured       |
        |                        ^                   | date_added     |
        |                        |                   | last_updated   |
        |                        |                   | image_url      |
        |                        |                   | is_active      |
        |                        |                   +----------------+
        |                        |                          ^
        |                        |                          |
        |                +----------------+                 |
        |                |   OrderItems   |                 |
        |                +----------------+                 |
        |                | order_item_id PK                 |
        |                | order_id FK    |---------------->|
        |                | product_id FK  |---------------->|
        |                | quantity       |                 |
        |                | unit_price     |                 |
        |                | subtotal       |                 |
        |                | tax_rate       |                 |
        |                | tax_amount     |                 |
        |                | discount_amount|                 |
        |                +----------------+                 |
        |                                                   |
+-------------------+                            +-------------------+
| CustomerReviews   |                            | InventoryMovements|
+-------------------+                            +-------------------+
| review_id PK      |                            | movement_id PK    |
| product_id FK     |---------------------------->| product_id FK     |
| customer_id FK    |---------------------------->| quantity_change   |
| rating            |                            | reason            |
| review_text       |                            | reference_id      |
| review_date       |                            | movement_date     |
| is_verified       |                            | notes             |
| is_approved       |                            | created_by        |
+-------------------+                            +-------------------+

## Database Relationship Explanation

1. **Customers to Orders (1:N)**
   - One customer can place multiple orders
   - Each order belongs to exactly one customer

2. **Orders to OrderItems (1:N)**
   - One order can contain multiple order items
   - Each order item belongs to exactly one order

3. **Products to OrderItems (1:N)**
   - One product can appear in multiple order items
   - Each order item refers to exactly one product

4. **Products to InventoryMovements (1:N)**
   - One product can have multiple inventory movements
   - Each inventory movement affects exactly one product

5. **Customers to CustomerReviews (1:N)**
   - One customer can write multiple reviews
   - Each review is written by exactly one customer

6. **Products to CustomerReviews (1:N)**
   - One product can receive multiple reviews
   - Each review is about exactly one product

## Key Constraints

- **Primary Keys (PK)**: Uniquely identify each record in a table
- **Foreign Keys (FK)**: Maintain referential integrity between tables
- **Unique Constraints**: Prevent duplicate entries (email, sku)
- **Check Constraints**: Validate data values (ratings 1-5, positive prices)

## Primary Business Processes

1. **Order Processing Workflow**:
   - Customer record → Order creation → OrderItems population → Inventory update
   - Status changes as order progresses through fulfillment stages

2. **Inventory Management**:
   - Product stock updates via InventoryMovements
   - Automated triggers maintain accurate stock levels

3. **Customer Engagement**:
   - Order history tracking
   - Product reviews and ratings system
   - Marketing preferences management 