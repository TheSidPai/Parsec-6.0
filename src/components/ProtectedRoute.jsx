import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../config/api';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Validates JWT token with backend before allowing access
 * Uses session caching to avoid re-validation on every page change
 * Redirects to /login if:
 *   - No token exists
 *   - Token is invalid/expired (backend returns status: 'fail')
 */
function ProtectedRoute({ children }) {
  // Check cache immediately to set initial state
  const token = localStorage.getItem('jwt_token');
  const cachedValidation = sessionStorage.getItem('token_validated');
  const cachedToken = sessionStorage.getItem('validated_token');
  const hasValidCache = token && cachedValidation === 'true' && cachedToken === token;
  
  const [isValidating, setIsValidating] = useState(!hasValidCache);
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidCache);
  
  useEffect(() => {
    // If we have valid cache, skip validation entirely
    if (hasValidCache) {
      console.log('✅ ProtectedRoute: Using cached validation (instant)');
      return;
    }
    
    const validateToken = async () => {
      const token = localStorage.getItem('jwt_token');
      
      // No token - no need to call API, just redirect
      if (!token) {
        console.warn('🔒 ProtectedRoute: No token found, redirecting to /login');
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }
      
      // Token exists but not validated yet - validate with backend
      try {
        console.log('🔐 ProtectedRoute: Validating token with /auth/me...');
        const { response, data } = await authenticatedFetch(
          API_ENDPOINTS.AUTH_ME,
          { method: 'GET' },
          token
        );
        
        // Check if token is valid
        if (response.ok && data.status !== 'fail') {
          console.log('✅ ProtectedRoute: Token valid, caching result');
          // Cache validation result for this session
          sessionStorage.setItem('token_validated', 'true');
          sessionStorage.setItem('validated_token', token);
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          console.warn('🔒 ProtectedRoute: Token invalid/expired:', data.message);
          // Clear the invalid token and cache
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_house');
          localStorage.removeItem('revelio_count');
          sessionStorage.removeItem('token_validated');
          sessionStorage.removeItem('validated_token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ ProtectedRoute: Token validation error:', error);
        // On network error, allow access (let individual pages handle API failures)
        // This prevents locking users out due to temporary network issues
        setIsAuthenticated(true);
      } finally {
        setIsValidating(false);
      }
    };
    
    validateToken();
  }, [hasValidCache]);
  
  // Show loading state while validating
  if (isValidating) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: '#0a0e27',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          color: '#d4af37',
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.2rem',
          letterSpacing: '3px'
        }}>
          Verifying access...
        </div>
      </div>
    );
  }
  
  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated - render protected content
  return children;
}

export default ProtectedRoute;
