import React from "react";
import GhostCursor from "../components/GhostCursor";
import Navbar from "../components/Navbar";
// import Button from "../components/Button";

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
        
        <div
          style={{
            textAlign: "center",
            color: "black",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "10rem",
              fontWeight: "bold",
              fontFamily: "harryP",
              marginBottom: "1rem",
              zIndex: 900,
              letterSpacing: "0.5rem",
            }}
          >
            PARSEC 6.0
          </h1>
          <p
            style={{
                fontFamily: "Playfair Display, serif",
              fontSize: "4rem",
              fontWeight: "300",
              zIndex: 999,
            }}
          >
            Digital Wizardry
          </p>

        </div>
      </div>
    </div>
  );
}

export default Landing;
