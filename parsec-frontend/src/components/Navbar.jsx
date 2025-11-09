import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Button from './Button';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/landing" className="navbar-logo">
          Parsec 6.0
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/events" className="navbar-link">Events</Link>
          </li>
          <li className="navbar-item">
            <Link to="/schedule" className="navbar-link">Schedule</Link>
          </li>
          <li className="navbar-item">
            <Link to="/landing" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/signup/onboarding" className="navbar-signup">
              <Button variant="primary">Login/signup</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;