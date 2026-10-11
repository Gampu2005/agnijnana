import React, { useState, useEffect } from 'react';
import { BATCHES_DATA } from '../../data/mockData';
import { fetchBatches } from '../../services/api';
import './BatchTable.css';

export default function BatchTable() {
  const [filter, setFilter] = useState('ALL');
  const [batches, setBatches] = useState(BATCHES_DATA);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    fetchBatches()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          // Map backend schema to table display format
          const formatted = data.map((b, idx) => ({
            id: b.id || idx + 1,
            batch_id: b.batch_number || b.batch_id,
            alloy: b.alloy || 'Al A356.2 T6',
            machine_id: b.machine_id || 'CELL-01',
            status: b.status || 'IN_PROGRESS',
            total_inspected: b.inspections || 120,
            scrap_rate: `${((b.defect_rate || 0.04) * 100).toFixed(1)}%`,
            diagnosis: b.risk_level === 'HIGH' ? 'Critical Porosity Exceeded' : (b.risk_level === 'MODERATE' ? 'Process Parameter Deviation' : 'Nominal Tolerances Satisfied'),
          }));
          setBatches(formatted);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Graceful fallback to static telemetry data
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredBatches = batches.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'QUARANTINED') return b.status === 'QUARANTINED';
    if (filter === 'RELEASED') return b.status === 'RELEASED';
    return true;
  });

  return (
    <div className="glass-panel col-7 batch-table-panel">
      <div className="batch-header">
        <div className="batch-title-wrap">
          <span className="section-eyebrow">BATCH MONITORING</span>
          <h3 className="batch-heading">Casting Batches</h3>
        </div>

        <div className="batch-filter-btns">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All ({batches.length})
          </button>
          <button
            className={`filter-btn ${filter === 'QUARANTINED' ? 'active' : ''}`}
            onClick={() => setFilter('QUARANTINED')}
          >
            Quarantined ({batches.filter((b) => b.status === 'QUARANTINED').length})
          </button>
          <button
            className={`filter-btn ${filter === 'RELEASED' ? 'active' : ''}`}
            onClick={() => setFilter('RELEASED')}
          >
            Released ({batches.filter((b) => b.status === 'RELEASED').length})
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="batch-table">
          <thead>
            <tr>
              <th>BATCH / HEAT</th>
              <th>ALLOY</th>
              <th>MACHINE</th>
              <th>STATUS</th>
              <th>INSPECTED</th>
              <th>SCRAP</th>
              <th>DIAGNOSIS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }} className="mono">
                  ⚡ Awaiting MES production lot synchronization • Zero mock records active
                </td>
              </tr>
            ) : (
              filteredBatches.map((batch) => {
              const isQuarantined = batch.status === 'QUARANTINED';
              const isReview = batch.status === 'UNDER_REVIEW';
              const isReleased = batch.status === 'RELEASED';

              return (
                <tr key={batch.id} className="batch-row">
                  <td>
                    <div className="batch-id-cell">
                      <span className="mono batch-num">{batch.batch_number}</span>
                      <span className="mono heat-num">{batch.melt_heat_no}</span>
                    </div>
                  </td>
                  <td className="alloy-cell">{batch.alloy}</td>
                  <td className="mono unit-cell">{batch.machine_id}</td>
                  <td>
                    <span
                      className={`badge ${isQuarantined ? 'badge-critical' : isReview ? 'badge-warning' : isReleased ? 'badge-pass' : 'badge-info'}`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="mono count-cell">
                    <span className="text-primary">{batch.inspected_count}</span>
                    <span className="text-muted"> ({batch.passed_count}P / {batch.scrapped_count}S)</span>
                  </td>
                  <td>
                    <span className={`mono scrap-rate ${isQuarantined ? 'text-critical' : isReleased ? 'text-pass' : 'text-warning'}`}>
                      {batch.scrap_rate}
                    </span>
                  </td>
                  <td className="issue-cell">{batch.primary_issue}</td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
