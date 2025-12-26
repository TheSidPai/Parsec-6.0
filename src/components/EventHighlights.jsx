import React, { useState, useEffect, useRef } from "react";
import "./EventHighlights.css";

/**
 * Static configuration moved outside the component
 * to avoid re-creation on every render.
 */
const stats = [
  { key: "events", target: 30, suffix: "+", label: "Events" },
  { key: "participants", target: 5000, suffix: "+", label: "Participants" },
  {
    key: "prizes",
    target: 2,
    suffix: "L+",
    label: "Prize Pool",
    prefix: "₹",
  },
  { key: "days", target: 5, suffix: "", label: "Days of Magic" },
];

const EventHighlights = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    events: 0,
    participants: 0,
    prizes: 0,
    days: 0,
  });

  const sectionRef = useRef(null);

  /**
   * Intersection Observer effect
   */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, []);

  /**
   * Counter animation effect
   */
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = stats.map((stat) => {
      const increment = stat.target / steps;
      let currentStep = 0;

      return setInterval(() => {
        currentStep++;

        setCounts((prev) => ({
          ...prev,
          [stat.key]: Math.min(
            Math.floor(increment * currentStep),
            stat.target
          ),
        }));
      }, stepDuration);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [isVisible]);

  return (
    <div className="highlights-section" ref={sectionRef}>
      <div className="highlights-container">
        {stats.map((stat) => (
          <div key={stat.key} className="highlight-item">
            <div className="highlight-value">
              {stat.prefix || ""}
              {counts[stat.key]}
              {stat.suffix}
            </div>
            <div className="highlight-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventHighlights;
