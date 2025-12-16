import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventsData from '../../assets/data/events.json';
import './DashboardEvents.css';

function DashboardEvents() {
  const navigate = useNavigate();
  const [highlightedEventId, setHighlightedEventId] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // Filter events that have registration links
  const registrableEvents = eventsData.filter(event => event.registrationLink);

  useEffect(() => {
    // Load registered events from localStorage
    const stored = localStorage.getItem('registered_events');
    if (stored) {
      try {
        setRegisteredEvents(JSON.parse(stored));
      } catch (e) {
        setRegisteredEvents([]);
      }
    }

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
      // Mark as registered
      const updated = [...registeredEvents, event.id];
      setRegisteredEvents(updated);
      localStorage.setItem('registered_events', JSON.stringify(updated));
      
      // Open registration link in new tab
      window.open(event.registrationLink, '_blank', 'noopener,noreferrer');
    }
  };

  const isRegistered = (eventId) => {
    return registeredEvents.includes(eventId);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="dashboard-events-container">
      <div className="dashboard-events-header">
        <h1 className="dashboard-events-title">Event Registration</h1>
        <p className="dashboard-events-subtitle">
          {registeredEvents.length} of {registrableEvents.length} events registered
        </p>
      </div>

      <div className="dashboard-events-grid">
        {registrableEvents.map((event) => (
          <div
            key={event.id}
            id={`event-${event.id}`}
            className={`dashboard-event-card ${highlightedEventId === event.id ? 'highlighted' : ''} ${isRegistered(event.id) ? 'registered' : ''}`}
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
                className={`event-action-button event-action-register ${isRegistered(event.id) ? 'registered' : ''}`}
                onClick={() => handleRegister(event)}
                disabled={isRegistered(event.id)}
              >
                {isRegistered(event.id) ? '✓ Registered' : 'Register Now'}
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