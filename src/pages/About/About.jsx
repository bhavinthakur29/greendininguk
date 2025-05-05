import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-hero">
                <h1>Our Story</h1>
                <p>Making sustainable dining accessible to everyone</p>
            </section>

            <section className="about-content">
                <div className="about-section">
                    <h2>Who We Are</h2>
                    <p>
                        GreenDining was founded in 2020 with a simple mission: to provide
                        eco-friendly dining solutions that don't compromise on quality or
                        convenience. We believe that sustainable living should be accessible
                        to everyone, and that small changes in our daily habits can make a
                        big difference to our planet.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Sustainability</h3>
                            <p>
                                We're committed to using only biodegradable and compostable
                                materials in our products.
                            </p>
                        </div>
                        <div className="value-card">
                            <h3>Quality</h3>
                            <p>
                                Our products are designed to be durable and functional while
                                maintaining their eco-friendly properties.
                            </p>
                        </div>
                        <div className="value-card">
                            <h3>Innovation</h3>
                            <p>
                                We continuously research and develop new materials and methods
                                to improve our products.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Our Team</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Rishang" alt="Sarah Johnson" />
                            </div>
                            <h3>Rishang Parihar</h3>
                            <p>Managing Director</p>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Pankaj" alt="Michael Chen" />
                            </div>
                            <h3>Pankaj Giri</h3>
                            <p>Assistant Managing Director <br />& Operations Director</p>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Natasha" alt="Natasha Catherine Singh" />
                            </div>
                            <h3>Natasha Catherine Singh</h3>
                            <p>HR Director</p>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Kalidas" alt="Kalidas Krishna Unnikrishnan" />
                            </div>
                            <h3>Kalidas Krishna Unnikrishnan</h3>
                            <p>Sales Team Manager</p>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Basheer" alt="Muhammad Basheer Methuvin Nalakath" />
                            </div>
                            <h3>Muhammad Basheer Methuvin Nalakath</h3>
                            <p>Finance Director</p>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Nikhil" alt="Nikhil Reddy Sandireddy" />
                            </div>
                            <h3>Nikhil Reddy Sandireddy</h3>
                            <p>Marketing Director</p>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Josna" alt="Josna Jose" />
                            </div>
                            <h3>Josna Jose</h3>
                            <p>Sustainability Director</p>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://placehold.co/400x400/2ecc71/ffffff?text=Rakesh" alt="Rakesh Pasula" />
                            </div>
                            <h3>Rakesh Pasula</h3>
                            <p>Digital Tech & <br />Supply Chain Director</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>Our Mission</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Mission 1</h3>
                            <p>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis fugiat nemo hic cupiditate reiciendis rerum.
                            </p>
                        </div>
                        <div className="value-card">
                            <h3>Mission 2</h3>
                            <p>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga rerum perspiciatis officia tempora. Quidem, fuga!
                            </p>
                        </div>
                        <div className="value-card">
                            <h3>Mission 3</h3>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt illum autem culpa saepe iste deleniti!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About; 