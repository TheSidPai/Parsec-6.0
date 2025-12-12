import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard2 from "../components/EventCard2";
import events from "../assets/data/events.json";
import Particles from "../components/Particles";
import "./Events.css";
import { useTheme } from "../context/ThemeContext";

function Events() {
  const { theme } = useTheme();
  return (
    <div>
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
      <main className="events-container">
        <h1 className="events-header">Events</h1>
        <p className="events-description">
          Explore hackathons, competitions, and workshops at PARSEC 6.0.
        </p>

        <div className="events-grid">
          {events.map((ev) => (
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
      </main>

      <Footer />
    </div>
  );
}

export default Events;
