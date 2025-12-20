import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, authenticatedFetch } from "../../config/api";
import "./SortingHat.css";

/**
 * SORTING HAT CEREMONY COMPONENT
 * 
 * This component creates a magical sorting ceremony experience:
 * 1. Shows animated sorting hat
 * 2. Calls backend API to assign user to a house
 * 3. Reveals house assignment with dramatic animation
 * 4. Redirects to dashboard with house theme applied
 */

const SortingHat = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  // State management
  const [stage, setStage] = useState('initial'); // initial -> sorting -> revealing -> complete
  const [assignedHouse, setAssignedHouse] = useState(null);
  const [houseData, setHouseData] = useState(null);
  const [error, setError] = useState(null);

  // House emoji mapping - using actual house images
  const houseImages = {
    'Gryffindor': '/houses/gryffindor.png',
    'Hufflepuff': '/houses/hufflepuff.png',
    'Ravenclaw': '/houses/ravenclaw.png',
    'Slytherin': '/houses/slytherin.png'
  };

  // House colors for the reveal
  const houseColors = {
    'Gryffindor': { primary: '#740001', secondary: '#D3A625', glow: '#ff6b35' },
    'Hufflepuff': { primary: '#FFD800', secondary: '#000000', glow: '#ffd700' },
    'Ravenclaw': { primary: '#0E1A40', secondary: '#946B2D', glow: '#4a9eff' },
    'Slytherin': { primary: '#1A472A', secondary: '#5D5D5D', glow: '#2ecc71' }
  };

  // Start sorting ceremony automatically
  useEffect(() => {
    if (!token) {
      setError("Authentication required. Please sign in again.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Wait 2 seconds before starting the sorting
    const timer = setTimeout(() => {
      performSorting();
    }, 2000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Call the sorting API to assign user to a house
   */
  const performSorting = async () => {
    setStage('sorting');

    try {
      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.SORTING_HAT_SORT,
        {
          method: 'POST',
        },
        token
      );

      if (!response.ok) {
        // Handle case where user is already sorted
        if (data?.message?.includes('already been sorted')) {
          // Get their existing house
          const houseResponse = await authenticatedFetch(
            API_ENDPOINTS.SORTING_HAT_MY_HOUSE,
            { method: 'GET' },
            token
          );

          if (houseResponse.response.ok) {
            setAssignedHouse(houseResponse.data.data.house.name);
            setHouseData(houseResponse.data.data.house);
            revealHouse(houseResponse.data.data.house.name);
            return;
          }
        }
        throw new Error(data?.message || "Sorting failed. Please try again.");
      }

      // Extract house info from response
      const houseName = data.data.user.house;
      const house = data.data.house;

      setAssignedHouse(houseName);
      setHouseData(house);

      // Wait a moment before revealing
      setTimeout(() => {
        revealHouse(houseName);
      }, 3000);

    } catch (err) {
      console.error("Sorting error:", err);
      setError(err.message || "Something went wrong during sorting");
      setStage('error');
    }
  };

  /**
   * Reveal the assigned house with dramatic effect
   */
  const revealHouse = (houseName) => {
    setStage('revealing');

    // Complete the ceremony and redirect after showing the house
    setTimeout(() => {
      setStage('complete');
      
      // Store house in localStorage for theme application
      localStorage.setItem('user_house', houseName);
      
      // Redirect to house-specific page after 3 seconds
      setTimeout(() => {
        navigate(`/house/${houseName.toLowerCase()}`);
      }, 3000);
    }, 2000);
  };

  // Error state
  if (stage === 'error') {
    return (
      <div className="sorting-container error-state">
        <div className="sorting-card">
          <h1 className="error-title">⚠️ Sorting Failed</h1>
          <p className="error-text">{error}</p>
          <button 
            className="retry-button"
            onClick={() => navigate('/dashboard/events')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sorting-container">
      {/* Magical background effects */}
      <div className="sorting-orb-1"></div>
      <div className="sorting-orb-2"></div>
      <div className="sorting-stars">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="sorting-star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`
          }}></div>
        ))}
      </div>

      <div className="sorting-card">
        {/* Initial Stage */}
        {stage === 'initial' && (
          <div className="sorting-stage initial-stage">
            <h1 className="sorting-title">
              🎩 The Sorting Hat Awaits...
            </h1>
            <p className="sorting-subtitle">
              Prepare to discover your Hogwarts house
            </p>
            <div className="hat-container">
              <div className="sorting-hat-icon">🎩</div>
            </div>
          </div>
        )}

        {/* Sorting Stage */}
        {stage === 'sorting' && (
          <div className="sorting-stage sorting-active">
            <h1 className="sorting-title">
              🎩 Hmm... Interesting...
            </h1>
            <p className="sorting-subtitle">
              The Sorting Hat is reading your qualities...
            </p>
            <div className="hat-container pulsing">
              <div className="sorting-hat-icon spinning">🎩</div>
            </div>
            <div className="sorting-messages">
              <p className="sorting-thought">Brave? Ambitious? Wise? Loyal?</p>
              <p className="sorting-thought delay-1">Let me see...</p>
              <p className="sorting-thought delay-2">Ah yes, I know just the place!</p>
            </div>
          </div>
        )}

        {/* Revealing Stage */}
        {(stage === 'revealing' || stage === 'complete') && assignedHouse && (
          <div 
            className={`sorting-stage reveal-stage ${stage === 'complete' ? 'complete' : ''}`}
            style={{
              '--house-color': houseColors[assignedHouse]?.primary || '#FFD700',
              '--house-secondary': houseColors[assignedHouse]?.secondary || '#B8860B',
              '--house-glow': houseColors[assignedHouse]?.glow || '#FFD700'
            }}
          >
            <h1 className="reveal-announcement">
              YOU BELONG IN...
            </h1>
            <div className="house-reveal-container">
              <div className="house-crest-wrapper">
                <img 
                  src={houseImages[assignedHouse]} 
                  alt={assignedHouse}
                  className="house-crest"
                />
                <div className="crest-glow"></div>
              </div>
              <div className="house-name-banner">
                {assignedHouse.toUpperCase()}
              </div>
            </div>
            {houseData && (
              <div className="house-info-grid">
                <div className="info-item">
                  <div className="info-icon">👥</div>
                  <div className="info-value">{houseData.count}</div>
                  <div className="info-label">students in your house</div>
                </div>
                <div className="info-item">
                  <div className="info-icon">⭐</div>
                  <div className="info-value">{houseData.points}</div>
                  <div className="info-label">house points</div>
                </div>
              </div>
            )}
            <p className="redirect-message">
              ✨ Entering your house common room...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingHat;
