import React, { useState } from 'react';
import './ProfilePage.css';

export default function ProfilePage({
  user,
  onSignOut,
  onNavigate,
  onNotify,
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fallback profile if none stored
  const profile = user || {
    name: 'Ganesh (Quality Lead)',
    email: 'ganesh.quality@automotive.internal',
    picture: null,
    role: 'QA_LEAD',
    organization: 'Plant Hub 04 - High-Pressure Die Casting',
    authProvider: 'google',
    signedInAt: new Date().toISOString(),
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <div className="profile-page-container">
      {/* Background Decorative Tech Lines */}
      <div className="profile-bg-glow"></div>

      <div className="profile-wrapper">
        {/* Breadcrumb & Navigation */}
        <div className="profile-top-bar">
          <button
            className="profile-back-btn"
            onClick={() => onNavigate && onNavigate('dashboard')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Inspection Cockpit
          </button>

          <div className="profile-system-tag">
            <span className="pulsing-beacon"></span>
            <span>TERMINAL SESSION ACTIVE</span>
          </div>
        </div>

        {/* Hero Card */}
        <section className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-avatar-wrapper">
              {profile.picture ? (
                <img
                  src={profile.picture}
                  alt={profile.name}
                  className="profile-avatar-img"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="profile-avatar-fallback">
                  <svg viewBox="0 0 40 40" width="44" height="44" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M20 2a18 18 0 100 36 18 18 0 000-36zM10.22 30.74a15.96 15.96 0 0119.56 0A13.94 13.94 0 0020 28c-3.64 0-6.93 1.39-9.78 3.74zM20 8a6 6 0 100 12 6 6 0 000-12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <div className="profile-avatar-badge" title="Online">
                <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="profile-identity">
              <div className="profile-role-pill">
                {profile.role === 'QA_LEAD' ? 'QA METROLOGY LEAD' : 'OPERATIONS INSPECTOR'}
              </div>
              <h1 className="profile-name">{profile.name}</h1>
              <div className="profile-email">
                <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{profile.email}</span>
              </div>
              <div className="profile-org">
                <svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{profile.organization || 'Automotive Wheel Quality Intelligence'}</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-actions">
            <button
              className="btn btn-logout-main"
              onClick={() => setShowLogoutConfirm(true)}
              id="profile-logout-button"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </section>

        {/* Navigation Action Bar */}
        <div className="profile-footer-actions">
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate && onNavigate('history')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Review Inspection History
          </button>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate && onNavigate('dashboard')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Launch Inspection Cockpit
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop-logout" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="logout-card-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ef4444" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h3>Terminate Quality Session?</h3>
            <p>
              Logging out will clear your active terminal session and return you to
              the platform sign-in screen.
            </p>
            <div className="logout-confirm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger-logout"
                onClick={handleConfirmLogout}
                id="confirm-logout-action-btn"
              >
                Log Out Successfully
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
