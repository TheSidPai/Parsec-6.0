import React, { useState, useEffect, useRef } from "react";
import "./CountdownTimer.css";

const FlipCard = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // Only flip if the value has actually changed
    if (prevValueRef.current !== value) {
      setIsFlipping(true);

      // Wait for flip animation to reach halfway point, then update value
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
        prevValueRef.current = value;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [value]);

  const formattedValue = String(displayValue).padStart(2, "0");

  return (
    <div className="flip-card-wrapper">
      <div className={`flip-card ${isFlipping ? "flipping" : ""}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <span className="flip-number">{formattedValue}</span>
          </div>
          <div className="flip-card-back">
            <span className="flip-number">{formattedValue}</span>
          </div>
        </div>
      </div>
      <div className="flip-label">{label}</div>
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference > 0) {
        const newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };

        setTimeLeft(newTimeLeft);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="magical-countdown-section">
      <div className="countdown-header">
        <div className="wand-divider left"></div>
        <h2 className="countdown-magical-title">The Magic Begins In</h2>
        <div className="wand-divider right"></div>
      </div>

      <div className="golden-snitch-container">
        <svg
          className="golden-snitch"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4e4c1" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#c5a028" />
            </linearGradient>
          </defs>
          {/* Snitch body */}
          <circle cx="50" cy="50" r="12" fill="url(#goldGrad)" />
          {/* Wings */}
          <path
            d="M 38 50 Q 20 40, 15 50 Q 20 60, 38 50 Z"
            fill="url(#goldGrad)"
            opacity="0.7"
            className="wing-left"
          />
          <path
            d="M 62 50 Q 80 40, 85 50 Q 80 60, 62 50 Z"
            fill="url(#goldGrad)"
            opacity="0.7"
            className="wing-right"
          />
        </svg>
      </div>

      <div className="flip-cards-container">
        <FlipCard value={timeLeft.days} label="Days" />
        <div className="time-separator">
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <FlipCard value={timeLeft.hours} label="Hours" />
        <div className="time-separator">
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <FlipCard value={timeLeft.minutes} label="Minutes" />
        <div className="time-separator">
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <FlipCard value={timeLeft.seconds} label="Seconds" />
      </div>

      <div className="stars-decoration">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="magic-star"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            ✦
          </span>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
