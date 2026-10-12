import { SAMPLE_WHEELS } from '../data/mockData';

const STORAGE_KEY = 'wqi_inspection_history';

// Generate default baseline history from the 5 audited specimens
export function getInitialHistory() {
  return [
    {
      id: 'HIST-2026-005',
      timestamp: '2026-10-11 16:35:12',
      wheel_id: 'WHEEL-AL-PASS-01',
      wheel_model: 'Aero-Dynamic Cast Monoblock Wheel',
      alloy: 'Aluminium A356.2 T6 / Radial Ply Casing',
      rim_diameter: '19 inch',
      rim_width: '8.5J',
      spoke_count: 5,
      batch_id: 'BATCH-AL-PASS-01',
      machine_id: 'LPDC-Cell-01',
      production_cycle: 14220,
      status: 'CONFORMING',
      disposition: 'LINE_RELEASE',
      severity: 'Pass',
      defect_type: 'Conforming Specimen (Defect-Free)',
      confidence: 0.985,
      zone: 'Machined Spoke & Bead Seat',
      dimensions: null,
      location: null,
      image_url: null,
      thumbnail_type: 'svg',
      root_cause: 'Nominal casting thermal cycle and uniform vulcanization parameters maintained.',
      sop_code: 'SOP-PASS-RELEASE-01',
      component: 'assembly',
      inspector: 'QA-ENG-4912',
      cycle_time_ms: 34,
      raw_wheel_data: SAMPLE_WHEELS[0],
    },
    {
      id: 'HIST-2026-004',
      timestamp: '2026-10-11 16:32:45',
      wheel_id: 'WHEEL-RIM-PORO-02',
      wheel_model: 'Alloy Wheel & Tyre Assembly',
      alloy: 'Aluminium A356.2 T6 / Radial Ply Casing',
      rim_diameter: '18 inch',
      rim_width: '8.0J',
      spoke_count: 5,
      batch_id: 'BATCH-B0127',
      machine_id: 'HPDC-Unit-02',
      production_cycle: 14221,
      status: 'DEFECT_DETECTED',
      disposition: 'SCRAP_QUARANTINE',
      severity: 'Critical',
      defect_type: 'Gas Porosity Cluster',
      confidence: 0.942,
      zone: 'Outer Rim Lip Sector 4',
      dimensions: { length_mm: 14.8, depth_est_mm: 1.9, area_mm2: 28.1 },
      location: { x: 58, y: 26, width: 16, height: 18 },
      image_url: null,
      thumbnail_type: 'svg',
      root_cause: 'Gas entrapment from insufficient melt degassing nitrogen flow during HPDC shot.',
      sop_code: 'SOP-AL-CAST-071',
      component: 'rim',
      inspector: 'QA-ENG-4912',
      cycle_time_ms: 34,
      raw_wheel_data: SAMPLE_WHEELS[1],
    },
    {
      id: 'HIST-2026-003',
      timestamp: '2026-10-11 16:28:10',
      wheel_id: 'WHEEL-TYRE-BULGE-03',
      wheel_model: 'Performance Low-Profile Wheel Assembly',
      alloy: 'Aluminium A356.2 T6 / Radial Casing',
      rim_diameter: '19 inch',
      rim_width: '8.5J',
      spoke_count: 5,
      batch_id: 'BATCH-T-2026-X12',
      machine_id: 'CURING-PRESS-04',
      production_cycle: 14222,
      status: 'DEFECT_DETECTED',
      disposition: 'SCRAP_QUARANTINE',
      severity: 'Critical',
      defect_type: 'Sidewall Bulge',
      confidence: 0.945,
      zone: 'Lower Sidewall Quadrant 1',
      dimensions: { length_mm: 22.4, depth_est_mm: 3.2, area_mm2: 45.6 },
      location: { x: 72, y: 46, width: 15, height: 17 },
      image_url: null,
      thumbnail_type: 'svg',
      root_cause: 'Carcass cord ply tension imbalance during building drum shaping and curing bladder inflation.',
      sop_code: 'SOP-TYRE-VULC-04',
      component: 'tyre',
      inspector: 'QA-ENG-4912',
      cycle_time_ms: 34,
      raw_wheel_data: SAMPLE_WHEELS[2],
    },
    {
      id: 'HIST-2026-002',
      timestamp: '2026-10-11 16:21:05',
      wheel_id: 'WHEEL-TYRE-PUNC-04',
      wheel_model: 'Commercial Heavy-Duty Wheel Assembly',
      alloy: 'Aluminium Cast / Steel-Belted Radial',
      rim_diameter: '17 inch',
      rim_width: '7.5J',
      spoke_count: 6,
      batch_id: 'BATCH-T-2026-X18',
      machine_id: 'CURING-PRESS-04',
      production_cycle: 14223,
      status: 'DEFECT_DETECTED',
      disposition: 'SCRAP_QUARANTINE',
      severity: 'Critical',
      defect_type: 'Tread Puncture',
      confidence: 0.955,
      zone: 'Tread Center Groove Sector 2',
      dimensions: { length_mm: 8.5, depth_est_mm: 5.2, area_mm2: 18.0 },
      location: { x: 50, y: 50, width: 14, height: 14 },
      image_url: null,
      thumbnail_type: 'svg',
      root_cause: 'Foreign metal debris on conveyor belt line post-curing pierced green rubber casing.',
      sop_code: 'SOP-LINE-CLEAN-02',
      component: 'tyre',
      inspector: 'QA-ENG-4912',
      cycle_time_ms: 34,
      raw_wheel_data: SAMPLE_WHEELS[3],
    },
    {
      id: 'HIST-2026-001',
      timestamp: '2026-10-11 16:15:30',
      wheel_id: 'WHEEL-RIM-SCRATCH-05',
      wheel_model: 'Diamond-Cut Machined Alloy Wheel',
      alloy: 'Aluminium A356.2 T6 / Radial Ply Casing',
      rim_diameter: '19 inch',
      rim_width: '8.5J',
      spoke_count: 5,
      batch_id: 'BATCH-AL-2026-M03',
      machine_id: 'CNC-Turning-Center-03',
      production_cycle: 14224,
      status: 'DEFECT_DETECTED',
      disposition: 'ROBOTIC_REWORK',
      severity: 'Low',
      defect_type: 'Surface Handling Scratch',
      confidence: 0.925,
      zone: 'Outer Rim Machined Flange',
      dimensions: { length_mm: 16.2, depth_est_mm: 0.3, area_mm2: 12.5 },
      location: { x: 38, y: 55, width: 22, height: 8 },
      image_url: null,
      thumbnail_type: 'svg',
      root_cause: 'Part gripper pneumatic chuck pressure exceeded soft jaw cushion limit during robot de-nesting.',
      sop_code: 'SOP-ROBOT-GRIP-01',
      component: 'rim',
      inspector: 'QA-ENG-4912',
      cycle_time_ms: 34,
      raw_wheel_data: SAMPLE_WHEELS[4],
    },
  ];
}

