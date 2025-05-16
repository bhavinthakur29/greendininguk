import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './BackToTop.css';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <button
            className={`back-to-top ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
        >
            <FaArrowUp />
        </button>
    );
};

export default BackToTop; 