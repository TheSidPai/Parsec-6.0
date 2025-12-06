import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ComingSoon from "../components/ComingSoon.jsx";
import Particles from "../components/Particles";
import { useTheme } from "../context/ThemeContext";
import ElectricBorder from "../components/ElectricBorder";

function Schedule() {
  const { theme } = useTheme();
  return (
    <div>
      <Navbar />
      <Particles
        particleColors={[
          theme.fontMain || "#ffffff",
          theme.fontMain || "#ffffff",
        ]}
        particleCount={400}
        particleSpread={15}
        speed={0.1}
        particleBaseSize={70}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
      />

      {/* <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        
      </ElectricBorder> */}
      <ComingSoon />
      <Footer />
    </div>
  );
}

export default Schedule;
