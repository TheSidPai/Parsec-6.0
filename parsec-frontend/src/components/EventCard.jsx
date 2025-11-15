import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const bgStyle = image && image.trim() !== ''
    ? { backgroundImage: `url(${image})` }
    : { background: 'linear-gradient(135deg, #222 0%, #333 100%)' };
  
  return (
    <div className="event-card">
      <div 
        className="event-card-image" 
        style={bgStyle}
      >
        <span className="event-category">{category}</span>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-date">{date}</p>
        <p className="event-description">{description}</p>
        
        <div className="event-card-actions">
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/events/${id}`)}
          >
            View Details
          </Button>
          
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