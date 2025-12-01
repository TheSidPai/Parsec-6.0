import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './DashboardLayout.css';
import HouseSwitcher from '../components/HouseSwitcher';

function DashboardLayout() {
  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <nav className="dashboard-sidebar">
        <h3>Dashboard</h3>
        <HouseSwitcher />
        <ul className="dashboard-nav">
          <li><Link className="dashboard-link" to="/dashboard">Home</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/events">Events</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/schedule">Schedule</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/tickets">Tickets</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/profile">Profile</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/leaderboard">Leaderboard</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/team">Team</Link></li>
          <li><Link className="dashboard-link" to="/dashboard/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;