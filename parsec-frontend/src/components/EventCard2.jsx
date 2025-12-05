import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EventCard2.css';
import Button from './Button';
import './LeatherSpan.css';

function EventCard2({ 
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
      {/* Sparkle effects */}
      <div className="sparkle"></div>
      <div className="sparkle"></div>
      <div className="sparkle"></div>
      <div className="sparkle"></div>

      {/* Corner decorations
      <div className="corner-decoration corner-top-left"></div>
      <div className="corner-decoration corner-top-right"></div>
      <div className="corner-decoration corner-bottom-left"></div>
      <div className="corner-decoration corner-bottom-right"></div> */}

      <div 
        className="event-card-image" 
        style={bgStyle}
      >
        <span className=" leather-span">{category}</span>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-date">{date}</p>
        
        {/* Decorative divider */}
        <div className="decorative-divider">
          <div className="divider-line"></div>
          <div className="divider-dot"></div>
          <div className="divider-line"></div>
        </div>
        
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

export default EventCard2;
