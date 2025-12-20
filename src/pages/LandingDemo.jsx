import React from "react";
import { motion } from "framer-motion";
import GhostCursor from "../components/GhostCursor";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Particles from '../components/Particles.jsx';
import GalleryCarousel from '../components/GalleryCarousel';
import AboutSection from '../components/landing/AboutSection';
import { useLocomotiveScroll } from "../hooks/useLocomotiveScroll";
import { useScrollTrigger } from "../hooks/useScrollTrigger";
import { useParallax } from "../hooks/useParallax";
import { useScrollProgress } from "../hooks/useScrollProgress";
import "./Landing.css";
import "./LandingDemo.css";
import { useTheme } from "../context/ThemeContext";

function LandingDemo() {
  const { theme } = useTheme();
  
  // Initialize smooth scrolling
  useLocomotiveScroll(true);
  
  // Track scroll progress for progress bar
  const { scrollProgress, scrollDirection } = useScrollProgress();
  
  // Parallax for hero particles
  const { ref: particlesRef, offset: particlesOffset } = useParallax(0.5);
  
  // Scroll triggers for sections
  const aboutTrigger = useScrollTrigger({ threshold: 0.3, triggerOnce: true });
  const galleryTrigger = useScrollTrigger({ threshold: 0.2, triggerOnce: true });

  return (
    <div data-scroll-container>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar">
        <div 
          className="scroll-progress-fill" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />
      
      {/* Hero Section with Parallax */}
      <div 
        className="hero-section" 
        style={{ height: "100vh", position: "relative" }}
        data-scroll-section
      >
        <div 
          ref={particlesRef}
          style={{ transform: `translateY(${particlesOffset * 0.3}px)` }}
        >
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
        </div>

        <GhostCursor
          color={(theme.fontMain || "#F5F1E6" || "#fffeecff")}
          brightness={1}
          edgeIntensity={0.2}
          trailLength={90}
          inertia={0.5}
          grainIntensity={0.05}
          bloomStrength={0.3}
          bloomRadius={1.0}
          bloomThreshold={0.025}
          fadeDelayMs={1000}
          fadeDurationMs={1500}
        />

        <div className="landing-content">
          <motion.h1 
            className="landing-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
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
          </motion.h1>
          <motion.p 
            className="landing-motto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Techno-Cultural Fest
          </motion.p>
        </div>
      </div>

      {/* About Section with Scroll Trigger */}
      <div 
        ref={aboutTrigger.ref}
        data-scroll-section
        className={`section-wrapper ${aboutTrigger.isInView ? 'fade-in-up' : 'fade-out'}`}
      >
        <AboutSection />
      </div>

      {/* Gallery Section with Scroll Trigger */}
      <div 
        ref={galleryTrigger.ref}
        data-scroll-section
        className={`section-wrapper ${galleryTrigger.isInView ? 'fade-in-scale' : 'fade-out'}`}
      >
        <GalleryCarousel />
      </div>

      <Footer />
    </div>
  );
}

export default LandingDemo;
