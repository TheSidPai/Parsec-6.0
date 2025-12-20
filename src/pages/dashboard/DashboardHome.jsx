import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import eventsData from '../../assets/data/events.json';
import './DashboardHome.css';

function DashboardHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  const [userData, setUserData] = useState({
    name: 'Student',
    house: null,
    housePoints: 0,
    rank: 'Coming Soon'
  });

  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  // ✅ UPDATED: Daily challenge shows only 1 event
  const [dailyChallenge] = useState({
    title: 'Attend 1 Event Today',
    progress: 0,
    total: 1,
    reward: 20
  });

  const [recentAchievements] = useState([
    { icon: '🎯', title: 'First Event', desc: 'Registered for your first event' },
    { icon: '🏠', title: 'House Pride', desc: 'Joined your house' }
  ]);

  const [activityFeed] = useState([
    { icon: '🎫', text: 'Registered for Aurora 2.0', time: '2 hours ago' },
    { icon: '⭐', text: 'Earned 25 house points', time: '5 hours ago' },
    { icon: '🏆', text: 'Completed daily challenge', time: '1 day ago' }
  ]);

  // House emoji mapping
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
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate('/login');
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
    <div className="dashboard-home">

      {/* ⭐ UPDATED: ONLY HOUSE RANK ON TOP */}
      <div className="quick-info-bar">
        <div className="info-item" style={{ animation: "pulse 1.6s infinite" }}>
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

        <div className="stat-card" onClick={() => navigate('/dashboard/tickets')}>
          <span className="stat-icon">🎫</span>
          <div className="stat-value" data-target={0}>0</div>
          <div className="stat-label">Active Tickets</div>
          <div className="stat-trend neutral">→ No change</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">

        {/* Left Column */}
        <div className="left-column">

          {/* ⭐ Updated Daily Challenge */}
          <div className="daily-challenge-card">
            <div className="challenge-header">
              <h3 className="challenge-title">
                <span className="challenge-icon">🎯</span>
                Daily Challenge
              </h3>
              <span className="challenge-reward">+{dailyChallenge.reward} pts</span>
            </div>
            <p className="challenge-text">{dailyChallenge.title}</p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: "0%" }}
                ></div>
              </div>
              <span className="progress-text">
                {dailyChallenge.progress}/{dailyChallenge.total}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-btn" onClick={() => navigate('/dashboard/events')}>
                <span className="action-icon">🎪</span>
                <span>Browse Events</span>
              </button>

              <button className="action-btn" onClick={() => navigate('/dashboard/profile')}>
                <span className="action-icon">👤</span>
                <span>My Profile</span>
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
                  // Parse dates from the event.date string
                  const dateMatch = event.date.match(/([A-Za-z]+)\s+(\d+),\s+(\d{4})/);
                  if (dateMatch) {
                    const [, month, day, year] = dateMatch;
                    const eventDate = new Date(`${month} ${day}, ${year}`);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    // Show events that haven't ended yet (within 60 days)
                    return eventDate >= today || (today - eventDate) / (1000 * 60 * 60 * 24) < 60;
                  }
                  return true; // Show events without parseable dates
                })
                .slice(0, 3)
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

        {/* Right Column */}
        <div className="right-column">

          {/* Recent Achievements */}
          <div className="achievements-card">
            <h3 className="card-title">
              <span>🏅</span>
              Recent Achievements
            </h3>
            <div className="achievements-list">
              {recentAchievements.map((a, i) => (
                <div key={i} className="achievement-item">
                  <span className="achievement-icon">{a.icon}</span>
                  <div className="achievement-info">
                    <h4>{a.title}</h4>
                    <p>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn" onClick={() => navigate('/dashboard/achievements')}>
              View All Achievements →
            </button>
          </div>

          {/* Activity Feed */}
          <div className="activity-feed-card">
            <h3 className="card-title">
              <span>📊</span>
              Recent Activity
            </h3>
            <div className="activity-list">
              {activityFeed.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-info">
                    <p className="activity-text">{activity.text}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
