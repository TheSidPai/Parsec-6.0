import React from "react";
import { motion } from "framer-motion";
import GhostCursor from "../components/GhostCursor";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Particles from '../components/Particles.jsx';
import GalleryCarousel from '../components/GalleryCarousel';
import AboutSection from '../components/landing/AboutSection';
import "./Landing.css";
import { useTheme } from "../context/ThemeContext";

function Landing() {
  const { theme } = useTheme();
  return (
    <div>
      <Navbar />
      <div style={{ height: "100vh", position: "relative" }}>
        <Particles
          particleColors={[theme.fontMain || "#ffffff", theme.fontMain || "#ffffff"]}
          particleCount={600}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
        <GhostCursor
          // Visuals
          color={(theme.fontMain || "#F5F1E6" || "#fffeecff")}
          brightness={1}
          edgeIntensity={0.2}
          // Trail and motion
          trailLength={90}
          inertia={0.5}
          // Post-processing
          grainIntensity={0.05}
          bloomStrength={0.3}
          bloomRadius={1.0}
          bloomThreshold={0.025}
          // Fade-out behavior
          fadeDelayMs={1000}
          fadeDurationMs={1500}
        />

        <div className="landing-content">
          <h1 className="landing-title">
            <motion.span
              className="shimmer-text"
              animate={{ backgroundPosition: ["150% 0%", "0% 0%"] }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 5,
              }}
            >
              PARSEC
            </motion.span>{" "}
            <motion.span
              className="shimmer-text"
              animate={{ backgroundPosition: ["150% 0%", "0% 0%"] }}
              transition={{
                duration: 1,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 4,
              }}
            >
              6.0
            </motion.span>
          </h1>
          <p className="landing-motto">Techno-Cultural Fest</p>
        </div>
      </div>
      <AboutSection />
      <GalleryCarousel />
      {/* <TeamsCarousel /> */}
      <Footer />
    </div>
  );
}

export default Landing;
