import React, { useState } from 'react';
import { RiUserLine, RiAddLine, RiSubtractLine } from '@remixicon/react';
import { API_ENDPOINTS, buildApiUrl } from '../../config/api';
import '../admin/AdminComponents.css';

function UserManagement() {
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddPoints = async () => {
    if (!userId || !points || parseInt(points) <= 0) {
      setMessage('Please enter valid User ID and positive points');
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
          userId: userId,
          pointsToAdd: parseInt(points)
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage(`✅ ${data.message}`);
        setUserId('');
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
    if (!userId || !points || parseInt(points) <= 0) {
      setMessage('Please enter valid User ID and positive points');
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
          userId: userId,
          pointsToSubtract: parseInt(points)
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage(`✅ ${data.message}`);
        setUserId('');
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
                User ID (MongoDB ObjectId)
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g., 673c3e6912abd5e72d56f9cb"
                className="admin-form-input"
                required
              />
              <p className="admin-form-help">Enter the user's MongoDB ObjectId</p>
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
            <li className="admin-how-to-item">User ID is the MongoDB ObjectId (24-character hex string)</li>
            <li className="admin-how-to-item">Adding points updates both user points and their house points</li>
            <li className="admin-how-to-item">Subtracting points will fail if user doesn't have enough points</li>
            <li className="admin-how-to-item">Points changes are reflected in the leaderboard immediately</li>
          </ul>
        </div>

        <div className="admin-mongodb-helper">
          <h3 className="admin-mongodb-helper-title">
            🔍 How to Find MongoDB User ID
          </h3>
          <div className="admin-mongodb-helper-content">
            <p><strong>Option 1: From Admin Orders Tab</strong></p>
            <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
              <li>Go to the "Orders" tab in admin panel</li>
              <li>Click "View Details" on any payment</li>
              <li>Look for "User ID" in the user information section</li>
              <li>Copy the 24-character hex string (e.g., <code className="admin-mongodb-helper-code" style={{ display: 'inline', padding: '0.25rem 0.5rem', margin: '0' }}>673c3e6912abd5e72d56f9cb</code>)</li>
            </ol>

            <p style={{ marginTop: '1rem' }}><strong>Option 2: From Database Access</strong></p>
            <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
              <li>Access your MongoDB database directly</li>
              <li>Navigate to the "users" collection</li>
              <li>Find the user by email or name</li>
              <li>Copy their "_id" field value</li>
            </ol>

            <p style={{ marginTop: '1rem' }}><strong>Option 3: Ask User to Check Profile</strong></p>
            <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.8' }}>
              <li>User logs into their dashboard</li>
              <li>Their User ID should be visible in profile settings</li>
              <li>User can share their ID with admins</li>
            </ol>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
              <strong style={{ color: '#FFD700' }}>💡 Pro Tip:</strong> MongoDB ObjectIds are always 24 characters long and contain only numbers (0-9) and letters (a-f). If it doesn't match this format, it's not a valid ObjectId!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
