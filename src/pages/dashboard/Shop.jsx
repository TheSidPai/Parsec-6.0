// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import Particles from '../../components/Particles';
import './Shop.css';

function Shop() {
  // --- Shop logic and UI commented out for closure period ---
  /*
  const [merch, setMerch] = useState([]);
  const [filteredMerch, setFilteredMerch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ...all shop logic and UI code...
  */

  // --- Show closed message only ---
  return (
    <div className="shop-container">
      {/* Particles Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={600}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="shop-closed-message">
        <h1>Orders and Passes are now closed!</h1>
        <p>Thank you for your interest in Parsec 2026.<br/>All orders and passes are now closed. Please stay tuned for future updates!</p>
      </div>
    </div>
  );
}

export default Shop;
