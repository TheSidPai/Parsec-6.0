import React, { useState, useEffect, useCallback } from 'react';
import { RiSaveLine, RiRefreshLine, RiCheckLine, RiCloseLine, RiTicketLine } from '@remixicon/react';
import axios from 'axios';
import './AdminComponents.css';

// Default pass data structure - moved outside component to avoid dependency issues
const defaultPasses = [
  {
    id: 1,
    name: "1 Day Visitor Pass",
    description: "One day access to all workshops, talks, stalls, events, etc.",
    price: 100,
    soldOut: false
  },
  {
    id: 2,
    name: "2 Days Visitor Pass", 
    description: "Complete access to all the events of E-Summit'25 for both the days",
    price: 200,
    soldOut: false
  },
  {
    id: 3,
    name: "Stay Pass - Basic",
    description: "Complementary stay and food (3x meals a day: Breakfast, Lunch, Dinner), starter kit. Stay includes: 8 AM, 23rd August 2025 to 10 AM, 25th August 2025. Anything beyond or before that would be charged extra as applicable.",
    price: 699,
    soldOut: false
  },
  {
    id: 4,
    name: "Stay Pass - Premium",
    description: "Complementary stay and food (3x meals a day: Breakfast, Lunch, Dinner), starter kit, exclusive E-Summit swags. Stay includes: 8 AM, 23rd August 2025 to 10 AM, 25th August 2025. Anything beyond or before that would be charged extra as applicable.",
    price: 999,
    soldOut: false
  }
];

function PassManagement() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch current pass availability status
  const fetchPassData = useCallback(async () => {
    try {
      setLoading(true);
      const adminKey = sessionStorage.getItem('admin_key');
      
      // Try to fetch from API first
      try {
        const response = await axios.get('/api/admin/passes', {
          headers: {
            'X-Admin-Key': adminKey,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
        
        if (response.data && response.data.passes) {
          setPasses(response.data.passes);
        } else {
          // If API doesn't have pass data, use default
          setPasses(defaultPasses);
        }
      } catch (error) {
        console.log('API not available, using default data:', error);
        // Load from localStorage if API is not available
        const savedPasses = localStorage.getItem('admin_passes');
        if (savedPasses) {
          setPasses(JSON.parse(savedPasses));
        } else {
          setPasses(defaultPasses);
        }
      }
    } catch (error) {
      console.error('Error fetching pass data:', error);
      setMessage({ type: 'error', text: 'Failed to load pass data' });
      setPasses(defaultPasses);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save pass availability changes
  const savePassChanges = async () => {
    try {
      setSaving(true);
      const adminKey = sessionStorage.getItem('admin_key');
      
      // Try to save to API first
      try {
        await axios.post('/api/admin/passes/update', {
          passes: passes
        }, {
          headers: {
            'X-Admin-Key': adminKey,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
        
        setMessage({ type: 'success', text: 'Pass availability updated successfully!' });
      } catch (error) {
        console.log('API not available, saving locally:', error);
        // Save to localStorage as fallback
        localStorage.setItem('admin_passes', JSON.stringify(passes));
        setMessage({ type: 'success', text: 'Pass availability updated locally!' });
      }
      
      // Also update the frontend data file for immediate effect
      updateFrontendPassData();
      
    } catch (error) {
      console.error('Error saving pass changes:', error);
      setMessage({ type: 'error', text: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  // Update frontend pass data (this would ideally be handled by the backend)
  const updateFrontendPassData = () => {
    // For now, we'll save to localStorage and the frontend will read from there
    localStorage.setItem('esummit_pass_availability', JSON.stringify(passes));
  };

  // Toggle pass availability
  const togglePassAvailability = (passId) => {
    setPasses(prev => prev.map(pass => 
      pass.id === passId 
        ? { ...pass, soldOut: !pass.soldOut }
        : pass
    ));
  };

  // Load data on component mount
  useEffect(() => {
    fetchPassData();
  }, [fetchPassData]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="admin-section-container">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section-container">
      <div className="admin-section-title-wrapper">
        <div className="admin-section-icon">
          <RiTicketLine size={32} />
        </div>
        <h2 className="admin-section-main-title">Pass Management</h2>
        <p className="admin-section-subtitle">Control which passes are available for purchase</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`admin-alert ${
          message.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'
        }`}>
          {message.text}
        </div>
      )}

      <div className="admin-content-card">
        {/* Action Buttons */}
        <div style={{marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
          <button
            onClick={fetchPassData}
            disabled={loading}
            className="admin-btn admin-btn-primary"
          >
            <RiRefreshLine size={18} />
            Refresh
          </button>
          
          <button
            onClick={savePassChanges}
            disabled={saving}
            className="admin-btn admin-btn-success"
          >
            <RiSaveLine size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Pass List */}
        <div className="grid gap-4">
          {passes.map((pass) => (
            <div
              key={pass.id}
              className={`admin-card ${pass.soldOut ? 'opacity-75' : ''}`}
              style={{
                background: pass.soldOut ? 'rgba(40, 40, 55, 0.8)' : 'rgba(30, 30, 45, 0.9)',
                borderColor: pass.soldOut ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 215, 0, 0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-semibold ${
                      pass.soldOut ? 'text-gray-400' : 'text-white'
                    }`}>
                      {pass.name}
                    </h3>
                    <span className={`text-lg font-bold ${
                      pass.soldOut ? 'text-gray-400 line-through' : 'text-yellow-400'
                    }`}>
                      ₹{pass.price}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${
                    pass.soldOut ? 'text-gray-500' : 'text-gray-300'
                  } max-w-3xl`}>
                    {pass.description}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <div className={`admin-badge ${
                    pass.soldOut ? 'admin-badge-rejected' : 'admin-badge-verified'
                  }`}>
                    {pass.soldOut ? 'SOLD OUT' : 'AVAILABLE'}
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => togglePassAvailability(pass.id)}
                    className={pass.soldOut ? 'admin-btn admin-btn-success' : 'admin-btn admin-btn-danger'}
                  >
                    {pass.soldOut ? (
                      <>
                        <RiCheckLine size={16} />
                        Make Available
                      </>
                    ) : (
                      <>
                        <RiCloseLine size={16} />
                        Mark Sold Out
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div className="admin-how-to-use" style={{marginTop: '2rem'}}>
          <h4 className="admin-how-to-title">Instructions:</h4>
          <ul className="admin-how-to-list">
            <li className="admin-how-to-item">Toggle pass availability using the buttons on the right</li>
            <li className="admin-how-to-item">"Make Available" - Opens the pass for purchase</li>
            <li className="admin-how-to-item">"Mark Sold Out" - Disables purchasing for that pass</li>
            <li className="admin-how-to-item">Don't forget to click "Save Changes" to apply your updates</li>
            <li className="admin-how-to-item">Changes take effect immediately on the frontend</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PassManagement;
