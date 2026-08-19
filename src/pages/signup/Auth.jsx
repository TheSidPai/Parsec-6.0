import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

/**
 * Auth handler page
 * 
 * This page handles the OAuth callback from the backend.
 * The backend redirects here after successful Google authentication.
 * 
 * Flow:
 * 1. Extract token from URL query params
 * 2. Store token in localStorage
 * 3. Call GET /auth/me to fetch user profile
 * 4. Check isOnboardingComplete flag and redirect accordingly:
 *    - false → /signup/onboarding
 *    - true but no house → /signup/sorting
 *    - true with house → /dashboard
 */

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Step 1: Extract token from URL query params
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('No token found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        console.log('✅ Token received from URL');

        // Step 2: Store token in localStorage
        localStorage.setItem('jwt_token', token);
        console.log('✅ Token stored in localStorage');

        // Step 3: Fetch user profile from /auth/me
        setStatus('Fetching your profile...');
        console.log('📡 Calling GET /auth/me');
        
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Auth verification failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('📡 /auth/me response:', data);

        if (data.status !== 'success') {
          throw new Error('Backend returned non-success status');
        }

        const user = data.data?.user || data.user;
        console.log('👤 User data:', user);
        console.log('📋 isOnboardingComplete:', user.isOnboardingComplete);
        console.log('🏰 house:', user.house);

        // Step 4: Check onboarding status and redirect accordingly
        if (user.isOnboardingComplete === false || !user.isOnboardingComplete) {
          // User hasn't completed onboarding
          console.log('⚠️ Onboarding incomplete - redirecting to /signup/onboarding');
          setStatus('Redirecting to onboarding...');
          setTimeout(() => navigate('/signup/onboarding'), 800);
        } else if (!user.house) {
          // User completed onboarding but hasn't been sorted
          console.log('⚠️ No house assigned - redirecting to /signup/sorting');
          setStatus('Redirecting to sorting...');
          setTimeout(() => navigate('/signup/sorting'), 800);
        } else {
          // User is fully set up
          console.log('✅ Profile complete - redirecting to /dashboard');
          setStatus('Welcome back! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 800);
        }

      } catch (error) {
        console.error('❌ Auth error:', error);
        setStatus('Authentication failed. Please try again.');
        localStorage.removeItem('jwt_token');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleAuth();
  }, [location.search, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #333',
        borderTop: '4px solid #ffd700',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      <p style={{ fontSize: '18px', textAlign: 'center', padding: '0 20px' }}>
        {status}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Auth;
