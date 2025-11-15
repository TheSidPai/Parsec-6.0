import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Auth handler page
 *
 * Assumptions (please confirm with backend):
 * - After Google completes, backend will redirect the browser to a frontend route
 *   (we expect `/signup/auth`) and include either:
 *     1) query params: `?token=...&isOnboardingComplete=true|false`
 *   OR
 *     2) the frontend can fetch `/api/parsec/v1/auth/google/callback` (same-origin)
 *        which returns JSON: { token: string, isOnboardingComplete: boolean }
 *
 * Behavior:
 * - Parse token + isOnboardingComplete
 * - Store token in localStorage under `jwt_token` (Onboarding expects this key)
 * - Redirect to `/signup/onboarding` if onboarding not complete
 * - Redirect to `/dashboard` if onboarding complete
 */

function Auth() {
  const navigate = useNavigate();
  // const location = useLocation();
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const run = async () => {
      try {
        setMessage("Checking server session...");

        // Cookie-first approach: backend sets httpOnly secure cookie named `jwt`.
        // We call the callback endpoint with credentials so the server can read the cookie
        // and return the JSON payload (success, token, user).
        const resp = await fetch("/api/parsec/v1/auth/google/callback", {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        });

        if (!resp.ok) {
          throw new Error(`Auth callback failed: ${resp.status}`);
        }

        const data = await resp.json();
        // Expected shape (from backend):
        // { success: true, message: 'Authentication successful', token: '...', user: { isOnboardingComplete: false, ... } }
        if (data.success === false) {
          throw new Error(data.message || "Authentication failed on server");
        }

        const token = data.token || data.accessToken || data.jwt;
        const isOnboardingComplete =
          data.user?.isOnboardingComplete ?? data.isOnboardingComplete ?? null;

        setMessage("Authentication successful — redirecting...");

        if (
          isOnboardingComplete === false ||
          isOnboardingComplete === "false" ||
          isOnboardingComplete === 0
        ) {
          // Pass token to onboarding page via navigate state
          navigate("/signup/onboarding", { replace: true, state: { token } });
        } else if (
          isOnboardingComplete === true ||
          isOnboardingComplete === "true" ||
          isOnboardingComplete === 1
        ) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/signup/onboarding", { replace: true, state: { token } });
        }
      } catch (err) {
        console.error("Auth processing error:", err);
        setMessage(`Authentication failed: ${err.message}`);
      }
    };

    run();
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h3>Processing Sign-in</h3>
      <p>{message}</p>
      <p>
        If this page does not redirect automatically, please contact support or
        try signing in again.
      </p>
    </div>
  );
}

export default Auth;
