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
  const culturalEvents = events.filter((ev) => ev.category === "Cultural");

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
          <h1 className="harshtal-header">Harshtal</h1>
          <p className="harshtal-description">
            Cultural Extravaganza - Experience the magic of culture and
            creativity<br />
                To check out the Harshtal rulebook, click <a className="overall-schedule" href="https://drive.google.com/file/d/1Sa5UekoZzYOuKyDQGR-OEcmEsCvmV_k5/view?usp=drive_link" target="_blank" rel="noopener noreferrer">HERE</a>.
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
