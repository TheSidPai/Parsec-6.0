import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventsData from '../../assets/data/events.json';
import './DashboardEvents.css';
import Particles from '../../components/Particles';

function DashboardEvents() {
  const navigate = useNavigate();
  const [highlightedEventId, setHighlightedEventId] = useState(null);

  // Filter events that have registration links
  const registrableEvents = eventsData.filter(event => event.registrationLink);

  useEffect(() => {
    // Check if user came here to register for a specific event
    const pendingEventId = localStorage.getItem('pendingEventRegistration');
    
    if (pendingEventId) {
      setHighlightedEventId(pendingEventId);
      
      // Scroll to the event card
      setTimeout(() => {
        const eventCard = document.getElementById(`event-${pendingEventId}`);
        if (eventCard) {
          eventCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Clear the pending registration after showing
      localStorage.removeItem('pendingEventRegistration');
    }
  }, []);

  const handleRegister = (event) => {
    if (event.registrationLink) {
      // Open registration link in new tab
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="dashboard-events-container">
      {/* Particles Background */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
              <Particles
                particleColors={["#ffffff", "#ffffff"]}
                particleCount={600}
                particleSpread={15}
                speed={0.1}
                particleBaseSize={80}
                moveParticlesOnHover={false}
                alphaParticles={false}
                disableRotation={false}
              />
            </div>
      <div className="dashboard-events-header">
        <h1 className="page-title">Event Registration</h1>
        <p className="dashboard-events-subtitle">
          Explore {registrableEvents.length} exciting events at PARSEC 6.0
        </p>
      </div>

      <div className="dashboard-events-grid">
        {registrableEvents.map((event) => (
          <div
            key={event.id}
            id={`event-${event.id}`}
            className={`dashboard-event-card ${highlightedEventId === event.id ? 'highlighted' : ''}`}
          >
            <span className="event-card-badge">{event.category}</span>
            
            <h2 className="event-card-title">{event.title}</h2>

            <p className="event-card-description">{event.description}</p>

            <div className="event-card-info">
              <div className="event-info-item">
                <span className="event-info-icon">📅</span>
                <span>{event.date}</span>
              </div>
              
              <div className="event-info-item">
                <span className="event-info-icon">📍</span>
                <span>{event.venue || 'IIT Dharwad'}</span>
              </div>
            </div>

            <div className="event-card-actions">
              <button
                className="event-action-button event-action-details"
                onClick={() => handleViewDetails(event.id)}
              >
                View Details
              </button>
              <button
                className="event-action-button event-action-register"
                onClick={() => handleRegister(event)}
              >
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {registrableEvents.length === 0 && (
        <div className="dashboard-no-events">
          <p>No events available for registration at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default DashboardEvents;