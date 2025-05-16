import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get dashboard summary data
router.get('/dashboard', (req, res) => {
  try {
    // Get total sales
    const totalSales = db.prepare(`
      SELECT COUNT(*) as count, SUM(total_amount) as revenue
      FROM Orders
      WHERE status != 'cancelled' AND status != 'refunded'
    `).get();

    // Get total customers
    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM Customers').get();

    // Get total products
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM Products WHERE is_active = 1').get();

    // Get sales by status
    const salesByStatus = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM Orders
      GROUP BY status
    `).all();

    // Get recent orders
    const recentOrders = db.prepare(`
      SELECT o.order_id, o.order_date, o.status, o.total_amount,
             c.first_name, c.last_name, c.email
      FROM Orders o
      JOIN Customers c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC
      LIMIT 5
    `).all();

    // Get top selling products
    const topProducts = db.prepare(`
      SELECT p.product_id, p.name, p.sku, p.image_url, p.price,
             SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as total_revenue
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      JOIN Orders o ON oi.order_id = o.order_id
      WHERE o.status != 'cancelled' AND o.status != 'refunded'
      GROUP BY p.product_id
      ORDER BY total_sold DESC
      LIMIT 5
    `).all();

    // Get low stock products
    const lowStockProducts = db.prepare(`
      SELECT product_id, name, sku, stock_quantity, low_stock_threshold
      FROM Products
      WHERE stock_quantity <= low_stock_threshold AND is_active = 1
      ORDER BY stock_quantity ASC
    `).all();

    res.json({
      success: true,
      data: {
        totalSales: totalSales.count,
        totalRevenue: totalSales.revenue,
        totalCustomers: totalCustomers.count,
        totalProducts: totalProducts.count,
        salesByStatus,
        recentOrders,
        topProducts,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get sales data for charts
router.get('/sales', (req, res) => {
  try {
    const { period = 'monthly', year = new Date().getFullYear() } = req.query;
    
    let sql;
    let groupBy;
    
    switch (period) {
      case 'daily':
        groupBy = "strftime('%Y-%m-%d', order_date)";
        break;
      case 'weekly':
        groupBy = "strftime('%Y-%W', order_date)";
        break;
      case 'monthly':
      default:
        groupBy = "strftime('%Y-%m', order_date)";
        break;
    }
    
    sql = `
      SELECT ${groupBy} as period,
             COUNT(*) as order_count,
             SUM(total_amount) as revenue
      FROM Orders
      WHERE strftime('%Y', order_date) = ?
        AND status != 'cancelled' AND status != 'refunded'
      GROUP BY ${groupBy}
      ORDER BY period
    `;
    
    const salesData = db.prepare(sql).all(year.toString());
    
    res.json({
      success: true,
      data: salesData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get product category distribution
router.get('/products/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT category, COUNT(*) as product_count,
             SUM(stock_quantity) as total_stock,
             AVG(price) as average_price
      FROM Products
      WHERE is_active = 1
      GROUP BY category
      ORDER BY product_count DESC
    `).all();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get customer analytics
router.get('/customers', (req, res) => {
  try {
    // Customer types breakdown
    const customerTypes = db.prepare(`
      SELECT customer_type, COUNT(*) as count
      FROM Customers
      GROUP BY customer_type
    `).all();
    
    // Top customers by order value
    const topCustomers = db.prepare(`
      SELECT c.customer_id, c.first_name, c.last_name, c.email,
             COUNT(o.order_id) as order_count,
             SUM(o.total_amount) as total_spent
      FROM Customers c
      JOIN Orders o ON c.customer_id = o.customer_id
      WHERE o.status != 'cancelled' AND o.status != 'refunded'
      GROUP BY c.customer_id
      ORDER BY total_spent DESC
      LIMIT 10
    `).all();
    
    res.json({
      success: true,
      data: {
        customerTypes,
        topCustomers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get inventory status
router.get('/inventory', (req, res) => {
  try {
    // Inventory summary
    const inventorySummary = db.prepare(`
      SELECT 
        COUNT(*) as total_products,
        SUM(stock_quantity) as total_stock,
        SUM(stock_quantity * price) as inventory_value,
        AVG(stock_quantity) as average_stock,
        COUNT(CASE WHEN stock_quantity <= low_stock_threshold THEN 1 END) as low_stock_count,
        COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock_count
      FROM Products
      WHERE is_active = 1
    `).get();
    
    // Category stock levels
    const categoryStock = db.prepare(`
      SELECT category, SUM(stock_quantity) as total_stock
      FROM Products
      WHERE is_active = 1
      GROUP BY category
      ORDER BY total_stock DESC
    `).all();
    
    res.json({
      success: true,
      data: {
        summary: inventorySummary,
        categoryStock
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/analytics - Get analytics data
router.get('/', async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        // Sample data for different periods
        let revenueByPeriod = {};
        let topProducts = [];
        let totalRevenue = 0;
        
        if (period === 'week') {
            // Weekly data (last 7 days)
            revenueByPeriod = {
                'Mon': 520,
                'Tue': 610,
                'Wed': 580,
                'Thu': 690,
                'Fri': 820,
                'Sat': 950,
                'Sun': 780
            };
            
            topProducts = [
                { name: 'Bamboo Plates', revenue: 500, quantity_sold: 125, category: 'Plates' },
                { name: 'Eco Cups', revenue: 420, quantity_sold: 105, category: 'Cups' },
                { name: 'Wooden Cutlery', revenue: 380, quantity_sold: 190, category: 'Cutlery' },
                { name: 'Leaf Bowls', revenue: 320, quantity_sold: 80, category: 'Bowls' },
                { name: 'Straw Sets', revenue: 280, quantity_sold: 70, category: 'Accessories' }
            ];
            totalRevenue = 4950;
        } else if (period === 'month') {
            // Monthly data (last 30 days)
            revenueByPeriod = {
                'Week 1': 3200,
                'Week 2': 3800,
                'Week 3': 4100,
                'Week 4': 3900
            };
            
            topProducts = [
                { name: 'Bamboo Dinner Set', revenue: 1800, quantity_sold: 360, category: 'Sets' },
                { name: 'Bamboo Plates (8")', revenue: 1500, quantity_sold: 375, category: 'Plates' },
                { name: 'Eco-Friendly Cups', revenue: 1350, quantity_sold: 450, category: 'Cups' },
                { name: 'Wooden Cutlery Set', revenue: 1200, quantity_sold: 400, category: 'Cutlery' },
                { name: 'Bamboo Bowls', revenue: 1050, quantity_sold: 350, category: 'Bowls' },
                { name: 'Wheat Straw Plates', revenue: 950, quantity_sold: 300, category: 'Plates' },
                { name: 'Biodegradable Napkins', revenue: 850, quantity_sold: 425, category: 'Accessories' }
            ];
            totalRevenue = 15000;
        } else if (period === 'year') {
            // Yearly data (last 12 months)
            revenueByPeriod = {
                'Jan': 12500,
                'Feb': 14200,
                'Mar': 16800,
                'Apr': 15900,
                'May': 17300,
                'Jun': 18500,
                'Jul': 19200,
                'Aug': 18800,
                'Sep': 17500,
                'Oct': 16900,
                'Nov': 19800,
                'Dec': 22500
            };
            
            topProducts = [
                { name: 'Bamboo Dining Collection', revenue: 28500, quantity_sold: 950, category: 'Sets' },
                { name: 'Eco-Friendly Party Set', revenue: 24800, quantity_sold: 1240, category: 'Sets' },
                { name: 'Premium Bamboo Plates', revenue: 22400, quantity_sold: 5600, category: 'Plates' },
                { name: 'Wooden Cutlery Bundle', revenue: 19600, quantity_sold: 4900, category: 'Cutlery' },
                { name: 'Biodegradable Cups (100pc)', revenue: 18200, quantity_sold: 3900, category: 'Cups' },
                { name: 'Plant-based Straws', revenue: 15800, quantity_sold: 7900, category: 'Accessories' },
                { name: 'Leaf Bowls (Large)', revenue: 14900, quantity_sold: 3700, category: 'Bowls' },
                { name: 'Eco Gift Packaging', revenue: 13800, quantity_sold: 2300, category: 'Accessories' }
            ];
            totalRevenue = 210000;
        }
        
        // Return success response with data
        return res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                revenueByPeriod,
                topProducts
            }
        });
    } catch (error) {
        console.error(`Error in analytics endpoint: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

export default router; 