import React, { useState, useEffect } from 'react';
import {
  getStoredInspectionHistory,
  resetInspectionHistory,
  clearInspectionHistory,
} from '../../services/historyStorage';
import './HistoryPage.css';

export default function HistoryPage({
  onLoadInCockpit,
  onOpenCertificate,
  onNotify,
}) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PASS' | 'CRITICAL' | 'REWORK'
  const [filterComponent, setFilterComponent] = useState('ALL'); // 'ALL' | 'RIM' | 'TYRE'
  const [viewMode, setViewMode] = useState('CARDS'); // 'CARDS' | 'TABLE'
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    setHistory(getStoredInspectionHistory());
  }, []);

  const handleRefresh = () => {
    setHistory(getStoredInspectionHistory());
    if (onNotify) onNotify('Refreshed inspection history audit trail.', 'info');
  };

  const handleResetBenchmark = () => {
    const baseline = resetInspectionHistory();
    setHistory(baseline);
    if (onNotify) onNotify('Reset inspection history to verified 5-specimen benchmark audit.', 'info');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all stored inspection records?')) {
      const empty = clearInspectionHistory();
      setHistory(empty);
      if (onNotify) onNotify('Inspection history cleared.', 'warning');
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      if (onNotify) onNotify('No inspection records to export.', 'warning');
      return;
    }

    const headers = [
      'Record_ID',
      'Timestamp',
      'Wheel_ID',
      'Model',
      'Alloy',
      'Batch_ID',
      'Machine_ID',
      'Status',
      'Disposition',
      'Severity',
      'Defect_Classification',
      'Confidence',
      'Zone',
      'Root_Cause',
      'SOP_Code',
    ];

    const rows = history.map((r) => [
      r.id,
      r.timestamp,
      r.wheel_id,
      `"${(r.wheel_model || '').replace(/"/g, '""')}"`,
      `"${(r.alloy || '').replace(/"/g, '""')}"`,
      r.batch_id,
      r.machine_id,
      r.status,
      r.disposition,
      r.severity,
      `"${(r.defect_type || '').replace(/"/g, '""')}"`,
      `${(r.confidence * 100).toFixed(1)}%`,
      `"${(r.zone || '').replace(/"/g, '""')}"`,
      `"${(r.root_cause || '').replace(/"/g, '""')}"`,
      r.sop_code,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WQI_INSPECTION_AUDIT_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link);
    if (onNotify) onNotify('Exported inspection audit records as CSV.', 'success');
  };

  const handleExportJSON = () => {
    if (history.length === 0) {
      if (onNotify) onNotify('No inspection records to export.', 'warning');
      return;
    }
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WQI_INSPECTION_AUDIT_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link);
    if (onNotify) onNotify('Exported inspection audit records as JSON.', 'success');
  };

  // Filtered dataset
  const filtered = history.filter((item) => {
    // Search match
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchId = (item.wheel_id || '').toLowerCase().includes(q);
      const matchBatch = (item.batch_id || '').toLowerCase().includes(q);
      const matchDefect = (item.defect_type || '').toLowerCase().includes(q);
      const matchMach = (item.machine_id || '').toLowerCase().includes(q);
      const matchModel = (item.wheel_model || '').toLowerCase().includes(q);
      if (!matchId && !matchBatch && !matchDefect && !matchMach && !matchModel) {
        return false;
      }
    }

    // Status filter
    if (filterStatus === 'PASS' && item.status !== 'CONFORMING') return false;
    if (filterStatus === 'CRITICAL' && item.severity !== 'Critical') return false;
    if (filterStatus === 'REWORK' && item.severity !== 'Low') return false;

    // Component filter
    if (filterComponent === 'RIM' && item.component !== 'rim') return false;
    if (filterComponent === 'TYRE' && item.component !== 'tyre') return false;

    return true;
  });

  // KPI Calculations
  const totalCount = history.length;
  const passCount = history.filter((h) => h.status === 'CONFORMING').length;
  const critCount = history.filter((h) => h.severity === 'Critical').length;
  const reworkCount = history.filter((h) => h.severity === 'Low').length;
  const fpyRate = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : '100.0';

  return (
    <div className="history-page">
      {/* Top Banner & Header */}
      <div className="history-header">
        <div className="history-title-group">
          <div className="history-icon-badge">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div>
            <div className="history-sub-badge mono">
              <span>AUDIT TRAIL • IATF 16949 COMPLIANT REGISTRY</span>
            </div>
            <h1 className="history-main-title">Inspection Run History</h1>
            <p className="history-desc">
              Immutable archive of all previously ingested wheel and tyre specimens, localized defect metrology, and disposition outcomes.
            </p>
          </div>
        </div>

        <div className="history-actions-group">
          <button className="btn btn-secondary btn-sm" onClick={handleRefresh} title="Reload latest records">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Download CSV Spreadsheet">
            Export CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportJSON} title="Download JSON Archive">
            Export JSON
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleResetBenchmark} title="Reset to Factory Baseline">
            Reset Benchmark
          </button>
          {history.length > 0 && (
            <button className="btn btn-secondary btn-sm text-critical" onClick={handleClearHistory} title="Clear history">
              Clear Log
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="history-kpi-ribbon">
        <div className="kpi-card">
          <span className="kpi-label mono">TOTAL INSPECTED RUNS</span>
          <div className="kpi-val mono text-cyan">{totalCount}</div>
          <span className="kpi-sub">Optical & X-Ray Scans</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label mono">FIRST PASS YIELD (FPY)</span>
          <div className="kpi-val mono text-emerald">{fpyRate}%</div>
          <span className="kpi-sub">{passCount} Conforming Assemblies</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label mono">CRITICAL SCRAP QUARANTINE</span>
          <div className="kpi-val mono text-critical">{critCount}</div>
          <span className="kpi-sub">Structural Safety Faults</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label mono">ROBOTIC REWORK MARGIN</span>
          <div className="kpi-val mono text-warning">{reworkCount}</div>
          <span className="kpi-sub">Polishing & Bead Buffer</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label mono">MEAN CYCLE TAKT</span>
          <div className="kpi-val mono text-emerald">34 ms</div>
          <span className="kpi-sub">Real-Time Metrology</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="history-toolbar">
        <div className="toolbar-search-box">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search by Specimen ID, Batch, Machine, or Defect..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="toolbar-filters-group">
          <div className="filter-button-group">
            <button
              className={`pill-filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All Status ({totalCount})
            </button>
            <button
              className={`pill-filter-btn ${filterStatus === 'PASS' ? 'active' : ''}`}
              onClick={() => setFilterStatus('PASS')}
            >
              Conforming ({passCount})
            </button>
            <button
              className={`pill-filter-btn ${filterStatus === 'CRITICAL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('CRITICAL')}
            >
              Critical Scrap ({critCount})
            </button>
            <button
              className={`pill-filter-btn ${filterStatus === 'REWORK' ? 'active' : ''}`}
              onClick={() => setFilterStatus('REWORK')}
            >
              Rework ({reworkCount})
            </button>
          </div>

          <div className="filter-button-group">
            <button
              className={`pill-filter-btn ${filterComponent === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterComponent('ALL')}
            >
              All Types
            </button>
            <button
              className={`pill-filter-btn ${filterComponent === 'RIM' ? 'active' : ''}`}
              onClick={() => setFilterComponent('RIM')}
            >
              Rims
            </button>
            <button
              className={`pill-filter-btn ${filterComponent === 'TYRE' ? 'active' : ''}`}
              onClick={() => setFilterComponent('TYRE')}
            >
              Tyres
            </button>
          </div>

          {/* View Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'CARDS' ? 'active' : ''}`}
              onClick={() => setViewMode('CARDS')}
              title="Card Grid View"
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'TABLE' ? 'active' : ''}`}
              onClick={() => setViewMode('TABLE')}
              title="Table Audit View"
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Cards or Table */}
      {filtered.length === 0 ? (
        <div className="history-empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No matching inspection records found</h3>
          <p>Try adjusting your search query or status filter to see historical records.</p>
          <button className="btn btn-primary btn-sm" onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); setFilterComponent('ALL'); }}>
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'CARDS' ? (
        /* CARDS VIEW */
        <div className="history-cards-grid">
          {filtered.map((item) => {
            const isPass = item.status === 'CONFORMING';
            const isCrit = item.severity === 'Critical';

            return (
              <div
                key={item.id}
                className={`history-card ${isPass ? 'card-pass' : isCrit ? 'card-crit' : 'card-warn'}`}
                onClick={() => setSelectedRecord(item)}
              >
                {/* Thumbnail Header */}
                <div className="card-thumb-area">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.wheel_id} className="card-image-preview" />
                  ) : (
                    <div className="card-svg-preview">
                      <svg viewBox="0 0 100 100" width="80" height="80">
                        <circle cx="50" cy="50" r="45" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                        <circle cx="50" cy="50" r="36" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                        <line x1="50" y1="50" x2="50" y2="10" stroke="#64748b" strokeWidth="4" />
                        <line x1="50" y1="50" x2="88" y2="38" stroke="#64748b" strokeWidth="4" />
                        <line x1="50" y1="50" x2="74" y2="82" stroke="#64748b" strokeWidth="4" />
                        <line x1="50" y1="50" x2="26" y2="82" stroke="#64748b" strokeWidth="4" />
                        <line x1="50" y1="50" x2="12" y2="38" stroke="#64748b" strokeWidth="4" />
                        <circle cx="50" cy="50" r="16" fill="#0284c7" stroke="#00f0ff" strokeWidth="1.5" />
                        <circle cx="50" cy="50" r="6" fill="#070b14" />
                        {/* Defect Highlight if any */}
                        {item.location && (
                          <rect
                            x={item.location.x}
                            y={item.location.y}
                            width={Math.max(12, item.location.width)}
                            height={Math.max(12, item.location.height)}
                            fill="rgba(239, 68, 68, 0.4)"
                            stroke="#ef4444"
                            strokeWidth="2"
                          />
                        )}
                      </svg>
                    </div>
                  )}

                  {/* Disposition Stamp */}
                  <div className={`card-stamp-pill ${isPass ? 'stamp-pass' : isCrit ? 'stamp-crit' : 'stamp-warn'}`}>
                    {isPass ? 'LINE RELEASE' : item.disposition.replace(/_/g, ' ')}
                  </div>

                  <span className="card-timestamp mono">{item.timestamp}</span>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="card-id-row">
                    <span className="card-wheel-id mono">{item.wheel_id}</span>
                    <span className={`badge ${isPass ? 'badge-pass' : isCrit ? 'badge-critical' : 'badge-warning'}`}>
                      {isPass ? 'CONFORMING' : item.severity.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="card-defect-title">
                    {item.defect_type}
                  </h3>

                  <p className="card-model-sub">
                    {item.wheel_model} • {item.rim_diameter}
                  </p>

                  <div className="card-metadata-grid mono">
                    <div className="card-meta-item">
                      <span className="meta-label">BATCH:</span>
                      <span className="meta-val">{item.batch_id}</span>
                    </div>
                    <div className="card-meta-item">
                      <span className="meta-label">MACHINE:</span>
                      <span className="meta-val">{item.machine_id}</span>
                    </div>
                    <div className="card-meta-item">
                      <span className="meta-label">ZONE:</span>
                      <span className="meta-val">{item.zone}</span>
                    </div>
                    <div className="card-meta-item">
                      <span className="meta-label">CONFIDENCE:</span>
                      <span className="meta-val text-cyan">{(item.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="card-footer-buttons" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedRecord(item)}
                    >
                      Audit Details
                    </button>
                    {onLoadInCockpit && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onLoadInCockpit(item.raw_wheel_data, item.image_url)}
                        title="Load this specimen into Inspection Cockpit"
                      >
                        Load in Cockpit →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr className="mono">
                <th>TIME</th>
                <th>SPECIMEN ID</th>
                <th>PREVIEW</th>
                <th>BATCH / MACH</th>
                <th>STATUS</th>
                <th>DEFECT CLASSIFICATION</th>
                <th>CONFIDENCE</th>
                <th>ZONE</th>
                <th>DISPOSITION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isPass = item.status === 'CONFORMING';
                const isCrit = item.severity === 'Critical';

                return (
                  <tr key={item.id} className="history-table-row" onClick={() => setSelectedRecord(item)}>
                    <td className="mono text-muted text-nowrap">{item.timestamp}</td>
                    <td className="mono font-bold text-cyan">{item.wheel_id}</td>
                    <td>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.wheel_id} className="table-thumb" />
                      ) : (
                        <div className="table-svg-thumb">
                          <svg viewBox="0 0 30 30" width="28" height="28">
                            <circle cx="15" cy="15" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                            <circle cx="15" cy="15" r="5" fill="#0284c7" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="mono">
                      <div>{item.batch_id}</div>
                      <div className="text-muted text-xs">{item.machine_id}</div>
                    </td>
                    <td>
                      <span className={`badge ${isPass ? 'badge-pass' : isCrit ? 'badge-critical' : 'badge-warning'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold">{item.defect_type}</div>
                      <div className="text-muted text-xs">{item.wheel_model}</div>
                    </td>
                    <td className="mono text-cyan">{(item.confidence * 100).toFixed(1)}%</td>
                    <td className="text-xs">{item.zone}</td>
                    <td>
                      <span className={`disposition-pill ${isPass ? 'pill-pass' : isCrit ? 'pill-crit' : 'pill-warn'} mono`}>
                        {item.disposition}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="table-actions-cell">
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => setSelectedRecord(item)}
                        >
                          View
                        </button>
                        {onLoadInCockpit && (
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => onLoadInCockpit(item.raw_wheel_data, item.image_url)}
                            title="Inspect in Cockpit"
                          >
                            Cockpit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Inspection Modal */}
      {selectedRecord && (
        <div className="history-modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <div className="history-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <span className="badge badge-info mono">RECORD: {selectedRecord.id}</span>
                <h2>Specimen Inspection Audit Record</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedRecord(null)}>✕</button>
            </div>

            <div className="modal-grid-body">
              {/* Visual Preview */}
              <div className="modal-visual-col">
                <div className="modal-image-wrap">
                  {selectedRecord.image_url ? (
                    <img src={selectedRecord.image_url} alt={selectedRecord.wheel_id} className="modal-specimen-img" />
                  ) : (
                    <div className="modal-svg-wrap">
                      <svg viewBox="0 0 500 500" width="100%" height="100%">
                        <circle cx="250" cy="250" r="225" fill="#070b14" stroke="#38bdf8" strokeWidth="6" />
                        <circle cx="250" cy="250" r="185" fill="#0f172a" stroke="#475569" strokeWidth="4" />
                        <line x1="250" y1="250" x2="250" y2="60" stroke="#64748b" strokeWidth="16" />
                        <line x1="250" y1="250" x2="430" y2="190" stroke="#64748b" strokeWidth="16" />
                        <line x1="250" y1="250" x2="360" y2="410" stroke="#64748b" strokeWidth="16" />
                        <line x1="250" y1="250" x2="140" y2="410" stroke="#64748b" strokeWidth="16" />
                        <line x1="250" y1="250" x2="70" y2="190" stroke="#64748b" strokeWidth="16" />
                        <circle cx="250" cy="250" r="75" fill="#0284c7" stroke="#00f0ff" strokeWidth="3" />
                        <circle cx="250" cy="250" r="30" fill="#070b14" />
                        {selectedRecord.location && (
                          <g>
                            <rect
                              x={selectedRecord.location.x * 5}
                              y={selectedRecord.location.y * 5}
                              width={selectedRecord.location.width * 5}
                              height={selectedRecord.location.height * 5}
                              fill="rgba(239, 68, 68, 0.35)"
                              stroke="#ef4444"
                              strokeWidth="3"
                              strokeDasharray="6 3"
                            />
                            <circle
                              cx={(selectedRecord.location.x + selectedRecord.location.width / 2) * 5}
                              cy={(selectedRecord.location.y + selectedRecord.location.height / 2) * 5}
                              r="8"
                              fill="#ef4444"
                            />
                          </g>
                        )}
                      </svg>
                    </div>
                  )}
                </div>

                <div className="modal-stamp-banner mono">
                  <span className="stamp-label">FINAL AUTHORIZED DISPOSITION:</span>
                  <span className={`stamp-value ${selectedRecord.status === 'CONFORMING' ? 'text-emerald' : selectedRecord.severity === 'Critical' ? 'text-critical' : 'text-warning'}`}>
                    {selectedRecord.disposition}
                  </span>
                </div>
              </div>

              {/* Data & Root Cause Col */}
              <div className="modal-info-col">
                <div className="modal-info-section">
                  <span className="section-eyebrow">METROLOGY & HARDWARE SPECS</span>
                  <div className="modal-specs-grid mono">
                    <div><strong>SPECIMEN:</strong> {selectedRecord.wheel_id}</div>
                    <div><strong>TIMESTAMP:</strong> {selectedRecord.timestamp}</div>
                    <div><strong>MODEL:</strong> {selectedRecord.wheel_model}</div>
                    <div><strong>ALLOY:</strong> {selectedRecord.alloy}</div>
                    <div><strong>DIMENSIONS:</strong> {selectedRecord.rim_diameter} × {selectedRecord.rim_width}</div>
                    <div><strong>BATCH / HEAT:</strong> {selectedRecord.batch_id}</div>
                    <div><strong>MACHINE:</strong> {selectedRecord.machine_id}</div>
                    <div><strong>CYCLE TAKT:</strong> {selectedRecord.cycle_time_ms} ms</div>
                  </div>
                </div>

                <div className="modal-info-section">
                  <span className="section-eyebrow">DEFECT AUDIT & RISK</span>
                  <div className="defect-detail-box">
                    <div className="defect-header-row">
                      <h4 className="defect-name">{selectedRecord.defect_type}</h4>
                      <span className="badge badge-info mono">{(selectedRecord.confidence * 100).toFixed(1)}% CONFIDENCE</span>
                    </div>
                    <div className="defect-metrics-row mono">
                      <span>ZONE: {selectedRecord.zone}</span>
                      {selectedRecord.dimensions && (
                        <span>AREA: {selectedRecord.dimensions.area_mm2} mm² • DEPTH: ~{selectedRecord.dimensions.depth_est_mm} mm</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-info-section">
                  <span className="section-eyebrow">PROCESS CAUSALITY & SOP</span>
                  <div className="causality-box">
                    <div className="causality-label mono">ROOT CAUSE:</div>
                    <p className="causality-text">{selectedRecord.root_cause}</p>
                    <div className="causality-sop mono">
                      <span>CONTAINMENT SOP:</span>
                      <strong>{selectedRecord.sop_code}</strong>
                    </div>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="modal-actions-footer">
                  {onLoadInCockpit && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        onLoadInCockpit(selectedRecord.raw_wheel_data, selectedRecord.image_url);
                        setSelectedRecord(null);
                      }}
                    >
                      Inspect in Cockpit →
                    </button>
                  )}
                  {onOpenCertificate && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        onOpenCertificate(selectedRecord.raw_wheel_data);
                        setSelectedRecord(null);
                      }}
                    >
                      Quality Certificate
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
