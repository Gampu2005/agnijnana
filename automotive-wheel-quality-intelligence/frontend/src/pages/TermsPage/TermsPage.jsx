import React from 'react';
import './TermsPage.css';

export default function TermsPage({ onAccept, onBack }) {
  return (
    <div className="terms-page-container">
      <div className="terms-card">
        {/* Header HUD */}
        <div className="terms-header">
          <div className="terms-header-left">
            <div className="terms-icon-box">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <div className="terms-sub-badge">LEGAL COMPLIANCE • STANDARD IATF-16949 / ISO-14224</div>
              <h1 className="terms-title">Terms & Conditions of Operational Use</h1>
              <p className="terms-effective">Effective Date: October 2026 | System Version: v2.4.0-Production</p>
            </div>
          </div>
          {onBack && (
            <button className="btn btn-secondary terms-back-btn" onClick={onBack}>
              ← Return
            </button>
          )}
        </div>

        {/* Document Body */}
        <div className="terms-content-scroller">
          <div className="terms-alert-callout">
            <div className="callout-icon">⚠️</div>
            <div>
              <strong>MANDATORY NOTICE FOR PLANT OPERATORS & QA ENGINEERS:</strong>
              <p>
                By accessing WHEEL QUALITY INTELLIGENCE, you acknowledge that automated vision inferences,
                depth-calibrated radial defect segmentations, and scrap dispositions directly govern automotive safety-critical wheel assembly lines.
              </p>
            </div>
          </div>

          <section className="terms-section">
            <h2>1. System Scope & Industrial Purpose</h2>
            <p>
              The WHEEL QUALITY INTELLIGENCE platform (&quot;System&quot;) is an AI-augmented automated optical inspection (AOI),
              ultrasonic telemetry, and non-destructive testing (NDT) pipeline deployed to detect casting porosity, rim impact deformation,
              bead-seat cracks, runout irregularities, and radial fissures on aluminum alloy wheels and tyre assemblies.
            </p>
            <p>
              Access to this metrology console is strictly limited to authorized automotive assembly personnel, certified non-destructive testing engineers,
              and plant quality supervisors holding active organizational credentials.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. User Authentication & Clearance Role Boundaries</h2>
            <p>
              Users are assigned specific Role-Based Access Control (RBAC) tiers:
            </p>
            <ul>
              <li><strong>QA Metrology Lead:</strong> Full authorization to execute final scrap, rework, or release sign-offs, and generate cryptographically validated inspection certificates.</li>
              <li><strong>Line Operator:</strong> Observation, camera triggering, batch registration, and defect tagging clearance only. Final disposition overrides remain guarded.</li>
              <li><strong>Enterprise Auditor:</strong> Read-only access to immutable historical specimen logs and ISO compliance telemetry archives.</li>
            </ul>
            <p>
              Sharing authentication credentials, circumventing multi-factor clearance, or falsifying batch telemetry violates automotive assembly protocols.
            </p>
          </section>

          <section className="terms-section">
            <h2>3. AI Defect Detection & Autonomous Disposition Disclaimers</h2>
            <p>
              While the deep computer vision models operate at high validation accuracy (F1-score &gt; 0.985 for critical crack propagation),
              the System serves as an intelligent decision-support instrument under standard IATF 16949 clauses:
            </p>
            <ul>
              <li>All specimens tagged with <strong>CRITICAL</strong> severity (safety-critical structural fissure or bead-seat split) require immediate line quarantine and physical NDT secondary verification prior to recycling/scrapping.</li>
              <li>Calculated runout metrics and crack depth estimations are calibrated to optical and acoustic sensor resolutions (&plusmn;0.05 mm precision).</li>
              <li>Users must calibrate machine vision cameras and coordinate lighting benches in accordance with standard plant preventative maintenance schedules.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Sensor Telemetry & Equipment Interfacing</h2>
            <p>
              The System connects to live casting machines, CNC lathes, x-ray scanners, and automated conveyor belts via industrial WebSocket and OPC-UA protocols.
              Users agree not to tamper with hardware sensor polling intervals, spoof mock telemetry, or inject malicious payloads into inspection endpoints.
            </p>
          </section>

          <section className="terms-section">
            <h2>5. Intellectual Property & Casting Metrology Models</h2>
            <p>
              All neural network weights, root-cause causal DAG networks, runout compensation algorithms, and visual inspection datasets
              are the proprietary trade secrets of AgniJnana Quality Systems. Reverse engineering, model extraction, or unauthorized scraping of inspection imagery is strictly prohibited.
            </p>
          </section>

          <section className="terms-section">
            <h2>6. Liability Limitation & Plant Safety</h2>
            <p>
              Under no circumstances shall AgniJnana Quality Systems be held liable for secondary line stoppages, downstream vehicle assembly delays,
              or mechanical warranty disputes resulting from user operational error, sensor misalignment, or intentional override of AI safety tripwires.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Governing Standards & Compliance</h2>
            <p>
              These terms are governed under international automotive quality specifications, including <strong>IATF 16949:2016</strong>,
              <strong>ISO 9001:2015</strong>, and <strong>ISO 14224 Equipment Reliability Standards</strong>.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="terms-footer">
          <div className="terms-footer-text">
            <span>By proceeding to sign in, you confirm your legal agreement to these conditions.</span>
          </div>
          <div className="terms-actions-btns">
            {onBack && (
              <button className="btn btn-secondary" onClick={onBack}>
                Decline & Exit
              </button>
            )}
            {onAccept && (
              <button className="btn btn-primary" onClick={onAccept}>
                ✓ I Accept Terms & Conditions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
