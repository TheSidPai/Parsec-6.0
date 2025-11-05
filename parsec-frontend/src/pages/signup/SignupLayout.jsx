import React from 'react';
import { Outlet } from 'react-router-dom';

function SignupLayout() {
  return (
    <div>
      <h2>Signup Flow</h2>
      {/* Outlet renders the child route (onboarding, terms, or auth) */}
      <Outlet />
    </div>
  );
}

export default SignupLayout;