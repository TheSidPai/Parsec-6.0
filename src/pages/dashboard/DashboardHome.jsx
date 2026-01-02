import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import eventsData from '../../assets/data/events.json';
import Lightning from '../../components/Lightning';
import { gsap } from 'gsap';
import './DashboardHome.css';

function DashboardHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');
  const textRef = useRef(null);
  
  const [showLightning, setShowLightning] = useState(true);
  const [showGlitchText, setShowGlitchText] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Student',
    house: null,
    housePoints: 0,
    rank: 'Coming Soon'
  });

  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  const houseEmojis = {
    gryffindor: '🦁',
    slytherin: '🐍',
    ravenclaw: '🦅',
    hufflepuff: '🦡',
    hogwarts: '🏰'
  };

  const getHouseEmoji = (houseName) => {
    if (!houseName) return '🏰';
    return houseEmojis[houseName.toLowerCase()] || '🏰';
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Hide sidebar and main content during intro
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.querySelector('.dashboard-content-wrapper');
    if (sidebar) sidebar.style.display = 'none';
    if (mainContent) mainContent.style.opacity = '0';

    // Text appears at 1.5s with magical entrance
    setTimeout(() => {
      console.log('✨ Text appearing now!');
      setShowGlitchText(true);
      
      if (textRef.current) {
        console.log('🎬 GSAP animation starting');
        // Magical entrance: scale + glow + shake
        gsap.fromTo(textRef.current,
          { 
            opacity: 0, 
            scale: 0.5,
            filter: 'blur(10px)',
            rotationZ: -15 
          },
          { 
            opacity: 1,
            scale: 1.2,
            filter: 'blur(0px) drop-shadow(0 0 30px currentColor)',
            rotationZ: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
          }
        );
        
        // Hold and pulse slightly
        setTimeout(() => {
          gsap.to(textRef.current, {
            scale: 1.15,
            duration: 0.3,
            yoyo: true,
            repeat: 1
          });
        }, 600);
        
        // Then explode/scatter away after 1s
        setTimeout(() => {
          console.log('💫 Text exploding away');
          gsap.to(textRef.current, { 
            x: -window.innerWidth * 0.6,
            y: -100,
            rotation: -30,
            scale: 0.3,
            opacity: 0,
            filter: 'blur(20px)',
            duration: 1,
            ease: 'power4.in'
          });
        }, 1200);
      }
    }, 1500);

    // Everything ends at 3.7s with smooth reveal
    setTimeout(() => {
      setShowLightning(false);
      setShowGlitchText(false);
      setShowDashboard(true);
      
      if (sidebar) {
        sidebar.style.display = 'block';
        // Sidebar slides in from left
        gsap.fromTo(sidebar, 
          { x: -300, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
      }
      
      // Main content fades in with scale
      if (mainContent) {
        gsap.fromTo(mainContent,
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.2 }
        );
      }
    }, 3700);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.warn('⚠️ DEV MODE: No token - using default data');
        setLoading(false);
        return;
      }

      try {
        const { response, data } = await authenticatedFetch(
          API_ENDPOINTS.SORTING_HAT_MY_HOUSE,
          { method: 'GET' },
          token
        );

        if (response.ok && data.data?.house) {
          const houseName = data.data.house.name;
          setUserData(prev => ({
            ...prev,
            name: data.data.name || 'Student',
            house: houseName.toLowerCase(),
            rank: "Coming Soon"
          }));
        }
      } catch (e) {
        console.error("User fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="loading-skeleton">
          <div className="skeleton-welcome"></div>
          <div className="skeleton-stats">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home" data-house={userData.house}>
      {/* Lightning Animation with Background Image */}
      {showLightning && (
        <div className="intro-animation-overlay">
          <Lightning
            hue={userData.house === 'gryffindor' ? 0 : userData.house === 'slytherin' ? 120 : userData.house === 'ravenclaw' ? 220 : userData.house === 'hufflepuff' ? 50 : 220}
            xOffset={0}
            speed={1.5}
            intensity={1.2}
            size={1}
          />
          {/* Spell Text "Revelio" */}
          {showGlitchText && (
            <div className="spell-text-container">
              <div ref={textRef} className="spell-text classic">
                Revelio
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Content */}
      {showDashboard && (
        <div className="dashboard-content-wrapper">
          {/* House Rank */}
          <div className="quick-info-bar">
            <div className="info-item">
              <span className="info-icon">🏆</span>
              <span className="info-text">House Rank: {userData.rank} / 4</span>
            </div>
          </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-greeting">
          {greeting}, {userData.name}! ✨
        </h1>
        <p className="welcome-subtext">
          Your magical journey continues at Parsec 2026
        </p>

        {userData.house && (
          <div className="house-badge">
            <span className="house-badge-icon">
              {getHouseEmoji(userData.house)}
            </span>
            <span>House {userData.house.charAt(0).toUpperCase() + userData.house.slice(1)}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/dashboard/events')}>
          <span className="stat-icon">🎯</span>
          <div className="stat-value" data-target={eventsData.length}>{eventsData.length}</div>
          <div className="stat-label">Total Events</div>
          <div className="stat-trend positive">↑ Ready to explore</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/dashboard/leaderboard')}>
          <span className="stat-icon">⭐</span>
          <div className="stat-value" data-target={userData.housePoints}>0</div>
          <div className="stat-label">House Points</div>
          <div className="stat-trend positive">↑ Coming soon</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/dashboard/orders')}>
          <span className="stat-icon">🛍️</span>
          <div className="stat-value" data-target={0}>0</div>
          <div className="stat-label">My Orders</div>
          <div className="stat-trend neutral">→ Track purchases</div>
        </div>
      </div>

      {/* Single Column Content */}
      <div className="dashboard-content-section">
        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/dashboard/events')}>
              <span className="action-icon">🎪</span>
              <span>Browse Events</span>
            </button>

            <button className="action-btn" onClick={() => navigate('/dashboard/orders')}>
              <span className="action-icon">🛍️</span>
              <span>My Orders</span>
            </button>

            <button className="action-btn" onClick={() => navigate('/dashboard/leaderboard')}>
              <span className="action-icon">🏆</span>
              <span>Leaderboard</span>
            </button>

            <button className="action-btn" onClick={() => navigate('/dashboard/schedule')}>
              <span className="action-icon">📅</span>
              <span>Schedule</span>
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="upcoming-events">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="event-list">
            {eventsData
              .filter(event => {
                const dateMatch = event.date.match(/([A-Za-z]+)\s+(\d+),\s+(\d{4})/);
                if (dateMatch) {
                  const [, month, day, year] = dateMatch;
                  const eventDate = new Date(`${month} ${day}, ${year}`);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return eventDate >= today || (today - eventDate) / (1000 * 60 * 60 * 24) < 60;
                }
                return true;
              })
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="event-item" onClick={() => navigate(`/events/${event.id}`)}>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>📅 {event.date} • {event.category}</p>
                  </div>
                  <div className="event-badge">VIEW</div>
                </div>
              ))}

            {eventsData.length === 0 && (
              <div className="no-events">
                <p>🔮 More events will appear here as they're announced</p>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;