import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaChartBar,
    FaCog,
    FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Green Dining</h2>
                <p>Admin Panel</p>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <FaHome className="icon" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <FaBox className="icon" />
                    <span>Products</span>
                </NavLink>

                <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <FaShoppingCart className="icon" />
                    <span>Orders</span>
                </NavLink>

                <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <FaUsers className="icon" />
                    <span>Customers</span>
                </NavLink>

                <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <FaChartBar className="icon" />
                    <span>Analytics</span>
                </NavLink>

                <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                    <FaCog className="icon" />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 