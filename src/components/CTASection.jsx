import React from "react";
import { Link } from "react-router-dom";
import "./CTASection.css";

const CTASection = () => {
  return (
    <div className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">Ready to Experience the Magic?</h2>
        <p className="cta-subtitle">
          Join thousands of students in India's most enchanting techno-cultural
          festival
        </p>
        <div className="cta-buttons">
          <Link to="/events" className="cta-button primary">
            Register Now
          </Link>
          <Link to="/schedule" className="cta-button secondary">
            View Schedule
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
