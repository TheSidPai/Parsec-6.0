import React from "react";
import GhostCursor from "../components/GhostCursor";
import Button from "../components/Button";

function Landing() {
  return (
    <div>
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
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "6rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "inherit", // You can change this later
              position: "absolute",
              zIndex: 999,
            }}
          >
            PARSEC 6.0
          </h1>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "300",
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
