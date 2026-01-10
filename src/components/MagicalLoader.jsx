import React, { useEffect, useState } from "react";
import "./MagicalLoader.css";

const MagicalLoader = ({ onLoadComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            if (onLoadComplete) onLoadComplete();
          }, 800000);
          return 100;
        }
        return prev + 1.5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  if (!isLoading) return null;

  // Generate particles
  const particleCount = 50;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 4,
  }));

  return (
    <div className="magical-loader">
      {/* Subtle particle field */}
      <div className="particle-field">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Circular ornate frame */}
      <div className="ornate-circle">
        <svg viewBox="0 0 200 200" className="circle-decoration">
          {/* Outer ring with segments */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="0.3"
            opacity="0.4"
          />

          {/* Rotating segments */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + Math.cos(angle) * 75;
            const y1 = 100 + Math.sin(angle) * 75;
            const x2 = 100 + Math.cos(angle) * 85;
            const y2 = 100 + Math.sin(angle) * 85;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#goldGradient)"
                strokeWidth="0.5"
                opacity="0.5"
              />
            );
          })}

          {/* Inner rotating ring */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            opacity="0.3"
            strokeDasharray="3 3"
            className="rotating-ring"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="goldGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f4e4c1" stopOpacity="1" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central mystical symbol */}
        <div className="center-symbol">
          <svg viewBox="0 0 100 100" className="deathly-hallows">
            {/* Triangle */}
            <path
              d="M 50 10 L 20 80 L 80 80 Z"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              opacity="0.7"
            />
            {/* Circle */}
            <circle
              cx="50"
              cy="60"
              r="20"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              opacity="0.7"
            />
            {/* Line */}
            <line
              x1="50"
              y1="10"
              x2="50"
              y2="80"
              stroke="#d4af37"
              strokeWidth="1.5"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="loader-content">
        {/* Title */}
        <div className="loading-text">
          <h2 className="magical-title">PARSEC 6.0</h2>
          <div className="title-underline"></div>
        </div>

        {/* Elegant Progress Bar */}
        <div className="progress-container">
        <p className="loading-subtitle">Initializing Experience</p>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <p className="progress-text">{progress}%</p>
        </div>
      </div>

      {/* Subtle corner decorations */}
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="corner-decoration bottom-right"></div>
    </div>
  );
};

export default MagicalLoader;
