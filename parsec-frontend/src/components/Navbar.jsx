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
            <Link to="/landing" className="navbar-link" onClick={closeMenu}>Home</Link>
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