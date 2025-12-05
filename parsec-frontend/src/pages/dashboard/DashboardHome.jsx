import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import './DashboardHome.css';

function DashboardHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');
  
  const [userData, setUserData] = useState({
    name: 'Student',
    house: null,
    eventsRegistered: 0,
    housePoints: 0,
    tickets: 0,
    streak: 0,
    rank: '-'
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [dailyChallenge] = useState({
    title: 'Attend 3 Events',
    progress: 1,
    total: 3,
    reward: 50
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
    'gryffindor': '🦁',
    'slytherin': '🐍',
    'ravenclaw': '🦅',
    'hufflepuff': '🦡',
    'hogwarts': '🏰'
  };

  // Get house emoji with fallback
  const getHouseEmoji = (houseName) => {
    if (!houseName) {
      console.log('⚠️ No house name provided');
      return '🏰';
    }
    const normalizedHouse = houseName.toLowerCase().trim();
    const emoji = houseEmojis[normalizedHouse] || '🏰';
    console.log(`🎨 Getting emoji for "${normalizedHouse}": ${emoji}`);
    return emoji;
  };

  // Get formatted house name
  const getHouseName = (houseName) => {
    if (!houseName) return 'Hogwarts';
    const normalizedHouse = houseName.toLowerCase().trim();
    return normalizedHouse.charAt(0).toUpperCase() + normalizedHouse.slice(1);
  };

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fetch user data and house
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user's house
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
            streak: Math.floor(Math.random() * 15) + 1, // Simulate streak
            rank: Math.floor(Math.random() * 100) + 1 // Simulate rank
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  // Animated counter effect
  useEffect(() => {
    if (!loading) {
      const counters = document.querySelectorAll('.stat-value');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 16);
      });
    }
  }, [loading]);

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
      {/* Quick Info Bar */}
      <div className="quick-info-bar">
        <div className="info-item">
          <span className="info-icon">🔥</span>
          <span className="info-text">{userData.streak} Day Streak</span>
        </div>
        <div className="info-item">
          <span className="info-icon">📊</span>
          <span className="info-text">Rank #{userData.rank}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🎯</span>
          <span className="info-text">Level {Math.floor(userData.housePoints / 100) + 1}</span>
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
          <div className="stat-value" data-target={userData.eventsRegistered}>0</div>
          <div className="stat-label">Events Registered</div>
          <div className="stat-trend positive">↑ 2 this week</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/dashboard/leaderboard')}>
          <span className="stat-icon">⭐</span>
          <div className="stat-value" data-target={userData.housePoints}>0</div>
          <div className="stat-label">House Points</div>
          <div className="stat-trend positive">↑ 15%</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/dashboard/tickets')}>
          <span className="stat-icon">🎫</span>
          <div className="stat-value" data-target={userData.tickets}>0</div>
          <div className="stat-label">Active Tickets</div>
          <div className="stat-trend neutral">→ No change</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Daily Challenge */}
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
                  style={{ width: `${(dailyChallenge.progress / dailyChallenge.total) * 100}%` }}
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
              <button 
                className="action-btn"
                onClick={() => navigate('/dashboard/events')}
              >
                <span className="action-icon">🎪</span>
                <span>Browse Events</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigate('/dashboard/profile')}
              >
                <span className="action-icon">👤</span>
                <span>My Profile</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigate('/dashboard/leaderboard')}
              >
                <span className="action-icon">🏆</span>
                <span>Leaderboard</span>
              </button>

              <button 
                className="action-btn"
                onClick={() => navigate('/dashboard/schedule')}
              >
                <span className="action-icon">📅</span>
                <span>Schedule</span>
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="upcoming-events">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="event-list">
              <div className="event-item" onClick={() => navigate('/dashboard/events/aurora-2')}>
                <div className="event-info">
                  <h3>Aurora 2.0: Beyond the Horizon</h3>
                  <p>📅 Dec 22, 2025 – Jan 26, 2026 • Hackathon</p>
                </div>
                <div className="event-badge">VIEW</div>
              </div>

              <div className="no-events">
                <p>🔮 More events will appear here as they're announced</p>
              </div>
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
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.desc}</p>
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