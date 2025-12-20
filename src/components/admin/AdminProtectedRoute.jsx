import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ADMIN PROTECTED ROUTE
 * 
 * Wraps admin routes to ensure only authenticated admins can access them.
 * Checks for admin_token in sessionStorage.
 */
const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  const adminToken = sessionStorage.getItem('admin_token');

  // If no admin token, redirect to admin login
  if (!adminToken) {
    console.log('🚫 No admin token found, redirecting to /admin/login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('✅ Admin token found, allowing access to admin route');
  return children;
};

export default AdminProtectedRoute;
