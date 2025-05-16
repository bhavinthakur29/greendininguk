import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import {
    FaBox,
    FaShoppingCart,
    FaMoneyBillWave,
    FaUsers,
    FaChartLine,
    FaExclamationTriangle,
    FaBell,
    FaSync,
    FaWarehouse,
    FaChartBar,
    FaBoxOpen,
    FaTimes,
    FaEye,
    FaFileInvoice
} from 'react-icons/fa';
import './Dashboard.css';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
        ordersByStatus: {},
        orders: [],
        topProducts: [],
        recentCustomers: [],
        lowStockProducts: []
    });
    const [refreshing, setRefreshing] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    // Format currency in GBP
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);

            // Fetch orders
            const ordersResponse = await fetch('http://localhost:3001/api/orders');
            if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
            const ordersData = await ordersResponse.json();

            // Fetch products
            const productsResponse = await fetch('http://localhost:3001/api/products');
            if (!productsResponse.ok) throw new Error('Failed to fetch products');
            const productsData = await productsResponse.json();

            // Fetch customers
            const customersResponse = await fetch('http://localhost:3001/api/customers');
            if (!customersResponse.ok) throw new Error('Failed to fetch customers');
            const customersData = await customersResponse.json();

            // Fetch analytics data
            const analyticsResponse = await fetch('http://localhost:3001/api/analytics/dashboard');
            let analyticsData = { success: false, data: {} };

            if (analyticsResponse.ok) {
                analyticsData = await analyticsResponse.json();
            }

            // Calculate order statistics
            const orders = ordersData.success ? ordersData.data : [];
            const products = productsData.success ? productsData.data : [];
            const customers = customersData.success ? customersData.data : [];

            // Calculate order status counts
            const ordersByStatus = orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {});

            // Calculate revenue
            const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

            // Find low stock products
            const lowStockProducts = products.filter(p =>
                p.stock_quantity <= (p.low_stock_threshold || 10)
            ).sort((a, b) => a.stock_quantity - b.stock_quantity).slice(0, 5);

            // Prepare top products (this would normally come from analytics)
            // For now, we'll fake it based on what we have
            const topProducts = products
                .slice(0, 3)
                .map(p => ({
                    ...p,
                    units_sold: Math.floor(Math.random() * 50) + 10,
                    revenue: p.price * (Math.floor(Math.random() * 50) + 10)
                }));

            // Prepare recent customers with order count
            const recentCustomers = customers.slice(0, 3).map(customer => {
                const customerOrders = orders.filter(order => order.customer_id === customer.customer_id);
                const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

                return {
                    ...customer,
                    order_count: customerOrders.length,
                    total_spent: totalSpent
                };
            });

            setStats({
                totalOrders: orders.length,
                totalRevenue,
                totalCustomers: customers.length,
                totalProducts: products.length,
                ordersByStatus,
                orders: orders.slice(0, 5), // Get most recent 5 orders
                topProducts,
                recentCustomers,
                lowStockProducts
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();

        // Set up a refresh interval (every 5 minutes)
        const intervalId = setInterval(() => {
            fetchDashboardData();
        }, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = () => {
        fetchDashboardData();
    };

    // Fetch order details including items
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();

            if (data.success) {
                setCurrentOrder(data.data);
                if (data.data.items) {
                    setOrderItems(data.data.items);
                } else {
                    setOrderItems([]);
                }
            } else {
                throw new Error(data.error || 'Failed to fetch order details');
            }
        } catch (err) {
            toast.error(`Error loading order details: ${err.message}`);
            console.error('Error fetching order details:', err);
        }
    };

    // Open order details modal
    const handleViewOrder = async (order) => {
        await fetchOrderDetails(order.order_id);
        setShowOrderModal(true);
    };

    // Close order details modal
    const handleCloseModal = () => {
        setShowOrderModal(false);
        setCurrentOrder(null);
        setOrderItems([]);
    };

    return (
        <AdminLayout>
            <div className="admin-dashboard">
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back! Here's what's happening with your store today.</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="refresh-btn"
                            onClick={handleRefresh}
                            disabled={refreshing || loading}
                        >
                            <FaSync className={refreshing ? 'spin' : ''} />
                            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>

                    </div>
                </header>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading dashboard data...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                        <button onClick={handleRefresh}>Try Again</button>
                    </div>
                ) : (
                    <>
                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaShoppingCart />
                                </div>
                                <div className="stat-details">
                                    <h3>Total Orders</h3>
                                    <p>{stats.totalOrders}</p>
                                    <div className="stat-footer">
                                        <div className="stat-breakdown">
                                            <span className="stat-item">
                                                <span className="dot pending"></span>
                                                Pending: {stats.ordersByStatus.pending || 0}
                                            </span>
                                            <span className="stat-item">
                                                <span className="dot processing"></span>
                                                Processing: {stats.ordersByStatus.processing || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaMoneyBillWave />
                                </div>
                                <div className="stat-details">
                                    <h3>Total Revenue</h3>
                                    <p>{formatCurrency(stats.totalRevenue)}</p>
                                    <div className="stat-footer">
                                        <span className="stat-trend">
                                            <FaChartLine />
                                            View sales report
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaUsers />
                                </div>
                                <div className="stat-details">
                                    <h3>Customers</h3>
                                    <p>{stats.totalCustomers}</p>
                                    <div className="stat-footer">
                                        <Link to="/admin/customers" className="stat-link">
                                            Manage customers
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaBox />
                                </div>
                                <div className="stat-details">
                                    <h3>Total Products</h3>
                                    <p>{stats.totalProducts}</p>
                                    <div className="stat-footer">
                                        {stats.lowStockProducts.length > 0 ? (
                                            <span className="stat-alert">
                                                <FaExclamationTriangle />
                                                {stats.lowStockProducts.length} low stock items
                                            </span>
                                        ) : (
                                            <span className="stat-neutral">
                                                <FaWarehouse />
                                                Inventory healthy
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <main className="dashboard-content">
                            <section className="dashboard-section">
                                <div className="section-header">
                                    <h2>Recent Orders</h2>
                                    <Link to="/admin/orders" className="view-all-btn">View All</Link>
                                </div>
                                <div className="table-container">
                                    {stats.orders.length === 0 ? (
                                        <div className="empty-state">
                                            <p>No orders found</p>
                                        </div>
                                    ) : (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.orders.map(order => (
                                                    <tr key={order.order_id}>
                                                        <td>#{order.order_id}</td>
                                                        <td>{order.customer_name || `Customer ${order.customer_id}`}</td>
                                                        <td>{formatDate(order.order_date)}</td>
                                                        <td>{formatCurrency(order.total_amount)}</td>
                                                        <td>
                                                            <span className={`status ${order.status}`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="view-btn"
                                                                onClick={() => handleViewOrder(order)}
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </section>

                            <div className="dashboard-row">
                                <section className="dashboard-section half-width">
                                    <div className="section-header">
                                        <h2>Top Selling Products</h2>
                                        <Link to="/admin/analytics" className="view-all-btn">View All</Link>
                                    </div>
                                    <div className="table-container">
                                        {stats.topProducts.length === 0 ? (
                                            <div className="empty-state">
                                                <p>No product sales data available</p>
                                            </div>
                                        ) : (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Sold</th>
                                                        <th>Revenue</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stats.topProducts.map(product => (
                                                        <tr key={product.product_id}>
                                                            <td>{product.name}</td>
                                                            <td>{product.units_sold}</td>
                                                            <td>{formatCurrency(product.revenue)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </section>

                                <section className="dashboard-section half-width">
                                    <div className="section-header">
                                        <h2>Recent Customers</h2>
                                        <Link to="/admin/customers" className="view-all-btn">View All</Link>
                                    </div>
                                    <div className="table-container">
                                        {stats.recentCustomers.length === 0 ? (
                                            <div className="empty-state">
                                                <p>No customer data available</p>
                                            </div>
                                        ) : (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Customer</th>
                                                        <th>Orders</th>
                                                        <th>Total Spent</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stats.recentCustomers.map(customer => (
                                                        <tr key={customer.customer_id}>
                                                            <td>{`${customer.first_name} ${customer.last_name}`}</td>
                                                            <td>{customer.order_count}</td>
                                                            <td>{formatCurrency(customer.total_spent)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </section>
                            </div>

                            <section className="dashboard-section">
                                <div className="section-header">
                                    <h2>Low Stock Alert</h2>
                                    <Link to="/admin/products" className="view-all-btn">View All Products</Link>
                                </div>
                                <div className="table-container">
                                    {stats.lowStockProducts.length === 0 ? (
                                        <div className="empty-state positive">
                                            <p>No low stock products! Inventory levels are healthy.</p>
                                        </div>
                                    ) : (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Current Stock</th>
                                                    <th>Reorder Level</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.lowStockProducts.map(product => {
                                                    const threshold = product.low_stock_threshold || 10;
                                                    const isCritical = product.stock_quantity <= Math.floor(threshold / 2);

                                                    return (
                                                        <tr key={product.product_id}>
                                                            <td>{product.name}</td>
                                                            <td>{product.stock_quantity}</td>
                                                            <td>{threshold}</td>
                                                            <td>
                                                                <span className={`status ${isCritical ? 'critical' : 'warning'}`}>
                                                                    {isCritical ? 'Critical' : 'Low Stock'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Link
                                                                    to={`/admin/products/edit/${product.product_id}`}
                                                                    className="action-btn"
                                                                >
                                                                    Update Stock
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </section>
                        </main>
                    </>
                )}
            </div>

            {showOrderModal && currentOrder && (
                <div className="modal-overlay">
                    <div className="modal order-modal">
                        <div className="modal-header">
                            <h2>Order #{currentOrder.order_id} Details</h2>
                            <button className="close-modal-btn" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="order-details">
                            <div className="order-header">
                                <div className="order-info">
                                    <div className="info-group">
                                        <span className="label">Date:</span>
                                        <span className="value">{formatDate(currentOrder.order_date)}</span>
                                    </div>
                                    <div className="info-group">
                                        <span className="label">Customer:</span>
                                        <span className="value">
                                            {currentOrder.first_name} {currentOrder.last_name}
                                        </span>
                                    </div>
                                    <div className="info-group">
                                        <span className="label">Email:</span>
                                        <span className="value">{currentOrder.email}</span>
                                    </div>
                                </div>
                                <div className="status-management">
                                    <label htmlFor="orderStatus">Order Status:</label>
                                    <select
                                        id="orderStatus"
                                        value={currentOrder.status}
                                        disabled={true}
                                        className={`status-select ${currentOrder.status}`}
                                    >
                                        <option value={currentOrder.status}>
                                            {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="order-shipping">
                                <h3>Shipping Information</h3>
                                <div className="shipping-details">
                                    <p>
                                        <strong>Address:</strong> {currentOrder.shipping_address_line1}
                                        {currentOrder.shipping_address_line2 && `, ${currentOrder.shipping_address_line2}`}
                                    </p>
                                    <p>
                                        <strong>City:</strong> {currentOrder.shipping_city},
                                        <strong> Postal Code:</strong> {currentOrder.shipping_postal_code}
                                    </p>
                                    <p>
                                        <strong>Country:</strong> {currentOrder.shipping_country || 'United Kingdom'}
                                    </p>
                                </div>
                            </div>

                            <div className="order-items">
                                <h3>Order Items</h3>
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>SKU</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="no-items">
                                                    No items found for this order.
                                                </td>
                                            </tr>
                                        ) : (
                                            orderItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.sku || '-'}</td>
                                                    <td>{formatCurrency(item.unit_price)}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatCurrency(item.subtotal)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="order-summary">
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(currentOrder.subtotal)}</span>
                                </div>
                                {currentOrder.tax_amount > 0 && (
                                    <div className="summary-row">
                                        <span>Tax:</span>
                                        <span>{formatCurrency(currentOrder.tax_amount)}</span>
                                    </div>
                                )}
                                {currentOrder.shipping_cost > 0 && (
                                    <div className="summary-row">
                                        <span>Shipping:</span>
                                        <span>{formatCurrency(currentOrder.shipping_cost)}</span>
                                    </div>
                                )}
                                {currentOrder.discount_amount > 0 && (
                                    <div className="summary-row">
                                        <span>Discount ({currentOrder.discount_code}):</span>
                                        <span>-{formatCurrency(currentOrder.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="summary-row total">
                                    <span>Total:</span>
                                    <span>{formatCurrency(currentOrder.total_amount)}</span>
                                </div>
                            </div>

                            <div className="order-actions">
                                <button className="invoice-btn">
                                    <FaFileInvoice />
                                    Generate Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Dashboard; 