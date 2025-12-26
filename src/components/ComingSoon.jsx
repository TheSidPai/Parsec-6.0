import React from "react";
import { useLocation } from "react-router-dom";
// import Button from "./Button";
import Navbar from "./Navbar";
import "./ComingSoon.css";

function ComingSoon() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="comingsoon-container">
        <div className="comingsoon-card">
          <h2 className="comingsoon-title">Coming Soon</h2>
          <p className="comingsoon-desc">
            {isDashboard
              ? "This feature is coming soon!"
              : "Exciting events are on the way! Stay tuned for updates."}
          </p>
        </div>
      </div>
    </>
  );
}

export default ComingSoon;
