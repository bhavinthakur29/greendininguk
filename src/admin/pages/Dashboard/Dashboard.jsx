import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import products from '../../../data/products';
import './Dashboard.css';

const Dashboard = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Calculate dashboard statistics
    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);
    const totalOrders = 156; // This would come from an orders API in a real application

    // Format currency in GBP
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(amount);
    };

    // Redirect to home if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p>{totalProducts}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{totalOrders}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p>{formatCurrency(totalRevenue)}</p>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="dashboard-section">
                    <h2>Recent Orders</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#12345</td>
                                    <td>John Doe</td>
                                    <td>2024-03-15</td>
                                    <td>{formatCurrency(99.99)}</td>
                                    <td><span className="status completed">Completed</span></td>
                                </tr>
                                <tr>
                                    <td>#12346</td>
                                    <td>Jane Smith</td>
                                    <td>2024-03-14</td>
                                    <td>{formatCurrency(149.99)}</td>
                                    <td><span className="status pending">Pending</span></td>
                                </tr>
                                <tr>
                                    <td>#12347</td>
                                    <td>Bob Johnson</td>
                                    <td>2024-03-13</td>
                                    <td>{formatCurrency(79.99)}</td>
                                    <td><span className="status processing">Processing</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="dashboard-section">
                    <h2>Product Overview</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{formatCurrency(product.price)}</td>
                                        <td><span className="status completed">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button className="action-button">
                            <span>Add New Product</span>
                        </button>
                        <button className="action-button">
                            <span>View All Orders</span>
                        </button>
                        <button className="action-button">
                            <span>Manage Inventory</span>
                        </button>
                        <button className="action-button">
                            <span>View Analytics</span>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard; 