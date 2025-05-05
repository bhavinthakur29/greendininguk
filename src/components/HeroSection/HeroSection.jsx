import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-overlay"></div>
            <div className="container hero-container">
                <div className="hero-content">
                    <h1>Transforming Waste into Sustainable Dining Solutions</h1>
                    <p>
                        100% biodegradable leaf-based tableware. Chemical-free, energy-efficient production.
                        Compostable in 90 days.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn btn-primary">
                            Shop Now <FaArrowRight className="btn-icon" />
                        </Link>
                        <Link to="/about" className="btn btn-outline">
                            Learn More
                        </Link>
                    </div>
                </div>
                <div className="hero-stats">
                    <div className="hero-stat-item">
                        <h3>90 Days</h3>
                        <p>to Decompose</p>
                    </div>
                    <div className="hero-stat-item">
                        <h3>100%</h3>
                        <p>Natural & Chemical-Free</p>
                    </div>
                    <div className="hero-stat-item">
                        <h3>80%</h3>
                        <p>Lower CO2 Emissions</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;