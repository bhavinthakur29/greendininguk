import React, { useState, useEffect } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaEdit, FaTrash, FaSync, FaTimes, FaUserEdit, FaUserPlus } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import './CustomersManagement.css';
import { toast } from 'react-toastify';

const CustomersManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerType, setCustomerType] = useState('all');
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'United Kingdom',
        customer_type: 'retail',
        marketing_consent: false
    });
    const [customerStats, setCustomerStats] = useState({
        total: 0,
        retail: 0,
        wholesale: 0,
        avgOrderValue: 0
    });

    // Fetch customers from API
    const fetchCustomers = async () => {
        try {
            setRefreshing(true);

            // Get customers
            const response = await fetch('http://localhost:3001/api/customers');
            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }
            const data = await response.json();

            if (data.success) {
                const customerData = data.data;

                // Get orders for calculating total spent per customer
                const ordersResponse = await fetch('http://localhost:3001/api/orders');
                let orders = [];

                if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    if (ordersData.success) {
                        orders = ordersData.data;
                    }
                }

                // Enhance customer data with order information
                const enhancedCustomers = customerData.map(customer => {
                    const customerOrders = orders.filter(order => order.customer_id === customer.customer_id);
                    const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
                    const lastOrder = customerOrders.length > 0
                        ? customerOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date))[0].order_date
                        : null;

                    return {
                        ...customer,
                        orders: customerOrders.length,
                        totalSpent,
                        lastOrder
                    };
                });

                // Set customers data
                setCustomers(enhancedCustomers);

                // Calculate customer statistics
                const totalCustomers = enhancedCustomers.length;
                const retailCustomers = enhancedCustomers.filter(c => c.customer_type === 'retail').length;
                const wholesaleCustomers = enhancedCustomers.filter(c => c.customer_type === 'wholesale').length;

                // Calculate average order value
                const totalSpent = enhancedCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
                const totalOrders = enhancedCustomers.reduce((sum, c) => sum + c.orders, 0);
                const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

                setCustomerStats({
                    total: totalCustomers,
                    retail: retailCustomers,
                    wholesale: wholesaleCustomers,
                    avgOrderValue
                });

                setError(null);
            } else {
                throw new Error(data.error || 'Failed to load customers');
            }
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customers. Please try again.');
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Add a new customer
    const addCustomer = async (customerData) => {
        try {
            const response = await fetch('http://localhost:3001/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error('Failed to add customer');
            }

            const data = await response.json();
            if (data.success) {
                toast.success('Customer added successfully');
                fetchCustomers(); // Refresh the customers list
                return true;
            } else {
                throw new Error(data.error || 'Failed to add customer');
            }
        } catch (err) {
            console.error('Error adding customer:', err);
            toast.error(err.message);
            return false;
        }
    };

    // Update an existing customer
    const updateCustomer = async (customerId, customerData) => {
        try {
            const response = await fetch(`http://localhost:3001/api/customers/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error('Failed to update customer');
            }

            const data = await response.json();
            if (data.success) {
                toast.success('Customer updated successfully');
                fetchCustomers(); // Refresh the customers list
                return true;
            } else {
                throw new Error(data.error || 'Failed to update customer');
            }
        } catch (err) {
            console.error('Error updating customer:', err);
            toast.error(err.message);
            return false;
        }
    };

    // Delete a customer
    const deleteCustomer = async (customerId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/customers/${customerId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete customer');
            }

            const data = await response.json();
            if (data.success) {
                toast.success('Customer deleted successfully');
                fetchCustomers(); // Refresh the customers list
                return true;
            } else {
                throw new Error(data.error || 'Failed to delete customer');
            }
        } catch (err) {
            console.error('Error deleting customer:', err);
            toast.error(err.message);
            return false;
        }
    };

    // Load customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Filter customers based on search term and customer type
    const filteredCustomers = customers.filter(customer => {
        const fullName = `${customer.first_name} ${customer.last_name}`;
        const matchesSearch =
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = customerType === 'all' || customer.customer_type === customerType;

        return matchesSearch && matchesType;
    });

    // Format currency in GBP
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(amount);
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return '—';

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

    const handleTypeChange = (e) => {
        setCustomerType(e.target.value);
    };

    const handleRefresh = () => {
        fetchCustomers();
    };

    const handleAddCustomer = () => {
        setCurrentCustomer({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address_line1: '',
            address_line2: '',
            city: '',
            postal_code: '',
            country: 'United Kingdom',
            customer_type: 'retail',
            marketing_consent: false
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditCustomer = (customer) => {
        setCurrentCustomer({
            ...customer,
            marketing_consent: customer.marketing_consent === 1 || customer.marketing_consent === true
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            const success = await deleteCustomer(customerId);
            if (success) {
                // Customer deleted successfully, no need to do anything else as fetchCustomers() was called
            }
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentCustomer({
            ...currentCustomer,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success;

        if (isEditing) {
            success = await updateCustomer(currentCustomer.customer_id, currentCustomer);
        } else {
            success = await addCustomer(currentCustomer);
        }

        if (success) {
            handleModalClose();
        }
    };

    return (
        <AdminLayout>
            <div className="customers-management">
                <header className="customers-header">
                    <div>
                        <h1>Customers Management</h1>
                        <p>{customerStats.total} customers in database</p>
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
                        <button className="add-btn" onClick={handleAddCustomer}>
                            <FaUserPlus className="icon" />
                            <span>Add New Customer</span>
                        </button>
                    </div>
                </header>

                <div className="customer-stats">
                    <div className="stat-card">
                        <h3>Total Customers</h3>
                        <p>{customerStats.total}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Retail</h3>
                        <p>{customerStats.retail}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Wholesale</h3>
                        <p>{customerStats.wholesale}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Avg. Order Value</h3>
                        <p>{formatCurrency(customerStats.avgOrderValue)}</p>
                    </div>
                </div>

                <div className="filters">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search customers by name, email or phone..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="type-filter">
                        <label htmlFor="type">Customer Type:</label>
                        <select
                            id="type"
                            value={customerType}
                            onChange={handleTypeChange}
                        >
                            <option value="all">All</option>
                            <option value="retail">Retail</option>
                            <option value="wholesale">Wholesale</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading customers...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                        <button onClick={handleRefresh}>Try Again</button>
                    </div>
                ) : (
                    <div className="customers-table-container">
                        <table className="customers-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Type</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Last Order</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="no-customers">
                                            No customers found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.customer_id}>
                                            <td>#{customer.customer_id}</td>
                                            <td className="customer-name">{customer.first_name} {customer.last_name}</td>
                                            <td>
                                                <div className="contact-info">
                                                    <span className="contact-item">
                                                        <FaEnvelope className="contact-icon" />
                                                        {customer.email}
                                                    </span>
                                                    {customer.phone && (
                                                        <span className="contact-item">
                                                            <FaPhone className="contact-icon" />
                                                            {customer.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`customer-type ${customer.customer_type}`}>
                                                    {customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1)}
                                                </span>
                                            </td>
                                            <td>{customer.orders || 0}</td>
                                            <td>{formatCurrency(customer.totalSpent || 0)}</td>
                                            <td>{formatDate(customer.lastOrder)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-btn"
                                                        title="Edit Customer"
                                                        onClick={() => handleEditCustomer(customer)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        title="Delete Customer"
                                                        onClick={() => handleDeleteCustomer(customer.customer_id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal customer-modal">
                            <div className="modal-header">
                                <h2>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
                                <button className="close-modal-btn" onClick={handleModalClose}>
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-tabs">
                                    <div className="tab active">Personal Info</div>
                                    <div className="icon-preview">
                                        <FaUserEdit size={20} color="#2ecc71" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="first_name">First Name*</label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="first_name"
                                            value={currentCustomer.first_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last_name">Last Name*</label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            name="last_name"
                                            value={currentCustomer.last_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email*</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={currentCustomer.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={currentCustomer.phone || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address_line1">Address Line 1*</label>
                                    <input
                                        type="text"
                                        id="address_line1"
                                        name="address_line1"
                                        value={currentCustomer.address_line1}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address_line2">Address Line 2</label>
                                    <input
                                        type="text"
                                        id="address_line2"
                                        name="address_line2"
                                        value={currentCustomer.address_line2 || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City*</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={currentCustomer.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="postal_code">Postal Code*</label>
                                        <input
                                            type="text"
                                            id="postal_code"
                                            name="postal_code"
                                            value={currentCustomer.postal_code}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="country">Country</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={currentCustomer.country}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="customer_type">Customer Type*</label>
                                        <select
                                            id="customer_type"
                                            name="customer_type"
                                            value={currentCustomer.customer_type}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="retail">Retail</option>
                                            <option value="wholesale">Wholesale</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="marketing_consent"
                                        name="marketing_consent"
                                        checked={currentCustomer.marketing_consent}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="marketing_consent" className="checkbox-label">
                                        Marketing Consent (Can receive promotional emails)
                                    </label>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={handleModalClose} className="cancel-btn">
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-btn">
                                        {isEditing ? 'Update Customer' : 'Add Customer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CustomersManagement; 