import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GhostCursor from "../components/GhostCursor.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Particles from "../components/Particles.jsx";
import GalleryCarousel from "../components/GalleryCarousel.jsx";
import AboutSection from "../components/landing/AboutSection.jsx";
import AccommodationSection from "../components/landing/AccommodationSection.jsx";
import ScreenSizeAlert from "../components/ScreenSizeAlert.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import EventHighlights from "../components/EventHighlights.jsx";
import FeaturedEvents from "../components/FeaturedEvents.jsx";
import FAQ from "../components/FAQ.jsx";
import CTASection from "../components/CTASection.jsx";
import "./Home.css";
import { useTheme } from "../context/ThemeContext.jsx";

function Landing() {
  const { theme } = useTheme();

  const [enableGhostCursor, setEnableGhostCursor] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setEnableGhostCursor(window.innerWidth >= 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Event date (YYYY, MM-1, DD, HH, MM, SS)
  const eventDate = new Date(2026, 0, 23, 12, 0, 0);

  return (
    <div>
      <ScreenSizeAlert />
      <Navbar />

      {/* Hero Section */}
      <div style={{ height: "100vh", position: "relative" }}>
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

        {enableGhostCursor && (
          <GhostCursor
            color={theme.fontMain || "#F5F1E6" || "#fffeecff"}
            brightness={0.45}
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
        )}

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
          <p className="landing-motto">
            Techno-Cultural Festival | IIT Dharwad
          </p>
        </div>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer targetDate={eventDate} />

      {/* Event Highlights */}
      <EventHighlights />

      {/* About Section */}
      <AboutSection />

      {/* Featured Events */}
      <FeaturedEvents />

      {/* Gallery */}
      <GalleryCarousel />

      {/* Accommodation Section */}
      <AccommodationSection />

      {/* FAQ */}
      <FAQ />

      {/* Call to Action */}
      <CTASection />

      <Footer />
    </div>
  );
}

export default Landing;
