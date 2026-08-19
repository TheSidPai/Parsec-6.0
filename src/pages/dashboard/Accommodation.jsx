
import React from "react";
import "./Accommodation.css";
import Particles from "../../components/Particles";

function Accommodation() {
  // --- Show closed message only with Particles background ---
  return (
    <div className="accommodation-container" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <Particles className="accommodation-particles" />
      <div className="accommodation-closed-message">
        <h1>Accommodation Bookings Closed</h1>
        <p>Accommodation bookings for Parsec 2026 are now closed.<br/>Thank you for your interest!</p>
      </div>
    </div>
  );
}

export default Accommodation;
