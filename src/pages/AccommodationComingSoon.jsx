import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Particles from "../components/Particles";
import { useTheme } from "../context/ThemeContext";
import "../components/ComingSoon.css";

/**
 * Temporary page shown while Accommodation is under development.
 */
function AccommodationComingSoon() {
  const { theme } = useTheme();

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <Particles
          particleColors={[
            theme.fontMain || "#ffffff",
            theme.fontMain || "#ffffff",
          ]}
          particleCount={300}
          particleSpread={12}
          speed={0.1}
          particleBaseSize={60}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <Navbar />
      <div
        className="comingsoon-container"
        style={{ background: "transparent" }}
      >
        <div className="comingsoon-card">
          <h2 className="comingsoon-title">Accommodation</h2>
          <p className="comingsoon-desc">
            We're preparing cozy quarters for our guests! 🏨
            <br />
            Accommodation details will be available soon.
          </p>
          <p
            className="comingsoon-desc"
            style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: "0.5rem" }}
          >
            Booking starts on 9:00 AM, 7th January 2026!
          </p>
          <Link to="/landing">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default AccommodationComingSoon;
