import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Particles from '../components/Particles';
import AccommodationSection from '../components/landing/AccommodationSection';
import { useTheme } from '../context/ThemeContext';
import './AccommodationHome.css';

/**
 * Public Accommodation Page
 * Displays all event pass options and accommodation details
 */
function Accommodation() {
  const { theme } = useTheme();

  return (
    <div className="home-accommodation-page">
      <Navbar />
      
      {/* Magical Particles Background */}
      <div className="particles-background">
        <Particles
          particleColors={[
            theme.fontMain || "#ffffff",
            theme.fontMain || "#ffffff",
          ]}
          particleCount={800}
          particleSpread={15}
          speed={0.15}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Accommodation Section (no separate hero) */}
      <AccommodationSection />

      <Footer />
    </div>
  );
}

export default Accommodation;
