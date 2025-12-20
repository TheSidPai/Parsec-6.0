import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard2 from "../components/EventCard2";
import events from "../assets/data/events.json";
import Particles from "../components/Particles";
import "./Harshtal.css";
import { useTheme } from "../context/ThemeContext";

function Harshtal() {
  const { theme } = useTheme();
  // Filter only cultural events
  const culturalEvents = events.filter(ev => ev.category === "Cultural");

  return (
    <div className="harshtal-page">
      <Navbar />
      <Particles
        particleColors={[
          theme.fontMain || "#ffffff",
          theme.fontMain || "#ffffff",
        ]}
        particleCount={400}
        particleSpread={15}
        speed={0.1}
        particleBaseSize={70}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
      />
      <main className="harshtal-container">
        <div className="harshtal-header-section">
          <h1 className="harshtal-header">
            <span className="harshtal-title-main">Harshtal</span>
            <span className="harshtl-title-sub">Cultural Extravaganza</span>
          </h1>
          <p className="harshtal-description">
            Experience the magic of culture and creativity 
          </p>
        </div>

        <div className="events-grid">
          {culturalEvents.map((ev) => (
            <EventCard2
              key={ev.id}
              id={ev.id}
              title={ev.title}
              category={ev.category}
              date={ev.date}
              image={ev.image}
              description={ev.description}
              isAuthenticated={false}
            />
          ))}
        </div>

        {culturalEvents.length === 0 && (
          <div className="no-events">
            <p>✨ Cultural events coming soon! Stay tuned...</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Harshtal;
