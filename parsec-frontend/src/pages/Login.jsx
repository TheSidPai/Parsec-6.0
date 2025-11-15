import React from 'react';
import { motion } from 'framer-motion';
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
            Sign in with your Google account to continue to Parsec 6.0
          </p>
          <Button variant="primary" onClick={handleLogin}>
            Sign in with Google
          </Button>
          <p className="login-note">
            After signing in you'll be redirected back here and taken to
            onboarding or the dashboard depending on your account state.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Login;
