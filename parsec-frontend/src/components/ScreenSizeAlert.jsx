import React, { useState, useEffect } from 'react';
import './ScreenSizeAlert.css';

function ScreenSizeAlert() {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Check if screen is mobile/tablet (less than 1024px)
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile) {
      // Show alert after a short delay for better UX
      setTimeout(() => {
        setShowAlert(true);
      }, 800);
    }
  }, []);

  const handleDismiss = () => {
    setShowAlert(false);
  };

  if (!showAlert) return null;

  return (
    <>
      <div className="screen-alert-overlay" onClick={handleDismiss}></div>
      <div className="screen-alert-container">
        <div className="screen-alert-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="laptop-icon"
          >
            <rect
              x="2"
              y="4"
              width="20"
              height="12"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M1 18h22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="10" r="1.5" fill="currentColor" />
          </svg>
        </div>
        
        <h2 className="screen-alert-title">Best Experience Ahead!</h2>
        
        <p className="screen-alert-message">
          For the most magical experience, we recommend viewing PARSEC 6.0 
          on a laptop or larger display. ✨
        </p>
        
        <p className="screen-alert-submessage">
          Immerse yourself in the full wizarding experience with all animations and effects!
        </p>
        
        <button className="screen-alert-button" onClick={handleDismiss}>
          <span>Got it!</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="button-icon"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <button className="screen-alert-close" onClick={handleDismiss} aria-label="Close">
          ×
        </button>
      </div>
    </>
  );
}

export default ScreenSizeAlert;
