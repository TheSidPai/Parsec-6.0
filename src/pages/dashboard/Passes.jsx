import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import Particles from '../../components/Particles';
import './Passes.css';

function Passes() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Event pass data from API documentation
  const eventPassesInfo = [
    {
      type: 'event-pass1',
      name: 'Event Pass - Day 1',
      description: 'Access to all Day 1 events (24 Jan 2026). Includes workshops, talks, stalls, and competitions.',
      price: 299,
      features: ['All Day 1 Events', 'Workshop Access', 'Networking Sessions', 'Food & Refreshments']
    },
    {
      type: 'event-pass2',
      name: 'Event Pass - Day 2',
      description: 'Access to all Day 2 events (25 Jan 2026). Includes main stage performances and closing ceremony.',
      price: 349,
      features: ['All Day 2 Events', 'Main Stage Shows', 'Closing Ceremony', 'Food & Refreshments']
    },
    {
      type: 'event-pass3',
      name: 'Full Event Pass',
      description: 'Complete access to both days (24-25 Jan 2026). Best value for complete experience!',
      price: 549,
      features: ['Both Days Access', 'All Events & Workshops', 'Priority Entry', 'Exclusive Merchandise']
    }
  ];

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      setLoading(true);
      
      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.MERCH_GET_ALL,
        { method: 'GET' }
      );

      if (response.ok && data.status === 'success') {
        // Filter only event passes
        const eventPasses = data.data.merch.filter(item => 
          item.type === 'event-pass1' || 
          item.type === 'event-pass2' || 
          item.type === 'event-pass3'
        );

        // Merge with info
        const enrichedPasses = eventPasses.map(pass => {
          const info = eventPassesInfo.find(p => p.type === pass.type);
          return { ...pass, ...info };
        });

        setPasses(enrichedPasses);
      } else {
        // Fallback to mock data
        setPasses(eventPassesInfo.map((info, index) => ({
          _id: `mock-pass-${index + 1}`,
          ...info,
          stockQuantity: 200
        })));
      }
    } catch (err) {
      console.error('Error fetching passes:', err);
      // Fallback to mock data
      setPasses(eventPassesInfo.map((info, index) => ({
        _id: `mock-pass-${index + 1}`,
        ...info,
        stockQuantity: 200
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPass = (pass) => {
    // Navigate to checkout with pass data
    navigate('/dashboard/pass-checkout', { state: { pass } });
  };

  if (loading) {
    return (
      <div className="passes-page">
        <Particles />
        <div className="passes-loading">
          <div className="passes-spinner"></div>
          <p>Loading Event Passes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="passes-page">
      <Particles />
      
      <div className="passes-header">
        <h1 className="passes-title">
          <span className="passes-icon">🎟️</span>
          Event Passes
        </h1>
        <p className="passes-subtitle">
          Get your pass for Parsec 6.0 - IIT Dharwad's Premier Tech Fest
        </p>
      </div>

      {error && (
        <div className="passes-error">
          <p>{error}</p>
        </div>
      )}

      <div className="passes-grid">
        {passes.map((pass, index) => (
          <div 
            key={pass._id} 
            className={`pass-card ${index === 2 ? 'pass-card-featured' : ''}`}
          >
            {index === 2 && <div className="pass-badge">Best Value</div>}
            
            <div className="pass-header">
              <h3 className="pass-name">{pass.name}</h3>
              <p className="pass-description">{pass.description}</p>
            </div>

            <div className="pass-price">
              <span className="pass-currency">₹</span>
              <span className="pass-amount">{pass.price}</span>
              <span className="pass-per">/pass</span>
            </div>

            <div className="pass-features">
              {pass.features.map((feature, idx) => (
                <div key={idx} className="pass-feature">
                  <span className="pass-feature-icon">✓</span>
                  <span className="pass-feature-text">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pass-stock">
              {pass.stockQuantity > 0 ? (
                <span className="pass-stock-available">
                  {pass.stockQuantity} passes available
                </span>
              ) : (
                <span className="pass-stock-sold-out">Sold Out</span>
              )}
            </div>

            <button
              className="pass-buy-button"
              onClick={() => handleBuyPass(pass)}
              disabled={pass.stockQuantity === 0}
            >
              {pass.stockQuantity === 0 ? 'Sold Out' : 'Buy Pass'}
            </button>
          </div>
        ))}
      </div>

      <div className="passes-info">
        <h3>Important Information</h3>
        <ul>
          <li>🎫 Passes are non-refundable and non-transferable</li>
          <li>📧 QR code will be sent to your email after payment verification</li>
          <li>🏛️ Present QR code at venue for entry</li>
          <li>📱 Save your QR code on your phone for quick access</li>
          <li>💳 Payment via UPI only - enter UTR number during checkout</li>
        </ul>
      </div>
    </div>
  );
}

export default Passes;
