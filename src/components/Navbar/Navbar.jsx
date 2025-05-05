import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaLeaf, FaUserShield } from 'react-icons/fa';
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
                    </ul>

                    <div className="navbar-right">
                        {isDesktop && (
                            <button
                                className="admin-login-btn"
                                onClick={handleAdminClick}
                                title={isAuthenticated ? "Logout" : "Admin Login"}
                            >
                                <FaUserShield className="admin-icon" />
                                <span>{isAuthenticated ? "Logout" : "Admin"}</span>
                            </button>
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
                onLogin={login}
            />
        </>
    );
};

export default Navbar;