import React from 'react';
import './AdminFooter.css';

const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="admin-footer">
            <div className="admin-footer-content">
                <p>
                    &copy; {currentYear} Green Dining Admin Panel. All rights reserved.
                </p>
                <p className="admin-credits">
                    Developed with 💚 by <a href="https://linkedin.com/in/bhavinthakur" target='_blank'><strong>Bhavin Thakur</strong></a>
                </p>
            </div>
        </footer>
    );
};

export default AdminFooter; 