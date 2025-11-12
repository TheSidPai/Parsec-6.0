import React from "react";
// import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import "./Login.css";

function Login() {
  const oauthUrl = "/api/parsec/v1/auth/google";
  const handleLogin = () => {
    // Navigate browser to backend OAuth endpoint which will redirect to Google
    window.location.href = oauthUrl;
  };

  return (
    <div>
      <Navbar />

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login / Signup</h2>
          <p className="login-desc">
            Sign in with your Google account to continue to Parsec 6.0
          </p>
          <Button variant="primary" onClick={handleLogin}>
            Sign in with Google
          </Button>
          <p className="login-note">
            After signing in you'll be redirected back here and taken to
            onboarding or the dashboard depending on your account state.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
