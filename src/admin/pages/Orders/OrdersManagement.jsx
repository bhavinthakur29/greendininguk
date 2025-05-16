import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaFileInvoice, FaSync, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import './OrdersManagement.css';
import { toast } from 'react-toastify';

const OrdersManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [statusUpdating, setStatusUpdating] = useState(false);

    // Order status options
    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setRefreshing(true);
            const response = await fetch('http://localhost:3001/api/orders');

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch orders');
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error(`Error loading orders: ${err.message}`);
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setStatusUpdating(true);
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            const data = await response.json();

            if (data.success) {
                // Update the current order
                setCurrentOrder({
                    ...currentOrder,
                    status: newStatus
                });

                // Update the order in the orders list
                setOrders(orders.map(order =>
                    order.order_id === orderId
                        ? { ...order, status: newStatus }
                        : order
                ));

                toast.success(`Order status updated to ${newStatus}`);
            } else {
                throw new Error(data.error || 'Failed to update order status');
            }
        } catch (err) {
            toast.error(`Error updating order status: ${err.message}`);
            console.error('Error updating order status:', err);
        } finally {
            setStatusUpdating(false);
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

    // Handle status change in the modal
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (currentOrder && newStatus !== currentOrder.status) {
            updateOrderStatus(currentOrder.order_id, newStatus);
        }
    };

    // Filter orders based on search term and status filter
    const filteredOrders = orders.filter(order => {
        const orderId = order.order_id ? `#${order.order_id}` : '';
        const customerName = order.customer_name || '';
        const customerEmail = order.customer_email || '';

        const matchesSearch =
            orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || order.status === filter;

        return matchesSearch && matchesFilter;
    });

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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const countOrdersByStatus = (status) => {
        if (status === 'all') return orders.length;
        return orders.filter(order => order.status === status).length;
    };

    const handleRefresh = () => {
        fetchOrders();
    };

    return (
        <AdminLayout>
            <div className="orders-management">
                <header className="orders-header">
                    <div>
                        <h1>Orders Management</h1>
                        <p>{orders.length} orders in database</p>
                    </div>
                    <button
                        className="refresh-btn"
                        onClick={handleRefresh}
                        disabled={refreshing || loading}
                    >
                        <FaSync className={refreshing ? 'spin' : ''} />
                        <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </header>

                <div className="order-stats">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{countOrdersByStatus('all')}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending</h3>
                        <p>{countOrdersByStatus('pending')}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Processing</h3>
                        <p>{countOrdersByStatus('processing')}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed</h3>
                        <p>{countOrdersByStatus('completed')}</p>
                    </div>
                </div>

                <div className="filters">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search orders by ID or customer..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="status-filter">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={filter}
                            onChange={handleFilterChange}
                        >
                            <option value="all">All</option>
                            {statusOptions.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="orders-table-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            {error}
                            <button onClick={handleRefresh}>Try Again</button>
                        </div>
                    ) : (
                        <table className="orders-table">
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
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="no-orders">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.order_id}>
                                            <td>#{order.order_id}</td>
                                            <td>
                                                <div className="customer-info">
                                                    <div className="customer-name">{order.customer_name || "Customer " + order.customer_id}</div>
                                                    <div className="customer-email">{order.customer_email || "ID: " + order.customer_id}</div>
                                                </div>
                                            </td>
                                            <td>{formatDate(order.order_date)}</td>
                                            <td>{formatCurrency(order.total_amount)}</td>
                                            <td>
                                                <span className={`status ${order.status}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="view-btn"
                                                        title="View Order Details"
                                                        onClick={() => handleViewOrder(order)}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        className="invoice-btn"
                                                        title="View Invoice"
                                                        onClick={() => alert(`Invoice for order #${order.order_id}`)}
                                                    >
                                                        <FaFileInvoice />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
                                            onChange={handleStatusChange}
                                            disabled={statusUpdating}
                                            className={`status-select ${currentOrder.status}`}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status.value} value={status.value}>
                                                    {status.label}
                                                </option>
                                            ))}
                                        </select>
                                        {statusUpdating && <span className="status-updating">Updating...</span>}
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
            </div>
        </AdminLayout>
    );
};

export default OrdersManagement; 