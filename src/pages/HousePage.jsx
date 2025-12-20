import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../config/api';
import ComingSoon from '../components/ComingSoon';
import './HousePage.css';

/**
 * HOUSE-SPECIFIC PAGE COMPONENT
 * 
 * Displays the house common room / dashboard for a specific house.
 * Your friend can replace the ComingSoon component with actual house content.
 * 
 * Routes:
 * - /house/gryffindor
 * - /house/slytherin
 * - /house/ravenclaw
 * - /house/hufflepuff
 */

const HousePage = () => {
  const { houseName } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // House info mapping
  const houseInfo = {
    gryffindor: {
      name: 'Gryffindor',
      emoji: '🦁',
      colors: { primary: '#740001', secondary: '#D3A625' },
      traits: 'Courage, Bravery, Determination',
      founder: 'Godric Gryffindor'
    },
    slytherin: {
      name: 'Slytherin',
      emoji: '🐍',
      colors: { primary: '#1A472A', secondary: '#5D5D5D' },
      traits: 'Ambition, Cunning, Leadership',
      founder: 'Salazar Slytherin'
    },
    ravenclaw: {
      name: 'Ravenclaw',
      emoji: '🦅',
      colors: { primary: '#0E1A40', secondary: '#946B2D' },
      traits: 'Intelligence, Wisdom, Creativity',
      founder: 'Rowena Ravenclaw'
    },
    hufflepuff: {
      name: 'Hufflepuff',
      emoji: '🦡',
      colors: { primary: '#FFD800', secondary: '#000000' },
      traits: 'Loyalty, Hard Work, Patience',
      founder: 'Helga Hufflepuff'
    }
  };

  const currentHouse = houseInfo[houseName?.toLowerCase()] || null;

  // Verify user's house matches the page they're trying to access
  useEffect(() => {
    const verifyHouse = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user's assigned house from backend
        const { response, data } = await authenticatedFetch(
          API_ENDPOINTS.SORTING_HAT_MY_HOUSE,
          { method: 'GET' },
          token
        );

        if (response.ok && data.data?.house) {
          const assignedHouse = data.data.house.name.toLowerCase();

          // Redirect if user is trying to access wrong house page
          if (assignedHouse !== houseName?.toLowerCase()) {
            navigate(`/house/${assignedHouse}`);
          }
        } else {
          // User hasn't been sorted yet
          navigate('/signup/sorting');
        }
      } catch (err) {
        console.error('Error verifying house:', err);
        setError('Failed to verify your house. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyHouse();
  }, [houseName, token, navigate]);

  if (loading) {
    return (
      <div className="house-page-loading">
        <div className="loading-spinner">Loading your common room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="house-page-error">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }

  if (!currentHouse) {
    return (
      <div className="house-page-error">
        <h2>🏰 House Not Found</h2>
        <p>The house "{houseName}" does not exist.</p>
        <button onClick={() => navigate('/dashboard/events')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div 
      className={`house-page ${houseName?.toLowerCase()}`}
      style={{
        '--house-primary': currentHouse.colors.primary,
        '--house-secondary': currentHouse.colors.secondary
      }}
    >
      {/* Header with house info */}
      <div className="house-header">
        <div className="house-emoji">{currentHouse.emoji}</div>
        <h1 className="house-title">Welcome to {currentHouse.name}</h1>
        <p className="house-traits">{currentHouse.traits}</p>
        <p className="house-founder">Founded by {currentHouse.founder}</p>
      </div>

      {/* Main content area - Your friend will replace this */}
      <div className="house-content">
        <ComingSoon />
        {/* 
          TODO: Replace ComingSoon with actual house content:
          - House leaderboard
          - House events
          - House members
          - House points tracker
          - House-specific announcements
          - etc.
        */}
      </div>

      {/* Quick navigation */}
      <div className="house-nav">
        <button onClick={() => navigate('/dashboard/events')}>Dashboard</button>
        <button onClick={() => navigate('/dashboard/events')}>Events</button>
        <button onClick={() => navigate('/dashboard/leaderboard')}>Leaderboard</button>
        <button onClick={() => navigate('/dashboard/profile')}>Profile</button>
      </div>
    </div>
  );
};

export default HousePage;