/**
 * Retrieve inspection history from localStorage with initial fallback
 */
export function getStoredInspectionHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialHistory();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return getInitialHistory();
  } catch {
    return getInitialHistory();
  }
}

/**
 * Save / prepend a newly inspected specimen record to history
 */
export function recordInspection(wheelData, customImage = null) {
  if (!wheelData) return null;

  try {
    const existing = getStoredInspectionHistory();

    const isDefect = !!wheelData.defect && wheelData.status !== 'CONFORMING';
    const severity = isDefect ? (wheelData.defect?.severity || 'Critical') : 'Pass';
    const defectType = isDefect ? (wheelData.defect?.defect_type || 'Defect Detected') : 'Conforming Specimen (Defect-Free)';
    const disposition = isDefect
      ? (severity === 'Low' ? 'ROBOTIC_REWORK' : 'SCRAP_QUARANTINE')
      : 'LINE_RELEASE';

    const newRecord = {
      id: `HIST-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      wheel_id: wheelData.wheel_id || `WHEEL-${Math.floor(1000 + Math.random() * 9000)}`,
      wheel_model: wheelData.wheel_model || 'Alloy Wheel & Tyre Assembly',
      alloy: wheelData.alloy || 'Aluminium A356.2 T6 Cast Alloy',
      rim_diameter: wheelData.rim_diameter || '18 inch',
      rim_width: wheelData.rim_width || '8.0J',
      spoke_count: wheelData.spoke_count || 5,
      batch_id: wheelData.batch_id || 'BATCH-LIVE-01',
      machine_id: wheelData.machine_id || 'INSPECT-CELL-01',
      production_cycle: wheelData.production_cycle || 14225,
      status: isDefect ? 'DEFECT_DETECTED' : 'CONFORMING',
      disposition: disposition,
      severity: severity,
      defect_type: defectType,
      confidence: wheelData.defect?.confidence || 0.95,
      zone: wheelData.defect?.zone || 'Full Specimen Matrix',
      dimensions: wheelData.defect?.dimensions || null,
      location: wheelData.defect?.location || null,
      image_url: customImage || null,
      thumbnail_type: customImage ? 'image' : 'svg',
      root_cause: wheelData.rca?.root_cause || (isDefect ? 'Process parameter excursion detected.' : 'Nominal casting and curing parameters maintained.'),
      sop_code: wheelData.recommendation?.sop_code || (isDefect ? 'SOP-DEF-CONTAIN-01' : 'SOP-PASS-RELEASE-01'),
      component: (wheelData.defect?.zone || '').toLowerCase().includes('tyre') ? 'tyre' : 'rim',
      inspector: 'QA-ENG-4912',
      cycle_time_ms: 34,
      raw_wheel_data: wheelData,
    };

    // Prepend new record, keeping up to 100 historical entries
    const updated = [newRecord, ...existing.filter((item) => item.id !== newRecord.id)].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error('Failed to store inspection history:', err);
    return null;
  }
}

/**
 * Reset history back to the initial 5 audited baseline records
 */
export function resetInspectionHistory() {
  const initial = getInitialHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

/**
 * Clear all records
 */
export function clearInspectionHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}
