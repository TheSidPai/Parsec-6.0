import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Navbar from "./Navbar";
import "./ComingSoon.css";

function ComingSoon() {
  return (
    <>
      <Navbar />
      <div className="comingsoon-container">
        <div className="comingsoon-card">
          <h2 className="comingsoon-title">Coming Soon</h2>
          <p className="comingsoon-desc">
            Exciting events are on the way! Stay tuned for updates.
          </p>
          <Link to="/landing">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ComingSoon;
