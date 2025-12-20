import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Manual Token Entry Page
 * USE THIS TEMPORARILY until backend OAuth redirect is configured
 */

function ManualAuth() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (token.trim()) {
      // Store token in localStorage
      localStorage.setItem('jwt_token', token.trim());
      console.log('✅ Token stored manually');
      
      // Redirect to auth processing page
      navigate('/signup/auth?token=' + token.trim());
    } else {
      alert('Please paste the token');
    }
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '600px', 
      margin: '0 auto' 
    }}>
      <h2>⚠️ Manual OAuth Token Entry</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This is a temporary workaround. Copy the token from the JSON response
        and paste it below.
      </p>

      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <strong>Steps:</strong>
        <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Click "Sign in with Google" on the login page</li>
          <li>After signing in, you'll see raw JSON</li>
          <li>Copy the "token" value from the JSON</li>
          <li>Come back to this page and paste it below</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="token" style={{ 
          display: 'block', 
          fontWeight: 'bold', 
          marginBottom: '8px' 
        }}>
          Paste Token Here:
        </label>
        <textarea
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          rows="4"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginBottom: '16px'
          }}
        />
        
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Continue with Token
        </button>
      </form>

      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#d1ecf1',
        border: '1px solid #bee5eb',
        borderRadius: '8px'
      }}>
        <strong>🔧 For Backend Developer:</strong>
        <p style={{ marginTop: '8px', fontSize: '14px' }}>
          The OAuth callback should redirect to:<br />
          <code style={{ 
            backgroundColor: '#fff', 
            padding: '4px 8px', 
            borderRadius: '4px',
            display: 'inline-block',
            marginTop: '4px'
          }}>
            http://localhost:3001/signup/auth?token=JWT_TOKEN
          </code>
        </p>
      </div>
    </div>
  );
}

export default ManualAuth;
