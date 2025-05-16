import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaLeaf, FaUserShield, FaTachometerAlt, FaClipboardList, FaChartLine, FaBoxes } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import { LoginModal } from '../../admin/components';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { totalItems } = useContext(CartContext);
    const { isAuthenticated, login, logout } = useAuth();
    const isDesktop = useMediaQuery('(min-width: 769px)');
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleAdminClick = () => {
        if (isAuthenticated) {
            logout();
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleLogin = () => {
        login();
        setIsLoginModalOpen(false);
        navigate('/admin/dashboard');
    };

    return (
        <>
            <nav className="navbar">
                <div className="container navbar-container">
                    <Link to="/" className="navbar-logo" onClick={closeMenu}>
                        <FaLeaf className="logo-icon" />
                        <span>GreenDining</span>
                    </Link>

                    <div className="menu-icon" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>

                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                Products
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                Contact
                            </NavLink>
                        </li>

                        {!isDesktop && (
                            <li className="nav-item admin-mobile-item">
                                <button
                                    className="mobile-admin-btn"
                                    onClick={() => {
                                        closeMenu();
                                        handleAdminClick();
                                    }}
                                >
                                    <FaUserShield className="admin-nav-icon" />
                                    {isAuthenticated ? "Logout" : "Admin Login"}
                                </button>
                            </li>
                        )}

                        {!isDesktop && isAuthenticated && (
                            <>
                                <li className="nav-item admin-mobile-item">
                                    <h3 className="admin-section-title">Admin Panel</h3>
                                </li>
                                <li className="nav-item admin-mobile-item">
                                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                        <FaTachometerAlt className="admin-nav-icon" />
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item admin-mobile-item">
                                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                        <FaBoxes className="admin-nav-icon" />
                                        Products
                                    </NavLink>
                                </li>
                                <li className="nav-item admin-mobile-item">
                                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                        <FaClipboardList className="admin-nav-icon" />
                                        Orders
                                    </NavLink>
                                </li>
                                <li className="nav-item admin-mobile-item">
                                    <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                                        <FaChartLine className="admin-nav-icon" />
                                        Analytics
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="navbar-right">
                        {isDesktop && (
                            <>
                                {isAuthenticated && (
                                    <Link to="/admin/dashboard" className="dashboard-link" title="Admin Dashboard">
                                        <FaTachometerAlt className="dashboard-icon" />
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                                <button
                                    className="admin-login-btn"
                                    onClick={handleAdminClick}
                                    title={isAuthenticated ? "Logout" : "Admin Login"}
                                >
                                    <FaUserShield className="admin-icon" />
                                    <span>{isAuthenticated ? "Logout" : "Admin"}</span>
                                </button>
                            </>
                        )}
                        <Link to="/cart" className="cart-icon-link">
                            <FaShoppingCart className="cart-icon" />
                            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                        </Link>
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
            />
        </>
    );
};

export default Navbar;