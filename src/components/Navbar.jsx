import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Button from './Button';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setEventsDropdownOpen(false);
  };

  const toggleEventsDropdown = () => {
    setEventsDropdownOpen(!eventsDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/landing" className="navbar-logo" onClick={closeMenu}>
          <img src={require('../assets/images/parsec-logo-white.webp')} alt="PARSEC 6.0" className="navbar-logo-img" />
        </Link>

        {/* Hamburger Icon */}
        <button 
          className={`navbar-hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu */}
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item navbar-dropdown">
            <button 
              className="navbar-link navbar-dropdown-toggle" 
              onClick={toggleEventsDropdown}
            >
              Events ▼
            </button>
            <ul className={`navbar-dropdown-menu ${eventsDropdownOpen ? 'active' : ''}`}>
              <li>
                <Link to="/events" className="navbar-dropdown-link" onClick={closeMenu}>
                  <span className="dropdown-icon">⚡</span>
                  <span className="dropdown-text">
                    <strong>PARSEC</strong>
                    <small>Technical Events</small>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/harshtal" className="navbar-dropdown-link" onClick={closeMenu}>
                  <span className="dropdown-icon">🎭</span>
                  <span className="dropdown-text">
                    <strong>Harshtal</strong>
                    <small>Cultural Events</small>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/tesseract" className="navbar-dropdown-link" onClick={closeMenu}>
                  <span className="dropdown-icon">🧊</span>
                  <span className="dropdown-text">
                    <strong>Tesseract</strong>
                    <small>Innovation Challenge</small>
                  </span>
                </Link>
              </li>
            </ul>
          </li>
          <li className="navbar-item">
            <Link to="/schedule" className="navbar-link" onClick={closeMenu}>Schedule</Link>
          </li>
          <li className="navbar-item">
            <Link to="/team" className="navbar-link" onClick={closeMenu}>Team</Link>
          </li>
          <li className="navbar-item">
            <Link to="/accommodation" className="navbar-link" onClick={closeMenu}>Accommodation</Link>
          </li>
          <li className="navbar-item">
            <Link to="/login" className="navbar-signup" onClick={closeMenu}>
              <Button variant="primary">Login/signup</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;