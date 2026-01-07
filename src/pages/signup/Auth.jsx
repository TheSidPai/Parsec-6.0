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
  const [authSteps, setAuthSteps] = useState([]);

  useEffect(() => {
    const run = async () => {
      const steps = [];
      try {
        steps.push('1. Starting auth process');
        setAuthSteps([...steps]);
        
        // Check if we have query params with token
        const searchParams = new URLSearchParams(location.search);
        const tokenFromQuery = searchParams.get('token');
        const redirectOrigin = searchParams.get('origin'); // Optional: origin parameter from URL
        
        steps.push(`2. Token in URL: ${tokenFromQuery ? 'YES' : 'NO'}`);
        setAuthSteps([...steps]);
        
        if (!tokenFromQuery) {
          throw new Error("No authentication token found. Please sign in again.");
        }

        console.log('✅ Token received from query params');
        console.log('🔍 Current hostname:', window.location.hostname);
        console.log('🔍 URL redirect origin:', redirectOrigin);
        
        steps.push(`3. Current hostname: ${window.location.hostname}`);
        setAuthSteps([...steps]);
        
        // Check sessionStorage for stored origin (set before OAuth redirect)
        const storedOrigin = sessionStorage.getItem('auth_origin');
        console.log('🔍 Stored origin from sessionStorage:', storedOrigin);
        
        steps.push(`4. SessionStorage origin: ${storedOrigin || 'NONE'}`);
        setAuthSteps([...steps]);
        
        // Detect if we're on production or should redirect to localhost
        const currentHostname = window.location.hostname;
        const isProduction = currentHostname === 'parsec.iitdh.ac.in';
        
        // Determine target origin for redirect (priority order)
        let targetOrigin;
        if (redirectOrigin) {
          // 1. Use explicit origin if provided in URL parameter
          targetOrigin = redirectOrigin;
          console.log('✅ Using URL parameter origin');
          steps.push('5. Using URL parameter origin');
        } else if (storedOrigin && storedOrigin !== 'null') {
          // 2. Use stored origin from sessionStorage (where login was initiated)
          targetOrigin = storedOrigin;
          console.log('✅ Using stored sessionStorage origin');
          steps.push('5. Using sessionStorage origin');
        } else {
          // 3. Default behavior: if on production, stay on production, otherwise go to localhost
          if (isProduction) {
            targetOrigin = window.location.origin;
            console.log('✅ On production, staying on production');
            steps.push('5. On production, staying here');
          } else {
            targetOrigin = 'http://localhost:5173';
            console.log('✅ Not on production, defaulting to localhost');
            steps.push('5. Defaulting to localhost');
          }
        }
        
        console.log('🎯 Final target origin for redirect:', targetOrigin);
        steps.push(`6. Target origin: ${targetOrigin}`);
        setAuthSteps([...steps]);
        
        // Clear stored origin after reading it
        sessionStorage.removeItem('auth_origin');

        // Store token in localStorage
        localStorage.setItem("jwt_token", tokenFromQuery);
        steps.push('7. Token stored in localStorage');
        setAuthSteps([...steps]);
        
        setMessage("Verifying authentication...");

        // Verify token with backend
        steps.push('8. Calling /auth/me API...');
        setAuthSteps([...steps]);
        
        const { response: resp, data } = await authenticatedFetch(
          API_ENDPOINTS.AUTH_ME,
          { method: "GET" },
          tokenFromQuery
        );

        console.log('📡 Auth response status:', resp.status);
        console.log('📡 Auth response data:', data);
        
        steps.push(`9. API response: ${resp.status} ${resp.ok ? 'OK' : 'FAILED'}`);
        setAuthSteps([...steps]);
        console.log('📡 Response ok:', resp.ok);
        console.log('📡 Full response data:', JSON.stringify(data, null, 2));

        if (!resp.ok) {
          // If fetch completely fails (network/CORS), provide helpful error
          if (!resp.status) {
            throw new Error(`Network error: Cannot reach backend at ${API_BASE_URL}`);
          }
          const errorMsg = data?.message || data?.error || JSON.stringify(data);
          throw new Error(`Auth verification failed (${resp.status}): ${errorMsg}`);
        }

        console.log('✅ Authentication verified successfully');
        steps.push('10. Authentication verified ✅');
        setAuthSteps([...steps]);
        
        // Accept both response formats: { status: 'success' } OR { success: true }
        const successFlag =
          data.status === "success" ||
          data.success === true;

        if (!successFlag) {
          const errorDetail = data?.message || data?.error || `Unexpected response format`;
          throw new Error(`Backend returned non-success status: ${errorDetail}`);
        }

        setMessage("Authentication successful — redirecting...");
        steps.push('11. Preparing redirect...');
        setAuthSteps([...steps]);

        // Wait a moment before redirecting
        await new Promise(resolve => setTimeout(resolve, 800));

        // Redirect to target origin + /dashboard
        const dashboardUrl = `${targetOrigin}/dashboard`;
        console.log('🚀 Redirecting to:', dashboardUrl);
        steps.push(`12. Redirecting to: ${dashboardUrl}`);
        setAuthSteps([...steps]);
        
        // Check if we need to redirect to different origin
        if (targetOrigin !== window.location.origin) {
          // Cross-origin redirect - use window.location
          steps.push('13. Cross-origin redirect via window.location');
          setAuthSteps([...steps]);
          window.location.href = dashboardUrl;
        } else {
          // Same origin - use React Router
          steps.push('13. Same-origin redirect via React Router');
          setAuthSteps([...steps]);
          const pendingEventId = localStorage.getItem('pendingEventRegistration');
          if (pendingEventId) {
            console.log('🎟️ Redirecting to event registration page');
            navigate("/dashboard/events", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
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
          
          {/* Debug Steps */}
          {authSteps.length > 0 && (
            <details open style={{ marginTop: '24px', textAlign: 'left', fontSize: '12px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                🔍 Authentication Steps
              </summary>
              <ol style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '12px 12px 12px 28px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                lineHeight: '1.8'
              }}>
                {authSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </details>
          )}
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
