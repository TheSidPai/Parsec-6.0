import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ house = 'gryffindor' }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/dashboard/events', label: 'Events', icon: '🎯' },
    { path: '/dashboard/schedule', label: 'Schedule', icon: '📅' },
    { path: '/dashboard/passes', label: 'Event Passes', icon: '🎟️' },
    { path: '/dashboard/payment-history', label: 'My Orders', icon: '📜' },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤' },
    { path: '/dashboard/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/dashboard/team', label: 'Team', icon: '👥' },
    { path: '/dashboard/contact', label: 'Contact', icon: '📧' },
  ];

  return (
    <aside className={`sidebar sidebar-${house}`}>
      <div className="sidebar-header">
        <h2>PARSEC 6.0</h2>
        <p className="house-name">{house.toUpperCase()}</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;