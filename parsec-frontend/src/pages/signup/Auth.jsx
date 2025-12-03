import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch, API_BASE_URL } from '../../config/api';

/**
 * Auth handler page
 * 
 * This page handles the OAuth callback from the backend.
 * The backend should redirect here after successful Google authentication.
 */

// Emergency error boundary to catch render crashes
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 React Error Boundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
          <h1 style={{ color: '#dc3545' }}>⚠️ Something Crashed</h1>
          <p>The page encountered an error. Details:</p>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button onClick={() => window.location.href = '/login'} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Go to Login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Processing authentication...");
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        // Debug logging for Vercel troubleshooting
        console.log('🔍 Auth Debug Info:', {
          apiBaseUrl: API_BASE_URL,
          currentUrl: window.location.href,
          hasToken: !!new URLSearchParams(location.search).get('token'),
          environment: process.env.NODE_ENV
        });
        
        setDebugInfo({
          apiBaseUrl: API_BASE_URL,
          currentUrl: window.location.href,
          environment: process.env.NODE_ENV
        });

        // Check if we have query params with token
        const searchParams = new URLSearchParams(location.search);
        const tokenFromQuery = searchParams.get('token');
        
        if (tokenFromQuery) {
          console.log('✅ Token received from query params');
          localStorage.setItem("jwt_token", tokenFromQuery);
        }

        setMessage("Verifying authentication...");

        // Get token from localStorage (could be from query param or previously stored)
        const storedToken = localStorage.getItem("jwt_token") || tokenFromQuery;
        
        if (!storedToken) {
          throw new Error("No authentication token found. Please sign in again.");
        }

        console.log('🔑 Using token for /auth/me request');

        // Call /auth/me to get current user information and onboarding status
        const { response: resp, data } = await authenticatedFetch(
          API_ENDPOINTS.AUTH_ME,
          { method: "GET" },
          storedToken  // ✅ NOW PASSING THE TOKEN!
        );

        console.log('📡 Full response status:', resp.status);
        console.log('📡 Response ok:', resp.ok);
        console.log('📡 Full response data:', JSON.stringify(data, null, 2));

        if (!resp.ok) {
          // If fetch completely fails (network/CORS), provide helpful error
          if (!resp.status) {
            throw new Error(`Network error: Cannot reach backend at ${API_BASE_URL}. This is likely a CORS issue. Backend needs to allow requests from ${window.location.origin}`);
          }
          const errorMsg = data?.message || data?.error || JSON.stringify(data);
          throw new Error(`Auth verification failed (${resp.status}): ${errorMsg}`);
        }

        console.log('📥 Auth response:', data);
        
        // Accept both response formats: { status: 'success' } OR { success: true }
        const successFlag =
          data.status === "success" ||
          data.success === true;

        if (!successFlag) {
          const errorDetail = data?.message || data?.error || `Unexpected response format: ${JSON.stringify(data)}`;
          throw new Error(`Backend returned non-success status: ${errorDetail}`);
        }

        // Extract token if provided (for localStorage backup)
        const token = data?.token || data?.data?.token || tokenFromQuery;
        
        // Store token in localStorage for persistence
        if (token) {
          localStorage.setItem("jwt_token", token);
          console.log('💾 Token stored in localStorage');
        }

        const isOnboardingComplete =
          data.data?.isOnboardingComplete ?? 
          data.data?.user?.isOnboardingComplete ??
          data.isOnboardingComplete ?? 
          null;

        console.log('📊 Onboarding complete:', isOnboardingComplete);

        setMessage("Authentication successful — redirecting...");

        // Wait a moment before redirecting
        await new Promise(resolve => setTimeout(resolve, 500));

        if (
          isOnboardingComplete === false ||
          isOnboardingComplete === "false" ||
          isOnboardingComplete === 0
        ) {
          console.log('➡️ Redirecting to onboarding');
          navigate("/signup/onboarding", { replace: true, state: { token: storedToken } });
        } else if (
          isOnboardingComplete === true ||
          isOnboardingComplete === "true" ||
          isOnboardingComplete === 1
        ) {
          console.log('➡️ Redirecting to dashboard');
          navigate("/dashboard", { replace: true });
        } else {
          console.log('❓ Onboarding status unclear, defaulting to onboarding');
          navigate("/signup/onboarding", { replace: true, state: { token: storedToken } });
        }
      } catch (err) {
        console.error("❌ Auth processing error:", err);
        console.error("❌ Error stack:", err.stack);
        console.error("❌ API Base URL:", API_BASE_URL);
        setError(err.message);
        setMessage(`Authentication failed: ${err.message}`);
        setDebugInfo({
          apiBaseUrl: API_BASE_URL,
          errorMessage: err.message,
          errorStack: err.stack,
          environment: process.env.NODE_ENV
        });
      }
    };

    run();
  }, [navigate, location.search]);

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      textAlign: 'center',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      <h2 style={{ marginBottom: '16px' }}>
        {error ? '❌ Authentication Error' : '🔐 Processing Sign-in'}
      </h2>
      <p style={{ 
        fontSize: '16px', 
        color: error ? '#dc3545' : '#666',
        marginBottom: '24px'
      }}>
        {message}
      </p>
      
      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fee',
          border: '1px solid #dc3545',
          borderRadius: '8px',
          marginTop: '20px',
          textAlign: 'left'
        }}>
          <strong>Error Details:</strong>
          <pre style={{ 
            fontSize: '12px', 
            whiteSpace: 'pre-wrap',
            marginTop: '8px'
          }}>
            {error}
          </pre>
          
          {debugInfo && (
            <details style={{ marginTop: '12px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '12px', opacity: 0.8 }}>
                🔧 Debug Info (click to expand)
              </summary>
              <pre style={{ 
                fontSize: '11px', 
                whiteSpace: 'pre-wrap',
                marginTop: '8px',
                backgroundColor: '#f5f5f5',
                padding: '8px',
                borderRadius: '4px',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
          
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}
      
      {!error && (
        <div style={{ marginTop: '20px' }}>
          <div className="spinner" style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function AuthWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Auth />
    </ErrorBoundary>
  );
}
