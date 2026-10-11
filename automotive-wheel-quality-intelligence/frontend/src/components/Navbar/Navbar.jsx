import React from 'react';
import './Navbar.css';

export default function Navbar({
  activeTab,
  setActiveTab,
  onSimulateNewScan,
  onReplayIntro,
  currentUser,
  onSignOut,
  onOpenAuth,
}) {
  return (
    <header className="navbar-container">
      {/* =========================================================================
          ROW 1: BRAND LOGO + CORE INSPECTION NAVIGATION
          ========================================================================= */}
      <div className="navbar-row navbar-row-top">
        <div className="navbar-left">
          <div className="brand-logo" onClick={() => setActiveTab('landing')}>
            <div className="logo-wheel-icon">
              <svg viewBox="0 0 40 40" width="32" height="32" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 2" />
                <circle cx="20" cy="20" r="12" stroke="#00f0ff" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="5" fill="#38bdf8" />
                <line x1="20" y1="2" x2="20" y2="8" stroke="#38bdf8" strokeWidth="2" />
                <line x1="20" y1="32" x2="20" y2="38" stroke="#38bdf8" strokeWidth="2" />
                <line x1="2" y1="20" x2="8" y2="20" stroke="#38bdf8" strokeWidth="2" />
                <line x1="32" y1="20" x2="38" y2="20" stroke="#38bdf8" strokeWidth="2" />
                <line x1="7" y1="7" x2="11" y2="11" stroke="#00f0ff" strokeWidth="2" />
                <line x1="29" y1="29" x2="33" y2="33" stroke="#00f0ff" strokeWidth="2" />
                <line x1="7" y1="33" x2="11" y2="29" stroke="#00f0ff" strokeWidth="2" />
                <line x1="29" y1="11" x2="33" y2="7" stroke="#00f0ff" strokeWidth="2" />
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title brand-title-clean">
                WHEEL QUALITY INTELLIGENCE
              </div>
              <div className="brand-tagline">
                Inspect. Detect. Predict. Prevent
              </div>
            </div>
          </div>
        </div>

        <nav className="navbar-nav navbar-nav-primary">
          <button
            className={`nav-tab-btn ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Overview
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Inspection Cockpit
            <span className="tab-pill">Live</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Inspection History
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'flowchart' ? 'active' : ''}`}
            onClick={() => setActiveTab('flowchart')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
            </svg>
            Inspection Flowchart
          </button>
        </nav>
      </div>

      {/* =========================================================================
          ROW 2: SECONDARY SECTIONS + INSPECTOR CONTROLS, PROFILE & SIGN OUT
          ========================================================================= */}
      <div className="navbar-row navbar-row-bottom">
        <nav className="navbar-nav navbar-nav-secondary">
          <button
            className={`nav-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Batches & Machines
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Team
          </button>

          {currentUser && (
            <button
              className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              id="nav-profile-tab"
              title="View Inspector Profile & Login Details"
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Profile
              <span className="tab-pill profile-online-pill">Active</span>
            </button>
          )}
        </nav>

        <div className="navbar-secondary-actions">
          <button className="btn btn-secondary btn-sm" onClick={onSimulateNewScan} title="Cycle sample to next wheel specimen">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Cycle Sample
          </button>

          {currentUser ? (
            <div className="navbar-user-section">
              <button
                className={`navbar-profile-chip ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                title={`Logged in as ${currentUser.name} • Click to open Profile & Terminal Details`}
                id="navbar-profile-trigger"
              >
                <div className="navbar-profile-avatar">
                  {currentUser.picture ? (
                    <img
                      src={currentUser.picture}
                      alt={currentUser.name}
                      className="navbar-avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="navbar-avatar-fallback">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <span className="user-status-dot online"></span>
                </div>

                <div className="navbar-profile-info">
                  <span className="user-name-text">{currentUser.name}</span>
                  <span className="user-role-label">
                    {currentUser.role === 'QA_LEAD' ? 'QA Lead' : 'Inspector'}
                  </span>
                </div>
              </button>

              <button
                className="btn-user-signout"
                onClick={onSignOut}
                title="Log out of quality terminal session"
                id="navbar-quick-signout"
              >
                <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              className={`btn btn-primary btn-sm btn-signin ${activeTab === 'auth' ? 'active' : ''}`}
              onClick={onOpenAuth}
            >
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
