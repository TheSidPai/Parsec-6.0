import React from "react";
import GhostCursor from "../components/GhostCursor";
import Navbar from "../components/Navbar";
import "./Landing.css";

function Landing() {
  return (
    <div>
        <Navbar/>

      <div style={{ height: "100vh", position: "relative" }}>
        <GhostCursor
          // Visuals
          color="#B19EEF"
          brightness={1}
          edgeIntensity={0.8}
          // Trail and motion
          trailLength={50}
          inertia={0.5}
          // Post-processing
          grainIntensity={0.05}
          bloomStrength={0.1}
          bloomRadius={1.0}
          bloomThreshold={0.025}
          // Fade-out behavior
          fadeDelayMs={1000}
          fadeDurationMs={1500}
        />
        
        <div className="landing-content">
          <h1 className="landing-title">
            <span>PARSEC </span>
            <span>6.0</span>
          </h1>
          <p className="landing-motto">
            Digital Wizardry
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
