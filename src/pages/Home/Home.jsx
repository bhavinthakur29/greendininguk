import React from 'react';
import './Home.css';
import HeroSection from '../../components/HeroSection/HeroSection';
import AboutSection from '../../components/AboutSection/AboutSection';
import AimSection from '../../components/AimSection/AimSection';

const Home = () => {
    return (
        <div className="home">
            <HeroSection />
            <AboutSection />
            <AimSection />
        </div>
    );
};

export default Home; 