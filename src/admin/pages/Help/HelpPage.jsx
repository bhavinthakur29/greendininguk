import React, { useState } from 'react';
import { FaQuestionCircle, FaBook, FaInfoCircle, FaVideo, FaEnvelope, FaSearch } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import './HelpPage.css';

const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('getting-started');

    const faqs = [
        {
            question: 'How do I add a new product?',
            answer: 'Navigate to Products Management, click "Add New Product", fill in the required details, and click "Save Product".',
            tags: ['products', 'add', 'create']
        },
        {
            question: 'How do I update order status?',
            answer: 'Go to Orders Management, click the view icon on an order to open details, then select the new status from the dropdown in the order details view.',
            tags: ['orders', 'status', 'update']
        },
        {
            question: 'How do I add a new customer manually?',
            answer: 'Navigate to Customers Management, click "Add New Customer", fill in customer details, and click "Add Customer".',
            tags: ['customers', 'add', 'create']
        },
        {
            question: 'How do I view analytics for a specific time period?',
            answer: 'Go to the Analytics page and use the period selector in the top right to choose your desired time range.',
            tags: ['analytics', 'reports', 'data']
        },
        {
            question: 'How do I change the store information?',
            answer: 'Navigate to Settings, select the General tab, update your store information, and click Save.',
            tags: ['settings', 'store', 'information']
        },
        {
            question: 'How do I check low stock items?',
            answer: 'You can view low stock items either in the Analytics dashboard or by filtering products in Products Management.',
            tags: ['inventory', 'stock', 'low stock']
        },
        {
            question: 'How do I export order data?',
            answer: 'Currently, you can view invoice data by clicking the invoice icon in the Orders Management page. Full export functionality is coming soon.',
            tags: ['orders', 'export', 'data']
        }
    ];

    // Filter FAQs based on search term
    const filteredFaqs = faqs.filter(faq => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return faq.question.toLowerCase().includes(lowerCaseSearch) ||
            faq.answer.toLowerCase().includes(lowerCaseSearch) ||
            faq.tags.some(tag => tag.includes(lowerCaseSearch));
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'getting-started':
                return (
                    <div className="help-content">
                        <h2>Getting Started with Green Dining Admin</h2>
                        <p>Welcome to the Green Dining Admin Dashboard! This guide will help you get familiar with the main features.</p>

                        <div className="help-section">
                            <h3>Dashboard Overview</h3>
                            <p>The dashboard provides a quick overview of your store's performance, including:</p>
                            <ul>
                                <li>Total revenue and orders</li>
                                <li>Recent sales and trends</li>
                                <li>Low stock alerts</li>
                                <li>Customer insights</li>
                            </ul>
                        </div>

                        <div className="help-section">
                            <h3>Managing Products</h3>
                            <p>The Products Management page allows you to:</p>
                            <ul>
                                <li>View all products in your inventory</li>
                                <li>Add new products</li>
                                <li>Edit existing products</li>
                                <li>Delete products</li>
                                <li>Monitor stock levels</li>
                            </ul>
                        </div>

                        <div className="help-section">
                            <h3>Managing Orders</h3>
                            <p>The Orders Management page allows you to:</p>
                            <ul>
                                <li>View all customer orders</li>
                                <li>Update order status</li>
                                <li>View order details and items</li>
                                <li>Generate invoices</li>
                            </ul>
                        </div>

                        <div className="help-section">
                            <h3>Customer Management</h3>
                            <p>The Customers Management page allows you to:</p>
                            <ul>
                                <li>View all customer accounts</li>
                                <li>Add new customers</li>
                                <li>Edit customer information</li>
                                <li>View customer purchase history</li>
                            </ul>
                        </div>
                    </div>
                );
            case 'faqs':
                return (
                    <div className="help-content">
                        <h2>Frequently Asked Questions</h2>
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {filteredFaqs.length === 0 ? (
                            <div className="no-results">
                                <p>No FAQs found matching your search. Try different keywords or check the Getting Started guide.</p>
                            </div>
                        ) : (
                            <div className="faq-list">
                                {filteredFaqs.map((faq, index) => (
                                    <div className="faq-item" key={index}>
                                        <div className="faq-question">
                                            <FaQuestionCircle className="question-icon" />
                                            <h3>{faq.question}</h3>
                                        </div>
                                        <p className="faq-answer">{faq.answer}</p>
                                        <div className="faq-tags">
                                            {faq.tags.map((tag, i) => (
                                                <span className="tag" key={i}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'contact':
                return (
                    <div className="help-content">
                        <h2>Contact Support</h2>
                        <p>Need additional help? Our support team is here to assist you.</p>

                        <div className="contact-options">
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <FaEnvelope />
                                </div>
                                <h3>Email Support</h3>
                                <p>For non-urgent issues and general inquiries</p>
                                <a href="mailto:support@greendining.com" className="contact-link">support@greendining.com</a>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <FaInfoCircle />
                                </div>
                                <h3>Knowledge Base</h3>
                                <p>Browse our extensive documentation</p>
                                <a href="#" className="contact-link">Visit Knowledge Base</a>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <FaVideo />
                                </div>
                                <h3>Video Tutorials</h3>
                                <p>Learn through our step-by-step video guides</p>
                                <a href="#" className="contact-link">Watch Tutorials</a>
                            </div>
                        </div>

                        <div className="support-hours">
                            <h3>Support Hours</h3>
                            <p>Monday to Friday: 9am - 6pm GMT</p>
                            <p>Weekend: 10am - 4pm GMT</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <div className="help-page">
                <header className="help-header">
                    <h1>Help Center</h1>
                    <p>Find guides, tutorials, and answers to your questions</p>
                </header>

                <div className="help-container">
                    <aside className="help-sidebar">
                        <button
                            className={`help-tab ${activeTab === 'getting-started' ? 'active' : ''}`}
                            onClick={() => setActiveTab('getting-started')}
                        >
                            <FaBook />
                            <span>Getting Started</span>
                        </button>
                        <button
                            className={`help-tab ${activeTab === 'faqs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('faqs')}
                        >
                            <FaQuestionCircle />
                            <span>FAQs</span>
                        </button>
                        <button
                            className={`help-tab ${activeTab === 'contact' ? 'active' : ''}`}
                            onClick={() => setActiveTab('contact')}
                        >
                            <FaEnvelope />
                            <span>Contact Support</span>
                        </button>
                    </aside>

                    <main className="help-main">
                        {renderTabContent()}
                    </main>
                </div>
            </div>
        </AdminLayout>
    );
};

export default HelpPage; 