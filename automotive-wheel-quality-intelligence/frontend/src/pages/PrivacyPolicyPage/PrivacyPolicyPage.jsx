import React from 'react';
import './PrivacyPolicyPage.css';

export default function PrivacyPolicyPage({ onAccept, onBack }) {
  return (
    <div className="privacy-page-container">
      <div className="privacy-card">
        {/* Header HUD */}
        <div className="privacy-header">
          <div className="privacy-header-left">
            <div className="privacy-icon-box">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div className="privacy-sub-badge">DATA GOVERNANCE • IATF 16949 / GDPR AUDIT COMPLIANT</div>
              <h1 className="privacy-title">Data Privacy & Metrology Information Policy</h1>
              <p className="privacy-effective">Effective Date: October 2026 | Document ID: POL-IATF-PRIVACY-042</p>
            </div>
          </div>
          {onBack && (
            <button className="btn btn-secondary privacy-back-btn" onClick={onBack}>
              ← Return
            </button>
          )}
        </div>

        {/* Document Body */}
        <div className="privacy-content-scroller">
          <div className="privacy-alert-callout">
            <div className="callout-icon">🔒</div>
            <div>
              <strong>AUTOMOTIVE INDUSTRIAL DATA PROTECTION NOTICE:</strong>
              <p>
                WHEEL QUALITY INTELLIGENCE enforces zero-trust plant telemetry isolation.
                Your enterprise inspection scans, wheel serial identifiers, and authentication credentials are encrypted using AES-256 and stored in compliant manufacturing audit logs.
              </p>
            </div>
          </div>

          <section className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              To maintain real-time automated defect classification, runout measurements, and traceable scrap dispositions, our systems process:
            </p>
            <ul>
              <li><strong>User Identity & Credentials:</strong> Full name, verified organizational work email, plant location, role clearance, and session tokens.</li>
              <li><strong>Google OAuth Data:</strong> When authenticating via Google Sign-In, we receive your Google ID token, public name, email address, and verified profile image. We never access your Google contacts, emails, or personal drive files.</li>
              <li><strong>Specimen Visual Imagery:</strong> High-resolution optical camera frames, infrared thermal maps, and radiography scans of wheel rim specimens uploaded or captured at the inspection cockpit.</li>
              <li><strong>Machine & Batch Telemetry:</strong> Machine spindle numbers, casting melt temperatures, conveyor velocities, cycle times, and ISO 14224 failure mode classification codes.</li>
              <li><strong>Audit Action Logs:</strong> Digital timestamps of who reviewed, quarantined, reworked, or signed off on any specific wheel certificate.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. Purpose of Telemetry & Image Processing</h2>
            <p>
              We process specimen data strictly to:
            </p>
            <ul>
              <li>Execute real-time deep learning inference (defect bounding boxes, confidence score, defect surface area calculation).</li>
              <li>Compute runout harmonics, crack propagation risk, and root-cause failure causal trees.</li>
              <li>Generate tamper-evident, verifiable Quality Inspection Certificates for assembly line compliance.</li>
              <li>Send critical defect threshold alerts and cross-batch propagation warnings to shopfloor supervisors.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Third-Party Authentication & Google OAuth Services</h2>
            <p>
              Our authentication pipeline integrates with <strong>Google Identity Services (GIS)</strong> for enterprise single sign-on (SSO):
            </p>
            <ul>
              <li>Google OAuth credentials are exchanged securely over HTTPS/TLS 1.3 directly with Google&apos;s OAuth 2.0 authorization servers.</li>
              <li>No passwords or private authentication secrets from your Google account are ever stored on our application servers.</li>
              <li>Tokens are validated against Google&apos;s public keys and cached strictly within temporary, encrypted session storage.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Data Retention & IATF 16949 Traceability Standard</h2>
            <p>
              In compliance with global automotive manufacturing guidelines (IATF 16949 Clause 7.5.3.2), inspection records, defect images,
              and lead inspector signatures are retained for a minimum of <strong>five (5) years</strong> from the batch manufacture date
              to ensure full lifecycle traceability in the event of OEM recall investigations.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Data Security & Encryption Standards</h2>
            <p>
              All data transmitted between the web cockpit, backend FastAPI services, and edge camera rigs is encrypted using <strong>TLS 1.3</strong>.
              All persistent specimen records and inspection certificates are encrypted at rest using <strong>AES-256</strong>.
              Internal access is governed strictly by Least Privilege Role-Based Access Control (RBAC).
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. User Rights & Data Governance Contacts</h2>
            <p>
              Plant operators and QA leads have the right to inspect their authentication log activity, request data export in JSON/PDF format,
              or query data retention status through their designated Plant IT Quality Representative or by contacting:
              <br />
              <strong style={{ color: '#38bdf8' }}>privacy-compliance@wheelquality.internal</strong>
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="privacy-footer">
          <div className="privacy-footer-text">
            <span>By proceeding to sign in, you confirm your consent to this Privacy Policy.</span>
          </div>
          <div className="privacy-actions-btns">
            {onBack && (
              <button className="btn btn-secondary" onClick={onBack}>
                Decline & Exit
              </button>
            )}
            {onAccept && (
              <button className="btn btn-primary" onClick={onAccept}>
                ✓ I Accept Privacy Policy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
