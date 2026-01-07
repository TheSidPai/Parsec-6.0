import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { buildApiUrl, API_ENDPOINTS, API_BASE_URL } from "../config/api";
import "./Login.css";

function Login() {
  const [debugInfo, setDebugInfo] = useState(null);
  const oauthUrl = buildApiUrl(API_ENDPOINTS.AUTH_GOOGLE);
  
  const handleLogin = () => {
    console.log('🔐 Initiating Google OAuth Login');
    console.log('📍 OAuth URL:', oauthUrl);
    console.log('🌐 Base URL:', API_BASE_URL);
    
    // Store current origin in sessionStorage so we know where to redirect back
    const currentOrigin = window.location.origin;
    sessionStorage.setItem('auth_origin', currentOrigin);
    console.log('💾 Stored origin for redirect:', currentOrigin);
    
    // Test backend connectivity first
    testBackendConnection();
    
    // Navigate browser to backend OAuth endpoint which will redirect to Google
    window.location.href = oauthUrl;
  };

  const testBackendConnection = async () => {
    try {
      console.log('🧪 Testing backend connection...');
      const response = await fetch(buildApiUrl('/sorting-hat/stats'));
      const data = await response.json();
      console.log('✅ Backend is reachable:', data);
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      setDebugInfo({
        error: true,
        message: 'Backend server is not running or not reachable',
        details: error.message,
        url: buildApiUrl('/sorting-hat/stats')
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Navbar />

      <div className="login-container">
        <motion.div 
          className="login-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="login-title">Login / Signup</h2>
          <p className="login-desc">
            Sign in with your Google account to continue to PARSEC 6.0
          </p>
          
          {/* Debug Info */}
          {debugInfo && debugInfo.error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              <strong>⚠️ Warning:</strong> {debugInfo.message}
              <br />
              <small>Check console for details</small>
            </div>
          )}
          
          <Button variant="primary" onClick={handleLogin}>
            Sign in with Google
          </Button>
          
          <p className="login-note">
            After signing in you'll be redirected back here and taken to
            onboarding or the dashboard depending on your account state.
          </p>
          
          {/* Debug Panel */}
          <details style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
            <summary style={{ cursor: 'pointer' }}>🔧 Debug Info</summary>
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontFamily: 'monospace' }}>
              <div><strong>OAuth URL:</strong> {oauthUrl}</div>
              <div><strong>Base URL:</strong> {API_BASE_URL}</div>
              <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            </div>
          </details>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Login;
