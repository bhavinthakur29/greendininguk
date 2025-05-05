import React from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import './AimSection.css';

const AimSection = () => {
    return (
        <section className="aim-section section-padding">
            <div className="container">
                <h2 className="section-title">Our Mission</h2>
                <p className="section-subtitle">We're committed to making a difference</p>

                <div className="aim-content">
                    <div className="aim-text">
                        <div className="aim-goal">
                            <h3>Our Goal</h3>
                            <p className="aim-quote">"Replace 10 million plastic plates in the UK by 2025."</p>
                            <p>
                                By offering a practical and sustainable alternative to plastic, GreenDining aims to drive environmental
                                change and promote a greener future for the UK. We're working with universities, places of worship,
                                and restaurants to replace single-use plastics with our biodegradable alternatives.
                            </p>
                        </div>

                        <div className="aim-stats">
                            <div className="aim-stat">
                                <div className="stat-percent">85%</div>
                                <p>of tableware market share consists of plastic products</p>
                            </div>
                            <div className="aim-stat">
                                <div className="stat-percent">95%</div>
                                <p>reduction in CO2 footprint compared to plastic</p>
                            </div>
                        </div>

                        <div className="aim-benefits">
                            <h3>Benefits to Nature</h3>
                            <ul className="benefits-list">
                                <li>
                                    <FaRegCheckCircle className="benefit-icon" />
                                    <div>
                                        <h4>Waste Reduction</h4>
                                        <p>Utilizing fallen leaves for plate production repurposes natural waste that would otherwise decompose unused, promoting a circular economy.</p>
                                    </div>
                                </li>
                                <li>
                                    <FaRegCheckCircle className="benefit-icon" />
                                    <div>
                                        <h4>Soil Enrichment</h4>
                                        <p>As these plates biodegrade, they return nutrients to the soil, enhancing soil fertility and supporting plant growth.</p>
                                    </div>
                                </li>
                                <li>
                                    <FaRegCheckCircle className="benefit-icon" />
                                    <div>
                                        <h4>Energy Efficiency</h4>
                                        <p>Production process is energy-efficient, relying on natural drying methods and minimal machinery, thereby reducing overall energy consumption.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="aim-timeline">
                        <h3>Our Plan</h3>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-marker">2024</div>
                                <div className="timeline-content">
                                    <h4>Founded</h4>
                                    <p>GreenDining launched with a mission to reduce single-use plastics.</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-marker">2025</div>
                                <div className="timeline-content">
                                    <h4>Expansion</h4>
                                    <p>Expand to 50+ eco-restaurants in London.</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-marker">2026</div>
                                <div className="timeline-content">
                                    <h4>Zero-Waste</h4>
                                    <p>Achieve Zero-Waste Certification for all facilities.</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-marker">2027</div>
                                <div className="timeline-content">
                                    <h4>Scale Operations</h4>
                                    <p>Reduce production costs by 20% through scaled operations.</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-marker">2030</div>
                                <div className="timeline-content">
                                    <h4>European Market</h4>
                                    <p>Export to EU markets and integrate smart composting bins.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AimSection;