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
      </div>
    </div>
  );
}

export default UserManagement;
