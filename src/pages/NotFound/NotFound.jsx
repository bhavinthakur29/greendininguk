import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for doesn't exist or has been moved.</p>
            <div className="not-found-actions">
                <Link to="/" className="not-found-btn home-btn">
                    <FaHome /> Go to Homepage
                </Link>
                <Link to="/products" className="not-found-btn shop-btn">
                    <FaShoppingCart /> Browse Products
                </Link>
            </div>
        </div>
    );
};

export default NotFound; 