import React from 'react';
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import events from "../assets/data/events.json";
import './Events.css';

function Events() {
  return (
    <div>
      <Navbar />
      <main className="events-container">
        <h1 className="events-header">Events</h1>
        <p className="events-description">Explore hackathons, competitions, and workshops at PARSEC 6.0.</p>

        <div className="events-grid">
          {events.map((ev) => (
            <EventCard
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
    </div>
  );
}

export default Events;