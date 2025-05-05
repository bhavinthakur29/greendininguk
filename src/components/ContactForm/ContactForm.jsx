import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here would go actual form submission logic
        console.log('Form submitted:', formData);

        // Simulate form submission
        setFormStatus('success');
        // Reset form after 3 seconds
        setTimeout(() => {
            setFormStatus(null);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }, 3000);
    };

    return (
        <div className="contact-form-container">


            <div className="form-wrapper">
                <h3>Send a Message</h3>

                {formStatus === 'success' && (
                    <div className="form-success-message">
                        <p>Thank you! Your message has been sent successfully.</p>
                    </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <FaPaperPlane className="btn-icon" />
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;