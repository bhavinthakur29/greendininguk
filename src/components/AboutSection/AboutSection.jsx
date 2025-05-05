import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaLeaf, FaSeedling } from 'react-icons/fa';
import './AboutSection.css';
const aboutBg = '/images/about-bg.png';

const AboutSection = () => {
    return (
        <section className="about-section section-padding">
            <div className="container">
                <h2 className="section-title">About GreenDining</h2>
                <p className="section-subtitle">Sustainable Solutions for a Plastic-Free Future</p>

                <div className="about-home about-content">
                    <div className="about-image">
                        <img src={aboutBg} alt="Sustainable dining solutions" />
                    </div>
                    <div className="about-text">
                        <h3>Our Story</h3>
                        <p>Founded in 2024, GreenDining emerged with a clear mission: to reduce single-use plastics in the UK's dining sector. We import high-quality, sustainable tableware to promote environmentally responsible dining solutions.</p>
                        <br />
                        <p>The UK is the 2nd biggest producer of plastic waste per person in the world, behind the USA. With plastic taking over 450 years to decompose, we're facing a crisis with 1.7 billion pieces thrown away weekly in the UK.</p>

                        <div className="about-features">
                            <div className="feature">
                                <FaLeaf className="feature-icon" />
                                <h4>100% Biodegradable</h4>
                                <p>Our products are made from naturally fallen leaves, completely chemical-free.</p>
                            </div>
                            <div className="feature">
                                <FaRecycle className="feature-icon" />
                                <p>Compostable in 90 days vs plastic's 450+ years</p>
                            </div>
                            <div className="feature">
                                <FaSeedling className="feature-icon" />
                                <p>80% lower CO2 emissions than plastic production</p>
                            </div>
                        </div>

                        <Link to="/about" className="btn btn-primary">Learn More About Us</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;