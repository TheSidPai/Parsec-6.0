import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ComingSoon from '../components/ComingSoon.jsx';
import Particles from '../components/Particles';

function Schedule() {
  return <div>
    <Navbar />
    <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={400}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={70}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
    <ComingSoon />
    <Footer />
  </div>;
}

export default Schedule;