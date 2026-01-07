import React, { useState } from 'react';
import { RiUserLine, RiAddLine, RiSubtractLine } from '@remixicon/react';
import { API_ENDPOINTS, buildApiUrl } from '../../config/api';
import '../admin/AdminComponents.css';

function UserManagement() {
  const [userEmail, setUserEmail] = useState('');
  const [points, setPoints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddPoints = async () => {
    if (!userEmail || !points || parseInt(points) <= 0) {
      setMessage('Please enter valid user email and positive points');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ADMIN_POINTS_ADD), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          points: parseInt(points)
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage(`✅ ${data.message || 'Points added successfully'}`);
        setUserEmail('');
        setPoints('');
      } else {
        setMessage(`❌ ${data.message || 'Failed to add points'}`);
      }
    } catch (error) {
      console.error('Failed to add points:', error);
      setMessage('❌ Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubtractPoints = async () => {
    if (!userEmail || !points || parseInt(points) <= 0) {
      setMessage('Please enter valid user email and positive points');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ADMIN_POINTS_SUBTRACT), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          points: parseInt(points)
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage(`✅ ${data.message || 'Points subtracted successfully'}`);
        setUserEmail('');
        setPoints('');
      } else {
        setMessage(`❌ ${data.message || 'Failed to subtract points'}`);
      }
    } catch (error) {
      console.error('Failed to subtract points:', error);
      setMessage('❌ Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-section-container">
      <div className="admin-section-title-wrapper">
        <div className="admin-section-icon">
          <RiUserLine size={32} />
        </div>
        <h2 className="admin-section-main-title">Points Management</h2>
        <p className="admin-section-subtitle">Add or subtract points for users and their houses</p>
      </div>

      <div className="admin-content-card">
        {message && (
          <div className={`admin-alert ${message.includes('✅') ? 'admin-alert-success' : 'admin-alert-error'}`}>
            {message}
          </div>
        )}

        <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
          <div className="admin-form-row two-col">
            <div className="admin-form-group">
              <label className="admin-form-label admin-form-label-required">
                User Email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g., student@example.com"
                className="admin-form-input"
                required
              />
              <p className="admin-form-help">Enter the user's registered email address</p>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label admin-form-label-required">
                Points Amount
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter points amount"
                min="1"
                className="admin-form-input"
                required
              />
              <p className="admin-form-help">Must be a positive number</p>
            </div>
          </div>

          <div className="admin-actions">
            <button
              onClick={handleAddPoints}
              disabled={isLoading}
              className="admin-btn admin-btn-success"
            >
              <RiAddLine size={20} />
              Add Points
            </button>
            <button
              onClick={handleSubtractPoints}
              disabled={isLoading}
              className="admin-btn admin-btn-danger"
            >
              <RiSubtractLine size={20} />
              Subtract Points
            </button>
          </div>
        </form>

        <div className="admin-how-to-use">
          <h3 className="admin-how-to-title">How to use:</h3>
          <ul className="admin-how-to-list">
            <li className="admin-how-to-item">Enter the user's registered email address to identify them</li>
            <li className="admin-how-to-item">Adding points updates both user points and their house points</li>
            <li className="admin-how-to-item">Subtracting points will fail if user doesn't have enough points</li>
            <li className="admin-how-to-item">Points changes are reflected in the leaderboard immediately</li>
          </ul>
        </div>

        <div className="admin-mongodb-helper">
          <h3 className="admin-mongodb-helper-title">
            🔍 How to Find User Email
          </h3>
          <div className="admin-mongodb-helper-content">
            <p><strong>Option 1: From Admin Orders Tab</strong></p>
            <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
              <li>Go to the "Orders" tab in admin panel</li>
              <li>View any payment record - the email is displayed prominently</li>
              <li>Copy the email address shown</li>
            </ol>

            <p style={{ marginTop: '1rem' }}><strong>Option 2: Ask User Directly</strong></p>
            <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
              <li>Ask the user for their registered email address</li>
              <li>This is the email they used to sign up for Parsec</li>
            </ol>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <strong style={{ color: '#FFD700' }}>💡 Pro Tip:</strong> Email-based identification is much simpler and more user-friendly than MongoDB ObjectIds. Make sure to use the exact email address registered in the system!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
