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
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/schedule">Schedule</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li>
            <Link to="/signup/onboarding">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;