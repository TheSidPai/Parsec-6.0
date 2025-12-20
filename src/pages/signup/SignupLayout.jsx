import React from 'react';
import { Outlet } from 'react-router-dom';

function SignupLayout() {
  return (
    <>
      {/* Just render the child route without any wrapper */}
      <Outlet />
    </>
  );
}

export default SignupLayout;