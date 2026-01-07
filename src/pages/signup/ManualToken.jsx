import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Manual Token Entry for Localhost Testing
 * 
 * When backend redirects to production (parsec.iitdh.ac.in/signup/auth?token=...)
 * instead of localhost, you can copy the token and paste it here.
 */
function ManualToken() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setMessage('❌ Please enter a token');
      return;
    }

    // Store token in localStorage
    localStorage.setItem('jwt_token', token.trim());
    setMessage('✅ Token saved! Redirecting to dashboard...');
    
    // Redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1000);
  };

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '16px', color: '#333' }}>
          🔑 Manual Token Entry
        </h2>
        
        <p style={{ marginBottom: '24px', color: '#666', fontSize: '14px' }}>
          For localhost testing: Copy the token from the production URL and paste it here.
        </p>

        <div style={{
          backgroundColor: '#fff3cd',
          padding: '16px',
          borderRadius: '4px',
          marginBottom: '24px',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          <strong>📝 Instructions:</strong>
          <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>After Google login, you'll be redirected to:<br/>
              <code style={{ fontSize: '11px' }}>https://parsec.iitdh.ac.in/signup/auth?token=...</code>
            </li>
            <li>Copy everything after <code>token=</code></li>
            <li>Paste it in the box below</li>
            <li>Click "Submit Token"</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
            JWT Token:
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              fontSize: '12px',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical',
              marginBottom: '16px'
            }}
          />
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Submit Token
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          <strong>💡 Alternative:</strong> Ask your backend team to add<br/>
          <code style={{ fontSize: '11px' }}>http://localhost:5173/signup/auth</code><br/>
          as an OAuth redirect URL for development.
        </div>
      </div>
    </div>
  );
}

export default ManualToken;
