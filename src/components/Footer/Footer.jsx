import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaLeaf } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <Link to="/" className="footer-logo-link">
                            <FaLeaf className="footer-logo-icon" />
                            <span>GreenDining</span>
                        </Link>
                        <p>"Let's build a greener UK together."</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-links-column">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/products">Products</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>

                        <div className="footer-links-column">
                            <h4>Products</h4>
                            <ul>
                                <li><Link to="/products">Leaf Plates</Link></li>
                                <li><Link to="/products">Leaf Bowls</Link></li>
                                <li><Link to="/products">Buffet Plates</Link></li>
                                <li><Link to="/products">All Products</Link></li>
                            </ul>
                        </div>

                        <div className="footer-links-column">
                            <h4>Contact</h4>
                            <ul>
                                <li>Email: hello.greendining@gmail.com</li>
                                <li>Website: greendininguk.netlify.app</li>
                                <li>Social: @green_dinning7</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-social">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com/green_dinning7" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                    </div>
                    <p className="footer-copyright">
                        &copy; {currentYear} GreenDining UK. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;