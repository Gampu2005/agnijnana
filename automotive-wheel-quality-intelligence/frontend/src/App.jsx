import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import ThreeDLanding from './components/ThreeDLanding/ThreeDLanding';
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import FlowchartPage from './pages/FlowchartPage/FlowchartPage';
import BatchesPage from './pages/BatchesPage/BatchesPage';
import TeamPage from './pages/TeamPage/TeamPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import AuthPage from './pages/AuthPage/AuthPage';
import TermsPage from './pages/TermsPage/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage/PrivacyPolicyPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Metrology3DBackground from './components/Metrology3DBackground/Metrology3DBackground';
import InspectionCertificateModal from './components/InspectionCertificateModal/InspectionCertificateModal';
import Toast from './components/Toast/Toast';
import './App.css';

export default function App() {
  // Automatically activates 3D landing animation when page is loaded / refreshed
  const [show3DIntro, setShow3DIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('auth');
  const [selectedWheelIndex, setSelectedWheelIndex] = useState(0);
  const [loadedWheelData, setLoadedWheelData] = useState(null);
  const [loadedCustomImage, setLoadedCustomImage] = useState(null);
  const [certModalWheel, setCertModalWheel] = useState(null);
  const [toast, setToast] = useState(null);
  const [userRole, setUserRole] = useState('QA_LEAD'); // 'QA_LEAD' | 'OPERATOR' (Item 8: RBAC)

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wqi_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Mandatory Legal Agreements State
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | null

  const handleNotify = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleLoadFromHistory = (wheelData, image) => {
    setLoadedWheelData(wheelData);
    setLoadedCustomImage(image);
    setActiveTab('dashboard');
    setShow3DIntro(false);
    handleNotify(`Loaded specimen ${wheelData?.wheel_id || 'record'} into Inspection Cockpit.`, 'info');
  };

  const handleToggleRole = () => {
    const next = userRole === 'QA_LEAD' ? 'OPERATOR' : 'QA_LEAD';
    setUserRole(next);
    handleNotify(
      next === 'QA_LEAD'
        ? 'Switched clearance to QA Metrology Lead (Full Disposition & Sign-Off Authorization)'
        : 'Switched clearance to Line Operator (Read & Inspection Only — Dispositions Guarded)',
      'info'
    );
  };

  const handleSimulateNewScan = () => {
    setSelectedWheelIndex((prev) => (prev + 1) % 5);
    setActiveTab('dashboard');
    setShow3DIntro(false);
    handleNotify('Cycled sample to next wheel specimen. Running vision inference...', 'info');
  };

  const handleEnterAuth = () => {
    setShow3DIntro(false);
    setActiveTab('auth');
  };

  const handleReplayIntro = () => {
    sessionStorage.removeItem('wqi-intro');
    setShow3DIntro(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('wqi_auth_user');
    setCurrentUser(null);
    setActiveTab('auth');
    handleNotify('Signed out of quality terminal session.', 'info');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    setShow3DIntro(false);
  };

  return (
    <div className="app-shell">
      {/* Ambient 3D Metrology Digital-Twin Background */}
      <Metrology3DBackground />

      {/* 3D Falling Tyre & Bouncing Logo Landing Screen */}
      {show3DIntro && (
        <ThreeDLanding
          onEnterAuth={handleEnterAuth}
        />
      )}

      {/* Top Glassmorphic Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setShow3DIntro(false);
          setActiveTab(tab);
        }}
        onSimulateNewScan={handleSimulateNewScan}
        onReplayIntro={handleReplayIntro}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenAuth={() => {
          setShow3DIntro(false);
          setActiveTab('auth');
        }}
      />

      {/* Main View Container */}
      <main className="app-main-content">
        {activeTab === 'landing' && (
          <Landing
            onLaunchDashboard={() => setActiveTab('dashboard')}
            onOpenFlowchart={() => setActiveTab('flowchart')}
            onSelectSample={(idx) => {
              setSelectedWheelIndex(idx);
              setActiveTab('dashboard');
            }}
            onOpenTerms={() => setLegalModal('terms')}
            onOpenPrivacy={() => setLegalModal('privacy')}
            currentUser={currentUser}
            onOpenProfile={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            user={currentUser}
            onSignOut={handleSignOut}
            onNavigate={(tab) => setActiveTab(tab)}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            selectedWheelIndex={selectedWheelIndex}
            setSelectedWheelIndex={setSelectedWheelIndex}
            loadedWheelData={loadedWheelData}
            loadedCustomImage={loadedCustomImage}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            onLoadInCockpit={handleLoadFromHistory}
            onOpenCertificate={(wheel) => setCertModalWheel(wheel)}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'flowchart' && (
          <FlowchartPage onLaunchDashboard={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'telemetry' && <BatchesPage />}

        {activeTab === 'team' && <TeamPage />}

        {activeTab === 'auth' && (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            onOpenTerms={() => setLegalModal('terms')}
            onOpenPrivacy={() => setLegalModal('privacy')}
            onCancel={() => setActiveTab('dashboard')}
            initialTermsAccepted={termsAccepted}
            initialPrivacyAccepted={privacyAccepted}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'terms' && (
          <TermsPage
            onAccept={() => {
              setTermsAccepted(true);
              handleNotify('Terms & Conditions accepted.', 'success');
              setActiveTab('auth');
            }}
            onBack={() => setActiveTab('auth')}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPolicyPage
            onAccept={() => {
              setPrivacyAccepted(true);
              handleNotify('Privacy Policy accepted.', 'success');
              setActiveTab('auth');
            }}
            onBack={() => setActiveTab('auth')}
          />
        )}
      </main>

      {/* Legal Document Modal (when opened from the Login/Register checkboxes) */}
      {legalModal === 'terms' && (
        <div className="legal-doc-modal-backdrop">
          <TermsPage
            onAccept={() => {
              setTermsAccepted(true);
              setLegalModal(null);
              handleNotify('Terms & Conditions accepted.', 'success');
            }}
            onBack={() => setLegalModal(null)}
          />
        </div>
      )}

      {legalModal === 'privacy' && (
        <div className="legal-doc-modal-backdrop">
          <PrivacyPolicyPage
            onAccept={() => {
              setPrivacyAccepted(true);
              setLegalModal(null);
              handleNotify('Privacy Policy accepted.', 'success');
            }}
            onBack={() => setLegalModal(null)}
          />
        </div>
      )}

      {/* Quality Certificate Modal (when opened from history or elsewhere) */}
      {certModalWheel && (
        <InspectionCertificateModal
          wheel={certModalWheel}
          onClose={() => setCertModalWheel(null)}
        />
      )}

      {/* Toast Notification Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
