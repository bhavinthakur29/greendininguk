import React from 'react';
import ContactForm from '../../components/ContactForm/ContactForm';
import './Contact.css';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="contact-hero">
                <h1>Get in Touch</h1>
                <p>We'd love to hear from you</p>
            </div>

            <div className="contact-container">

                <div className="contact-info">
                    <h3>Get In Touch</h3>
                    <p>Have questions about our products or interested in bulk orders? Contact us today!</p>

                    <div className="contact-details">
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <div>
                                <h4>Email</h4>
                                <p>hello.greendining@gmail.com</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <div>
                                <h4>Phone</h4>
                                <p>Coming Soon</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <div>
                                <h4>Location</h4>
                                <p>United Kingdom</p>
                            </div>
                        </div>
                    </div>

                    <div className="social-links">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                        </div>
                        <p><a href="https://www.instagram.com/green_dining7/" target="_blank" rel="noopener noreferrer">@green_dining7</a></p>

                    </div>
                </div>


                <div className="contact-form-section">
                    <h2>Send us a Message</h2>
                    <ContactForm />
                </div>
            </div>
        </div>
    );
};

export default Contact; 