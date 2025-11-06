import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';
import Button from './Button';

function EventCard({ 
  id, 
  title, 
  category, 
  date, 
  image, 
  description,
  isAuthenticated = false 
}) {
  return (
    <div className="event-card">
      <div 
        className="event-card-image" 
        style={{ backgroundImage: `url(${image})` }}
      >
        <span className="event-category">{category}</span>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-date">{date}</p>
        <p className="event-description">{description}</p>
        
        <div className="event-card-actions">
          <Link to={`/events/${id}`}>
            <Button variant="secondary">View Details</Button>
          </Link>
          
          {isAuthenticated ? (
            <Button variant="primary">Register</Button>
          ) : (
            <Link to="/login">
              <Button variant="primary">Login to Register</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;