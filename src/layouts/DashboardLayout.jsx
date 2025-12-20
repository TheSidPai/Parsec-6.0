import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';
import HouseSwitcher from '../components/HouseSwitcher';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';
import { applyTheme } from '../assets/themes';

function DashboardLayout() {
  const navigate = useNavigate();
  const [userHouse, setUserHouse] = useState(null);
  const [houseName, setHouseName] = useState('');
  const [isLoadingHouse, setIsLoadingHouse] = useState(true);

  // Fetch user's house on mount
  useEffect(() => {
    const fetchUserHouse = async () => {
      try {
        console.log('🏠 Fetching user house...');
        const token = localStorage.getItem('jwt_token');
        
        if (!token) {
          console.error('❌ No JWT token found');
          setIsLoadingHouse(false);
          return;
        }

        console.log('🔑 Token found, calling API...');
        const response = await fetch(buildApiUrl(API_ENDPOINTS.SORTING_HAT_MY_HOUSE), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📥 API Response Status:', response.status);
        const data = await response.json();
        console.log('📦 API Response Data:', data);

        if (data.status === 'success' && data.data?.house) {
          // Handle both object and string house formats
          const house = typeof data.data.house === 'string' 
            ? data.data.house.toLowerCase() 
            : data.data.house.name?.toLowerCase();
          
          const name = typeof data.data.house === 'string'
            ? data.data.house
            : data.data.house.name;
          
          console.log('✅ User house:', house, name);
          setUserHouse(house);
          setHouseName(name);
          
          // Apply house theme colors
          applyTheme(house);
          console.log('🎨 Applied', house, 'theme colors');
        } else {
          console.warn('⚠️ No house found in response:', data);
          // Apply default Hogwarts theme if no house
          applyTheme('hogwarts');
        }
      } catch (error) {
        console.error('❌ Failed to fetch user house:', error);
        // Apply default Hogwarts theme on error
        applyTheme('hogwarts');
      } finally {
        setIsLoadingHouse(false);
      }
    };

    fetchUserHouse();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  // House emoji mapping
  /* const getHouseEmoji = (house) => {
    const emojis = {
      'gryffindor': '🦁',
      'slytherin': '🐍',
      'ravenclaw': '🦅',
      'hufflepuff': '🦡'
    };
    return emojis[house] || '🏰';
  }; */

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <nav className="dashboard-sidebar">
        <h3>Dashboard</h3>
        <HouseSwitcher />
        <ul className="dashboard-nav">
          <li><Link className="dashboard-link" to="/dashboard">🏠 Home</Link></li>
          {isLoadingHouse ? (
            <li>
              <span className="dashboard-link" style={{opacity: 0.5, cursor: 'wait'}}>
                ⏳ Loading house...
              </span>
            </li>
          ) : userHouse ? (
            <li>
              <Link className="dashboard-link house-link" to={`/house/${userHouse}`}>
                <img 
                  src={`/houses/${userHouse}.png`}
                  alt={houseName}
                  className="house-crest-icon"
                />
                <span>My House ({houseName})</span>
              </Link>
            </li>
          ) : (
            <li>
              <Link className="dashboard-link" to="/signup/sorting">
                🏰 My House
              </Link>
            </li>
          )}
          <li><Link className="dashboard-link" to="/dashboard/events">🎪 Events</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/schedule">📅 Schedule</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/tickets">🎟️ Tickets</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/profile">👤 Profile</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/leaderboard">🏆 Leaderboard</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/team">👥 Team</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/contact">📞 Contact</Link></li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;