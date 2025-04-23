import React from 'react';
import './Hero.css';

function Hero({ onExploreClick }) {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Welcome to Green Dining</h1>
                <p>Fresh. Sustainable. Delicious.</p>
                <button className="hero-btn" onClick={onExploreClick}>
                    Explore Menu
                </button>
            </div>
        </div>
    );
}

export default Hero;
