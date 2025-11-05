import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <nav style={{ width: '200px', background: '#222', color: '#fff', padding: '20px' }}>
        <h3>Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/dashboard" style={{ color: '#fff' }}>Home</Link></li>
          <li><Link to="/dashboard/events" style={{ color: '#fff' }}>Events</Link></li>
          <li><Link to="/dashboard/schedule" style={{ color: '#fff' }}>Schedule</Link></li>
          <li><Link to="/dashboard/tickets" style={{ color: '#fff' }}>Tickets</Link></li>
          <li><Link to="/dashboard/profile" style={{ color: '#fff' }}>Profile</Link></li>
          <li><Link to="/dashboard/leaderboard" style={{ color: '#fff' }}>Leaderboard</Link></li>
          <li><Link to="/dashboard/team" style={{ color: '#fff' }}>Team</Link></li>
          <li><Link to="/dashboard/contact" style={{ color: '#fff' }}>Contact</Link></li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* Renders the current dashboard page */}
      </main>
    </div>
  );
}

export default DashboardLayout;