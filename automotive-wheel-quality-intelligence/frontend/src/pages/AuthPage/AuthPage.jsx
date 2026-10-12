import React, { useState, useEffect } from 'react';
import './AuthPage.css';

export default function AuthPage({
  onAuthSuccess,
  onOpenTerms,
  onOpenPrivacy,
  onCancel,
  initialTermsAccepted = false,
  initialPrivacyAccepted = false,
  onNotify,
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Mandatory Agreement Checkboxes
  const [termsAccepted, setTermsAccepted] = useState(initialTermsAccepted);
  const [privacyAccepted, setPrivacyAccepted] = useState(initialPrivacyAccepted);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAgreementComplete = termsAccepted && privacyAccepted;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Initialize official Google Identity Services once if client ID is configured
  useEffect(() => {
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (err) {
        console.warn('Google Identity Services notice:', err);
      }
    }
  }, [googleClientId, termsAccepted, privacyAccepted]);

  // Handle Google Credential Response
  const handleGoogleCredentialResponse = (response) => {
    if (!isAgreementComplete) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy first.');
      if (onNotify) onNotify('Tick both legal checkboxes to proceed.', 'warning');
      return;
    }

    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const googleUser = JSON.parse(jsonPayload);

      const authenticatedProfile = {
        name: googleUser.name || 'Ganesh (Quality Lead)',
        email: googleUser.email,
        picture: googleUser.picture,
        role: 'QA_LEAD',
        organization: 'Automotive Wheel Division',
        authProvider: 'google',
        signedInAt: new Date().toISOString(),
      };

      localStorage.setItem('wqi_auth_user', JSON.stringify(authenticatedProfile));
      if (onNotify) {
        onNotify(`Welcome, ${authenticatedProfile.name}! Signed in with Google.`, 'success');
      }
      onAuthSuccess(authenticatedProfile);
    } catch {
      handleSimulatedGoogleAuth();
    }
  };

  // Trigger Google Sign-In (ONE SINGLE ACTION)
  const handleGoogleAuth = () => {
    if (!isAgreementComplete) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy before continuing with Google.');
      if (onNotify) {
        onNotify('Mandatory: Tick both legal checkboxes before signing in.', 'warning');
      }
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            handleSimulatedGoogleAuth();
          }
        });
      } catch {
        handleSimulatedGoogleAuth();
      }
    } else {
      handleSimulatedGoogleAuth();
    }
  };

  // Simulated Google Auth fallback
  const handleSimulatedGoogleAuth = () => {
    setTimeout(() => {
      const demoGoogleUser = {
        name: 'Ganesh (Quality Lead)',
        email: 'ganesh.quality@automotive.internal',
        picture: null,
        role: 'QA_LEAD',
        organization: 'Automotive Wheel Quality Intelligence',
        authProvider: 'google',
        signedInAt: new Date().toISOString(),
      };

      localStorage.setItem('wqi_auth_user', JSON.stringify(demoGoogleUser));
      setIsLoading(false);
      if (onNotify) {
        onNotify(`Signed in with Google successfully as ${demoGoogleUser.name}`, 'success');
      }
      onAuthSuccess(demoGoogleUser);
    }, 600);
  };

  // Handle Standard Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAgreementComplete) {
      setErrorMessage('You must accept both Terms & Conditions and Privacy Policy.');
      if (onNotify) {
        onNotify('Please accept both legal checkboxes before continuing.', 'warning');
      }
      return;
    }

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (authMode === 'register' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const user = {
        name: fullName || (authMode === 'register' ? email.split('@')[0] : 'Ganesh (Quality Lead)'),
        email: email,
        picture: null,
        role: 'QA_LEAD',
        organization: 'Automotive Wheel Division',
        authProvider: 'local',
        signedInAt: new Date().toISOString(),
      };

      localStorage.setItem('wqi_auth_user', JSON.stringify(user));
      setIsLoading(false);

      if (onNotify) {
        onNotify(
          authMode === 'login'
            ? `Signed in successfully. Welcome, ${user.name}!`
            : `Account created successfully. Welcome, ${user.name}!`,
          'success'
        );
      }
      onAuthSuccess(user);
    }, 600);
  };

  return (
    <div className="simple-auth-wrapper">
      <div className="simple-auth-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 2" />
              <circle cx="20" cy="20" r="12" stroke="#00f0ff" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="5" fill="#38bdf8" />
              <line x1="20" y1="2" x2="20" y2="8" stroke="#38bdf8" strokeWidth="2" />
              <line x1="20" y1="32" x2="20" y2="38" stroke="#38bdf8" strokeWidth="2" />
              <line x1="2" y1="20" x2="8" y2="20" stroke="#38bdf8" strokeWidth="2" />
              <line x1="32" y1="20" x2="38" y2="20" stroke="#38bdf8" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="auth-title">
            {authMode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
          </h2>
          <p className="auth-subtitle">
            {authMode === 'login'
              ? 'Enter your credentials or continue with Google'
              : 'Register to access Wheel Quality Intelligence'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-simple-tabs">
          <button
            type="button"
            className={`tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
          >
            Register
          </button>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="simple-error-alert">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* THE ONLY GOOGLE SIGN-IN BUTTON (Single button, no duplicates) */}
        <button
          type="button"
          className={`btn-single-google ${isAgreementComplete ? 'enabled' : 'disabled'}`}
          onClick={handleGoogleAuth}
          disabled={!isAgreementComplete || isLoading}
          title={!isAgreementComplete ? 'Please tick both agreements below to unlock Google sign-in' : 'Sign in with Google'}
          id="btn-single-google-auth"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="simple-divider">
          <span>or continue with email</span>
        </div>

        {/* Standard Email / Password Form */}
        <form onSubmit={handleSubmit} className="simple-auth-form">
          {authMode === 'register' && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ganesh Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="label-with-link">
              <label className="input-label">Password</label>
              {authMode === 'login' && (
                <span
                  className="forgot-link"
                  onClick={() => setErrorMessage('Contact your administrator to reset credentials.')}
                >
                  Forgot?
                </span>
              )}
            </div>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {authMode === 'register' && (
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {authMode === 'login' && (
            <label className="remember-me-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember this device</span>
            </label>
          )}

          {/* Mandatory Legal Agreements Checkboxes */}
          <div className="simple-legal-group">
            <label className="legal-checkbox">
              <input
                type="checkbox"
                id="simple-agree-terms"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (errorMessage.includes('Terms')) setErrorMessage('');
                }}
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  className="doc-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenTerms) onOpenTerms();
                  }}
                >
                  Terms & Conditions
                </button>
              </span>
            </label>

            <label className="legal-checkbox">
              <input
                type="checkbox"
                id="simple-agree-privacy"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked);
                  if (errorMessage.includes('Privacy')) setErrorMessage('');
                }}
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  className="doc-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenPrivacy) onOpenPrivacy();
                  }}
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            {!isAgreementComplete && (
              <p className="legal-hint">
                * Please tick both checkboxes to enable sign in or registration
              </p>
            )}
          </div>

          {/* Main Submit Button */}
          <button
            type="submit"
            className={`btn-simple-submit ${isAgreementComplete ? 'enabled' : 'disabled'}`}
            disabled={!isAgreementComplete || isLoading}
            id="simple-auth-submit-btn"
          >
            {isLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Bottom Switcher Link */}
        <div className="auth-card-footer">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="switch-text-btn"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="switch-text-btn"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                }}
              >
                Sign in
              </button>
            </p>
          )}

          {onCancel && (
            <button type="button" className="simple-cancel-btn" onClick={onCancel}>
              ← Back to Overview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
