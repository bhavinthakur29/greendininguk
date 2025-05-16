import React, { useState } from 'react';
import { FaSave, FaBell, FaLock, FaDatabase, FaStore, FaEnvelope, FaInfoCircle, FaQuestionCircle, FaCog, FaPowerOff, FaGlobe, FaPoundSign, FaPercent, FaClock, FaKey } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import './SettingsPage.css';
import { toast } from 'react-toastify';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        storeName: 'Green Dining',
        storeEmail: 'contact@greendining.com',
        storePhone: '+44 20 1234 5678',
        storeAddress: '123 Green Street, London, UK',
        currencySymbol: '£',
        taxRate: 20,
        enableNotifications: true,
        notificationEmail: 'admin@greendining.com',
        backupFrequency: 'daily',
        passwordMinLength: 8,
        requireSpecialChar: true,
        autoLogout: 30,
        language: 'english',
        timezone: 'Europe/London'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked :
                (type === 'number' ? parseFloat(value) : value)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would save to a backend
        toast.success('Settings saved successfully!');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="settings-form-section">
                        <div className="settings-section-header">
                            <FaStore className="section-icon" />
                            <h3>Store Information</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="storeName">Store Name</label>
                                <input
                                    type="text"
                                    id="storeName"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="storeEmail">Store Email</label>
                                <div className="input-with-icon">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        id="storeEmail"
                                        name="storeEmail"
                                        value={formData.storeEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="storePhone">Store Phone</label>
                                <input
                                    type="tel"
                                    id="storePhone"
                                    name="storePhone"
                                    value={formData.storePhone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="language">Language</label>
                                <select
                                    id="language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                >
                                    <option value="english">English</option>
                                    <option value="french">French</option>
                                    <option value="german">German</option>
                                    <option value="spanish">Spanish</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="storeAddress">Store Address</label>
                            <textarea
                                id="storeAddress"
                                name="storeAddress"
                                value={formData.storeAddress}
                                onChange={handleChange}
                                rows="2"
                            ></textarea>
                        </div>

                        <div className="settings-section-header">
                            <FaGlobe className="section-icon" />
                            <h3>Regional Settings</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="timezone">Timezone</label>
                                <select
                                    id="timezone"
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleChange}
                                >
                                    <option value="Europe/London">London (GMT/BST)</option>
                                    <option value="America/New_York">New York (ET)</option>
                                    <option value="America/Los_Angeles">Los Angeles (PT)</option>
                                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                                    <option value="Australia/Sydney">Sydney (AEST)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="currencySymbol">Currency Symbol</label>
                                <div className="input-with-icon">
                                    <FaPoundSign className="input-icon" />
                                    <input
                                        type="text"
                                        id="currencySymbol"
                                        name="currencySymbol"
                                        value={formData.currencySymbol}
                                        onChange={handleChange}
                                        maxLength="1"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="taxRate">Tax Rate (%)</label>
                            <div className="input-with-icon">
                                <FaPercent className="input-icon" />
                                <input
                                    type="number"
                                    id="taxRate"
                                    name="taxRate"
                                    value={formData.taxRate}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="settings-form-section">
                        <div className="settings-section-header">
                            <FaBell className="section-icon" />
                            <h3>Email Notifications</h3>
                        </div>
                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="enableNotifications"
                                name="enableNotifications"
                                checked={formData.enableNotifications}
                                onChange={handleChange}
                            />
                            <label htmlFor="enableNotifications" className="checkbox-label">Enable Email Notifications</label>
                        </div>
                        <div className="notification-settings" style={{ opacity: formData.enableNotifications ? 1 : 0.5 }}>
                            <div className="form-group">
                                <label htmlFor="notificationEmail">Notification Email</label>
                                <div className="input-with-icon">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        id="notificationEmail"
                                        name="notificationEmail"
                                        value={formData.notificationEmail}
                                        onChange={handleChange}
                                        disabled={!formData.enableNotifications}
                                    />
                                </div>
                            </div>

                            <div className="notification-options">
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="notifyNewOrders"
                                        checked={true}
                                        disabled={!formData.enableNotifications}
                                        readOnly
                                    />
                                    <label htmlFor="notifyNewOrders" className="checkbox-label">New Orders</label>
                                </div>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="notifyLowStock"
                                        checked={true}
                                        disabled={!formData.enableNotifications}
                                        readOnly
                                    />
                                    <label htmlFor="notifyLowStock" className="checkbox-label">Low Stock Alerts</label>
                                </div>
                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="notifyNewCustomers"
                                        checked={true}
                                        disabled={!formData.enableNotifications}
                                        readOnly
                                    />
                                    <label htmlFor="notifyNewCustomers" className="checkbox-label">New Customer Registrations</label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'database':
                return (
                    <div className="settings-form-section">
                        <div className="settings-section-header">
                            <FaDatabase className="section-icon" />
                            <h3>Database Management</h3>
                        </div>
                        <div className="form-group">
                            <label htmlFor="backupFrequency">Backup Frequency</label>
                            <select
                                id="backupFrequency"
                                name="backupFrequency"
                                value={formData.backupFrequency}
                                onChange={handleChange}
                            >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="database-actions">
                            <button type="button" className="action-btn">
                                <FaDatabase /> Run Backup Now
                            </button>
                            <button type="button" className="action-btn">
                                <FaDatabase /> Export Database
                            </button>
                            <button type="button" className="action-btn">
                                <FaDatabase /> Import Data
                            </button>
                        </div>
                        <div className="database-info">
                            <h4>Database Summary</h4>
                            <div className="database-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Database Size</span>
                                    <span className="stat-value">128 MB</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Last Backup</span>
                                    <span className="stat-value">Today, 5:30 AM</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Next Backup</span>
                                    <span className="stat-value">Tomorrow, 5:30 AM</span>
                                </div>
                            </div>
                        </div>
                        <div className="schema-info">
                            <h4>Database Schema</h4>
                            <div className="schema-tables">
                                <div className="schema-table">
                                    <h5>Customers</h5>
                                    <p>15 records</p>
                                </div>
                                <div className="schema-table">
                                    <h5>Products</h5>
                                    <p>48 records</p>
                                </div>
                                <div className="schema-table">
                                    <h5>Orders</h5>
                                    <p>32 records</p>
                                </div>
                                <div className="schema-table">
                                    <h5>Order Items</h5>
                                    <p>87 records</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="settings-form-section">
                        <div className="settings-section-header">
                            <FaKey className="section-icon" />
                            <h3>Password Settings</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="passwordMinLength">Minimum Password Length</label>
                                <input
                                    type="number"
                                    id="passwordMinLength"
                                    name="passwordMinLength"
                                    value={formData.passwordMinLength}
                                    onChange={handleChange}
                                    min="6"
                                    max="20"
                                />
                                <span className="form-help">Minimum recommended: 8 characters</span>
                            </div>
                            <div className="form-group checkbox-group vertical">
                                <label className="group-label">Password Requirements</label>
                                <div className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id="requireSpecialChar"
                                        name="requireSpecialChar"
                                        checked={formData.requireSpecialChar}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="requireSpecialChar" className="checkbox-label">Require Special Characters</label>
                                </div>
                                <div className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id="requireUppercase"
                                        checked={true}
                                        readOnly
                                    />
                                    <label htmlFor="requireUppercase" className="checkbox-label">Require Uppercase Letters</label>
                                </div>
                                <div className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id="requireNumbers"
                                        checked={true}
                                        readOnly
                                    />
                                    <label htmlFor="requireNumbers" className="checkbox-label">Require Numbers</label>
                                </div>
                            </div>
                        </div>
                        <div className="settings-section-header">
                            <FaClock className="section-icon" />
                            <h3>Session Settings</h3>
                        </div>
                        <div className="form-group">
                            <label htmlFor="autoLogout">Auto Logout (minutes)</label>
                            <div className="input-with-slider">
                                <input
                                    type="range"
                                    id="autoLogout"
                                    name="autoLogout"
                                    value={formData.autoLogout}
                                    onChange={handleChange}
                                    min="5"
                                    max="120"
                                    step="5"
                                />
                                <span className="range-value">{formData.autoLogout} min</span>
                            </div>
                        </div>
                        <div className="security-actions">
                            <button type="button" className="action-btn warning">
                                <FaKey /> Reset All Admin Passwords
                            </button>
                            <button type="button" className="action-btn">
                                <FaLock /> View Access Logs
                            </button>
                        </div>
                    </div>
                );
            case 'system':
                return (
                    <div className="settings-form-section">
                        <div className="settings-section-header">
                            <FaCog className="section-icon" />
                            <h3>System Information</h3>
                        </div>
                        <div className="system-info">
                            <div className="info-item">
                                <span className="info-label">Green Dining Version</span>
                                <span className="info-value">1.5.2</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Environment</span>
                                <span className="info-value">Production</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Server OS</span>
                                <span className="info-value">Linux</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Node.js Version</span>
                                <span className="info-value">18.15.0</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Database Version</span>
                                <span className="info-value">SQLite 3.36.0</span>
                            </div>
                        </div>

                        <div className="settings-section-header">
                            <FaPowerOff className="section-icon" />
                            <h3>System Maintenance</h3>
                        </div>
                        <div className="maintenance-actions">
                            <button type="button" className="action-btn">
                                <FaCog /> Clear Cache
                            </button>
                            <button type="button" className="action-btn">
                                <FaCog /> Check Updates
                            </button>
                            <button type="button" className="action-btn warning">
                                <FaPowerOff /> Restart System
                            </button>
                        </div>

                        <div className="system-logs">
                            <h4>System Logs</h4>
                            <div className="logs-container">
                                <div className="log-entry">
                                    <span className="log-time">Today 10:45 AM</span>
                                    <span className="log-message">System backup completed successfully</span>
                                </div>
                                <div className="log-entry">
                                    <span className="log-time">Today 08:30 AM</span>
                                    <span className="log-message">Cache cleared automatically</span>
                                </div>
                                <div className="log-entry">
                                    <span className="log-time">Yesterday 11:15 PM</span>
                                    <span className="log-message">Database optimization completed</span>
                                </div>
                                <div className="log-entry">
                                    <span className="log-time">Yesterday 6:20 PM</span>
                                    <span className="log-message">System update check completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <div className="settings-page">
                <header className="settings-header">
                    <h1>Settings</h1>
                    <p>Configure your store and admin panel settings</p>
                </header>

                <div className="settings-container">
                    <div className="settings-sidebar">
                        <div
                            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            <FaStore className="tab-icon" />
                            <span>General</span>
                        </div>
                        <div
                            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <FaBell className="tab-icon" />
                            <span>Notifications</span>
                        </div>
                        <div
                            className={`settings-tab ${activeTab === 'database' ? 'active' : ''}`}
                            onClick={() => setActiveTab('database')}
                        >
                            <FaDatabase className="tab-icon" />
                            <span>Database</span>
                        </div>
                        <div
                            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <FaLock className="tab-icon" />
                            <span>Security</span>
                        </div>
                        <div
                            className={`settings-tab ${activeTab === 'system' ? 'active' : ''}`}
                            onClick={() => setActiveTab('system')}
                        >
                            <FaCog className="tab-icon" />
                            <span>System</span>
                        </div>
                    </div>

                    <div className="settings-content">
                        <form onSubmit={handleSubmit}>
                            {renderTabContent()}

                            {activeTab !== 'system' && (
                                <div className="form-actions">
                                    <button type="submit" className="save-btn">
                                        <FaSave className="btn-icon" />
                                        Save Settings
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SettingsPage; 