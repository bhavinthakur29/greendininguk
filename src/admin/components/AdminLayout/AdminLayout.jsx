import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaBars, FaBell, FaSearch, FaUserCircle, FaQuestion, FaTimes, FaCheck } from 'react-icons/fa';
import './AdminLayout.css';
import { useAuth } from '../../../context/AuthContext';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 992);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // Sample notifications - in a real app, these would come from an API
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'order',
            message: 'New order #1089 received',
            time: 'Just now',
            read: false
        },
        {
            id: 2,
            type: 'inventory',
            message: 'Low stock alert: Organic Tomatoes',
            time: '2 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'customer',
            message: 'New customer registration: John Smith',
            time: 'Yesterday',
            read: true
        },
        {
            id: 4,
            type: 'system',
            message: 'System backup completed successfully',
            time: '2 days ago',
            read: true
        }
    ]);

    const unreadCount = notifications.filter(notification => !notification.read).length;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (!searchOpen) {
            // Focus the search input when opened
            setTimeout(() => {
                document.getElementById('admin-search').focus();
            }, 100);
        }
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownOpen(!notificationDropdownOpen);
        setProfileDropdownOpen(false);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
        setNotificationDropdownOpen(false);
    };

    const handleClickOutside = (e) => {
        if (
            notificationDropdownOpen &&
            !e.target.closest('.notification-dropdown') &&
            !e.target.closest('.notification-btn')
        ) {
            setNotificationDropdownOpen(false);
        }

        if (
            profileDropdownOpen &&
            !e.target.closest('.profile-dropdown') &&
            !e.target.closest('.profile-btn')
        ) {
            setProfileDropdownOpen(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Mark a notification as read
    const markAsRead = (id) => {
        setNotifications(
            notifications.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(
            notifications.map(notification => ({ ...notification, read: true }))
        );
    };

    // Delete a notification
    const deleteNotification = (id) => {
        setNotifications(
            notifications.filter(notification => notification.id !== id)
        );
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would search through the admin panel
        alert(`Searching for: ${searchQuery}`);
        setSearchQuery('');
        setSearchOpen(false);
    };

    // Close sidebar on small screens when clicking outside
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 992) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [notificationDropdownOpen, profileDropdownOpen]);

    // Get notification icon color based on type
    const getNotificationColor = (type) => {
        switch (type) {
            case 'order': return '#2ecc71';
            case 'inventory': return '#e74c3c';
            case 'customer': return '#3498db';
            case 'system': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order': return <FaShoppingCart style={{ color: getNotificationColor(type) }} />;
            case 'inventory': return <FaShoppingCart style={{ color: getNotificationColor(type) }} />;
            case 'customer': return <FaUsers style={{ color: getNotificationColor(type) }} />;
            case 'system': return <FaCog style={{ color: getNotificationColor(type) }} />;
            default: return <FaBell style={{ color: getNotificationColor(type) }} />;
        }
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <img src="/images/site-logo.png" alt="Green Dining" className="sidebar-logo" />
                    <button className="mobile-toggle" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <Link
                        to="/admin/dashboard"
                        className={location.pathname === '/admin/dashboard' || location.pathname === '/admin' ? 'active' : ''}
                        title="Dashboard"
                    >
                        <FaHome className="nav-icon" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/products"
                        className={location.pathname.includes('/admin/products') ? 'active' : ''}
                        title="Products"
                    >
                        <FaShoppingCart className="nav-icon" />
                        <span>Products</span>
                    </Link>
                    <Link
                        to="/admin/orders"
                        className={location.pathname.includes('/admin/orders') ? 'active' : ''}
                        title="Orders"
                    >
                        <FaShoppingCart className="nav-icon" />
                        <span>Orders</span>
                    </Link>
                    <Link
                        to="/admin/customers"
                        className={location.pathname.includes('/admin/customers') ? 'active' : ''}
                        title="Customers"
                    >
                        <FaUsers className="nav-icon" />
                        <span>Customers</span>
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className={location.pathname.includes('/admin/analytics') ? 'active' : ''}
                        title="Analytics"
                    >
                        <FaChartBar className="nav-icon" />
                        <span>Analytics</span>
                    </Link>
                    <Link
                        to="/admin/settings"
                        className={location.pathname.includes('/admin/settings') ? 'active' : ''}
                        title="Settings"
                    >
                        <FaCog className="nav-icon" />
                        <span>Settings</span>
                    </Link>
                    <Link
                        to="/admin/help"
                        className={location.pathname.includes('/admin/help') ? 'active' : ''}
                        title="Help"
                    >
                        <FaQuestion className="nav-icon" />
                        <span>Help</span>
                    </Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <main className="main-content">
                {/* Top navbar */}
                <header className="admin-header">
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <FaBars />
                    </button>

                    <div className="header-actions">
                        <button className="search-toggle" onClick={toggleSearch}>
                            <FaSearch />
                        </button>

                        <div className="notification-container">
                            <button
                                className="notification-btn"
                                onClick={toggleNotificationDropdown}
                            >
                                <FaBell />
                                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                            </button>

                            {notificationDropdownOpen && (
                                <div className="notification-dropdown">
                                    <div className="dropdown-header">
                                        <h3>Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                className="mark-all-read"
                                                onClick={markAllAsRead}
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className="notifications-list">
                                        {notifications.length === 0 ? (
                                            <div className="empty-notifications">
                                                <p>No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                                >
                                                    <div className="notification-icon">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="notification-content">
                                                        <p className="notification-message">{notification.message}</p>
                                                        <span className="notification-time">{notification.time}</span>
                                                    </div>
                                                    <div className="notification-actions">
                                                        {!notification.read && (
                                                            <button
                                                                className="action-btn"
                                                                onClick={() => markAsRead(notification.id)}
                                                                title="Mark as read"
                                                            >
                                                                <FaCheck size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="action-btn delete"
                                                            onClick={() => deleteNotification(notification.id)}
                                                            title="Delete notification"
                                                        >
                                                            <FaTimes size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="dropdown-footer">
                                        <Link to="/admin/settings" className="view-all">
                                            Notification Settings
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="profile-container">
                            <button
                                className="profile-btn"
                                onClick={toggleProfileDropdown}
                            >
                                <FaUserCircle />
                            </button>

                            {profileDropdownOpen && (
                                <div className="profile-dropdown">
                                    <div className="user-info">
                                        <FaUserCircle className="user-avatar" />
                                        <div>
                                            <h4>Admin User</h4>
                                            <p>admin@greendining.com</p>
                                        </div>
                                    </div>

                                    <div className="dropdown-menu">
                                        <Link to="/admin/settings" className="dropdown-item">
                                            <FaCog className="item-icon" />
                                            <span>Settings</span>
                                        </Link>
                                        <Link to="/admin/help" className="dropdown-item">
                                            <FaQuestion className="item-icon" />
                                            <span>Help</span>
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <FaSignOutAlt className="item-icon" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Search overlay */}
                {searchOpen && (
                    <div className="search-overlay">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="search-container">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    id="admin-search"
                                    placeholder="Search admin panel..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="button" className="close-search" onClick={toggleSearch}>
                                    <FaTimes />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Main content */}
                <div className="content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout; 