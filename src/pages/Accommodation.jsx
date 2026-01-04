import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Particles from '../components/Particles';
import AccommodationSection from '../components/landing/AccommodationSection';
import { useTheme } from '../context/ThemeContext';
import './Accommodation.css';

/**
 * Public Accommodation Page
 * Displays all event pass options and accommodation details
 */
function Accommodation() {
  const { theme } = useTheme();

  return (
    <div className="accommodation-page">
      <Navbar />
      
      {/* Magical Particles Background */}
      <div className="particles-background">
        <Particles
          particleColors={[
            theme.fontMain || "#ffffff",
            theme.fontMain || "#ffffff",
          ]}
          particleCount={600}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={false}
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
