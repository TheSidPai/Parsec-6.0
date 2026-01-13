import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import Particles from '../../components/Particles';
import './Passes.css';

// Event pass data now comes ONLY from admin - no hardcoded data

function Passes() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPasses = useCallback(async () => {
    try {
      setLoading(true);
      
      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.MERCH_GET_ALL,
        { method: 'GET' }
      );

      console.log('API Response:', response.ok);
      console.log('API Data:', data);

      if (response.ok && data.status === 'success') {
        console.log('Raw merch data from API:', data.data.merch);
        
        // Filter only event passes and use ONLY admin data
        const eventPasses = data.data.merch.filter(item => 
          item.type === 'event-pass1' || 
          item.type === 'event-pass2' || 
          item.type === 'event-pass3'
        );

        console.log('Filtered event passes:', eventPasses);
        console.log('Pass names from admin:', eventPasses.map(p => ({ name: p.name, type: p.type })));

        // Use admin data as-is, no hardcoded merging
        setPasses(eventPasses);
        console.log('Final passes set to state:', eventPasses);
      } else {
        console.error('Failed to fetch passes from admin');
        setPasses([]);
      }
    } catch (err) {
      console.error('Error fetching passes:', err);
      // No fallback - show empty if admin fails
      setPasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);
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

      <div className="passes-grid">
        {passes.map((pass, index) => (
          <div 
            key={pass._id} 
            className={`pass-card ${index === 2 ? 'pass-card-featured' : ''}`}
          >
            {index === 2 && <div className="pass-badge">Best Value</div>}
            
            <div className="pass-header">
              <h3 className="pass-name">{pass.name}</h3>
              <div 
                className="pass-description" 
                dangerouslySetInnerHTML={{ __html: pass.description }}
              />
            </div>

            <div className="pass-price">
              <span className="pass-currency">₹</span>
              <span className="pass-amount">{pass.price}</span>
              <span className="pass-per">/pass</span>
            </div>

            <div className="pass-features">
              {pass.features && Array.isArray(pass.features) ? (
                pass.features.map((feature, idx) => (
                  <div key={idx} className="pass-feature">
                    <span className="pass-feature-icon">✓</span>
                    <span className="pass-feature-text">{feature}</span>
                  </div>
                ))
              ) : (
                <div className="pass-feature">
                  <span className="pass-feature-icon">✓</span>
                  <span className="pass-feature-text">Event Pass Access</span>
                </div>
              )}
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
