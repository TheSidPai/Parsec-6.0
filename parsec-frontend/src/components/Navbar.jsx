import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Button from './Button';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/landing" className="navbar-logo" onClick={closeMenu}>
          <img src={require('../assets/images/parsec-logo-white.png')} alt="Parsec 6.0" className="navbar-logo-img" />
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
          <li className="navbar-item">
            <Link to="/events" className="navbar-link" onClick={closeMenu}>Events</Link>
          </li>
          <li className="navbar-item">
            <Link to="/schedule" className="navbar-link" onClick={closeMenu}>Schedule</Link>
          </li>
          <li className="navbar-item">
            <Link to="/landing" className="navbar-link home-link" onClick={closeMenu}>
              {/* Inline SVG icon; replace with <img src={yourSvg} alt="Home" /> if you upload a custom icon */}
              <svg
                className="navbar-link-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M3 11.25 12 4l9 7.25V20a1 1 0 0 1-1 1h-5.25v-5.5H9.25V21H4a1 1 0 0 1-1-1v-8.75z"></path>
                <path d="M12 4l8.5 6.84a1 1 0 0 0 1.25-1.56l-9-7.25a1 1 0 0 0-1.25 0l-9 7.25A1 1 0 0 0 3.5 10.9L12 4z" opacity=".2"></path>
              </svg>
              <span> Home</span>
            </Link>
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