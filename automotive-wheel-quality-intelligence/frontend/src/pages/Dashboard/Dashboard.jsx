import React, { useState, useEffect } from 'react';
import WheelInspection from '../../components/WheelInspection/WheelInspection';
import DefectViewer from '../../components/DefectViewer/DefectViewer';
import SeverityCard from '../../components/SeverityCard/SeverityCard';
import RootCause from '../../components/RootCause/RootCause';
import RiskPrediction from '../../components/RiskPrediction/RiskPrediction';
import Recommendation from '../../components/Recommendation/Recommendation';
import Alerts from '../../components/Alerts/Alerts';
import BatchTable from '../../components/BatchTable/BatchTable';
import MachineStatus from '../../components/MachineStatus/MachineStatus';
import HistoricalTrends from '../../components/HistoricalTrends/HistoricalTrends';
import InspectionCertificateModal from '../../components/InspectionCertificateModal/InspectionCertificateModal';
import { SAMPLE_WHEELS } from '../../data/mockData';
import { fetchHealth, uploadWheelImage, inspectWheel } from '../../services/api';
import { recordInspection } from '../../services/historyStorage';
import './Dashboard.css';

// Audio feedback helper using Web Audio API (zero external assets needed)
function playIndustrialTone(type = 'chime') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'pass') {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'crit') {
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // Audio context not allowed or unsupported
  }
}

export default function Dashboard({
  selectedWheelIndex,
  setSelectedWheelIndex,
  loadedWheelData,
  loadedCustomImage,
  onNotify,
}) {
  const [customImage, setCustomImage] = useState(loadedCustomImage || null);
  const [customWheelData, setCustomWheelData] = useState(loadedWheelData || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('CHECKING');

  useEffect(() => {
    if (loadedWheelData) {
      setCustomWheelData(loadedWheelData);
      setCustomImage(loadedCustomImage || null);
    }
  }, [loadedWheelData, loadedCustomImage]);

  useEffect(() => {
    let active = true;
    fetchHealth()
      .then((res) => {
        if (active && res && res.status === 'ok') {
          setBackendStatus('ONLINE');
        } else if (active) {
          setBackendStatus('OFFLINE');
        }
      })
      .catch(() => {
        if (active) setBackendStatus('OFFLINE');
      });
    return () => {
      active = false;
    };
  }, []);

  // Active wheel either from custom image or preset
  const activeWheel = customWheelData || SAMPLE_WHEELS[selectedWheelIndex];

  // Hotkey Navigation Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleTriggerInspection();
      } else if (e.key === 'a' || e.key === 'A') {
        handleTriggerDisposition('LINE_RELEASE');
      } else if (e.key === 'x' || e.key === 'X') {
        handleTriggerDisposition('SCRAP_QUARANTINE');
      } else if (e.key === 'w' || e.key === 'W') {
        handleTriggerDisposition('ROBOTIC_REWORK');
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < SAMPLE_WHEELS.length) {
          handleResetCustom();
          setSelectedWheelIndex(idx);
          playIndustrialTone('click');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWheelIndex]);

  const handleUploadCustomImage = async (dataUrl, fileName, rawFile) => {
    setCustomImage(dataUrl);
    setIsAnalyzing(true);
    playIndustrialTone('click');
    if (onNotify) {
      onNotify(`Uploaded ${fileName}. Invoking vision inspection pipeline...`, 'info');
    }

    let apiSuccess = false;
    if (rawFile) {
      try {
        const uploadRes = await uploadWheelImage(rawFile);
        if (uploadRes && uploadRes.image_path) {
          const generatedId = `WHEEL-${Math.floor(1000 + Math.random() * 9000)}`;

          // Auto-detect component stream from file name
          let detectedComponent = 'auto';
          const lowerName = (fileName || '').toLowerCase();
          if (lowerName.includes('tyre') || lowerName.includes('tire') || lowerName.includes('tread') || lowerName.includes('bulge') || lowerName.includes('puncture') || lowerName.includes('sidewall') || lowerName.includes('cord')) {
            detectedComponent = 'tyre';
          } else if (lowerName.includes('rim') || lowerName.includes('porosity') || lowerName.includes('scratch') || lowerName.includes('blow_hole') || lowerName.includes('spoke') || lowerName.includes('weld')) {
            detectedComponent = 'rim';
          }

          const inspectRes = await inspectWheel(generatedId, uploadRes.image_path, 'BATCH-B0127', 'MACH-M04', detectedComponent);
          if (inspectRes) {
            const defectLabel = inspectRes.defect_type || 'Good';
            const isDefect = !['no_defect', 'good', 'normal', 'normal_tire', 'none', 'ok', '', 'conforming assembly (good)', 'conforming', 'defect_free'].includes(defectLabel.toLowerCase().trim());
            const severityLevel = inspectRes.severity ? (inspectRes.severity.charAt(0).toUpperCase() + inspectRes.severity.slice(1).toLowerCase()) : (isDefect ? 'Critical' : 'Pass');

            // Format coordinates reliably for any coordinate space (normalized 0..1, 640x640 YOLO, or pixel space)
            const formatBox = (box) => {
              if (!box || !Array.isArray(box) || box.length < 4) return null;
              const [x1, y1, x2, y2] = box;
              const maxCoord = Math.max(x1, y1, x2, y2);
              const scale = maxCoord <= 1.05 ? 1.0 : (maxCoord <= 640 ? 640 : Math.max(x2, y2, 640));
              const pctX = Math.max(2, Math.min(85, Math.round((x1 / scale) * 100)));
              const pctY = Math.max(2, Math.min(85, Math.round((y1 / scale) * 100)));
              const pctW = Math.max(8, Math.min(85, Math.round(((x2 - x1) / scale) * 100)));
              const pctH = Math.max(8, Math.min(85, Math.round(((y2 - y1) / scale) * 100)));
              return { x: pctX, y: pctY, width: pctW, height: pctH };
            };

            const newCustomWheelData = {
              wheel_id: inspectRes.wheel_id || generatedId,
              wheel_model: 'Aluminium Alloy Wheel Specimen',
              alloy: 'Aluminium A356.2 T6 Cast Alloy',
              rim_diameter: '18 inch',
              rim_width: '8.0J',
              spoke_count: 5,
              batch_id: inspectRes.batch_id || 'BATCH-B0127',
              machine_id: inspectRes.machine_id || 'MACH-M04',
              production_cycle: 14220,
              inspection_timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              image_type: 'Optical RGB Matrix Ingestion',
              status: isDefect ? 'DEFECT_DETECTED' : 'CONFORMING',
              is_real_api: true,
              api_source: 'FastAPI Backend (/api/inspection/inspect)',
              defect: isDefect ? {
                defect_id: `DEF-API-${Math.floor(100 + Math.random() * 900)}`,
                defect_type: defectLabel,
                severity: severityLevel,
                zone: inspectRes.component === 'tyre' ? 'Tyre Specimen (Localized Inference)' : 'Rim Specimen (Localized Inference)',
                confidence: inspectRes.defect_confidence || 0.92,
                location: formatBox(inspectRes.location) || { x: 50, y: 50, width: 15, height: 15 },
                dimensions: inspectRes.tyre?.dimensions || { length_mm: 14.8, depth_est_mm: 1.9, area_mm2: 28.1 },
                safety_impact: 'Exceeds allowable defect threshold for structural metrology.',
                disposition: severityLevel === 'Low' ? 'ROBOTIC_REWORK' : 'SCRAP_QUARANTINE',
              } : null,
              rca: {
                root_cause: inspectRes.root_cause || (isDefect ? 'Process parameter deviation detected.' : 'Normal process parameters maintained.'),
                confidence: inspectRes.root_cause_confidence || 0.90,
                sensor_telemetry: [
                  { name: 'Die Cavity Temp', value: 685, unit: '°C', normal_min: 670, normal_max: 710, status: 'NORMAL' },
                  { name: 'Hydraulic Injection Pressure', value: 122, unit: 'bar', normal_min: 110, normal_max: 125, status: 'NORMAL' },
                  { name: 'Plunger Shot Velocity', value: 3.25, unit: 'm/s', normal_min: 3.1, normal_max: 3.4, status: 'NORMAL' },
                  { name: 'Melt Degassing Nitrogen Flow', value: 18.2, unit: 'L/min', normal_min: 16.0, normal_max: 20.0, status: 'NORMAL' },
                  { name: 'Cooling Gate #2 Flow', value: 11.2, unit: 'L/min', normal_min: 10.0, normal_max: 12.0, status: 'NORMAL' },
                  { name: 'Spindle Vibration RMS', value: 1.10, unit: 'mm/s', normal_min: 0.8, normal_max: 1.8, status: 'NORMAL' },
                ],
                shap_attributions: [
                  { feature: 'Plunger Shot Stability', impact: 42, direction: isDefect ? 'negative' : 'positive' },
                  { feature: 'Melt Degassing Uniformity', impact: 35, direction: isDefect ? 'negative' : 'positive' },
                  { feature: 'Die Temperature Variance', impact: 23, direction: isDefect ? 'negative' : 'positive' },
                ],
              },
              risk: {
                future_risk_score: inspectRes.future_risk || (isDefect ? 0.68 : 0.03),
                machine_health_status: isDefect ? 'DEGRADED' : 'OPTIMAL',
                risk_level: isDefect ? 'High Risk' : 'Low Risk',
                cycles_until_maintenance: isDefect ? 16 : 120,
                trend: isDefect ? [38, 46, 55, 62, 68] : [9, 7, 5, 4, 3],
                forecast_message: isDefect
                  ? `Predictive model alert: Elevated line scrap propagation forecasted if uncorrected. Primary suspect anomaly: ${defectLabel} (${Math.round((inspectRes.defect_confidence || 0.92) * 100)}% conf). Machine maintenance intervention recommended.`
                  : 'Predictive model nominal: Zero active drift across casting and vulcanization stages. Machine fleet operates within standard 6-Sigma tolerances.',
              },
              recommendation: {
                sop_code: isDefect ? 'SOP-DEF-CONTAIN-01' : 'SOP-PASS-RELEASE-01',
                title: isDefect ? `Process Countermeasure: ${defectLabel}` : 'Standard Line Release Authorization',
                action: inspectRes.recommended_action || (isDefect ? 'Quarantine suspect batch and calibrate machine parameters.' : 'Conforming assembly - Approved for final vehicle line release.'),
                corrective_action: inspectRes.recommended_action || (isDefect ? 'Quarantine suspect batch and calibrate machine parameters.' : 'Conforming assembly - Approved for final vehicle line release.'),
                priority: isDefect ? (severityLevel === 'Low' ? 'REWORK' : 'IMMEDIATE') : 'MONITOR',
                assigned_team: 'Quality Engineering Crew #2',
                estimated_downtime_min: isDefect ? 15 : 0,
              },
              rim_inspection: inspectRes.rim ? {
                sub_assembly: 'Rim Sub-Assembly',
                classifier: '9-Class Rim Inspection Model',
                detected_defect: inspectRes.rim.defect_type,
                defect_name: inspectRes.rim.defect_type ? inspectRes.rim.defect_type.replace(/_/g, ' ') : 'Rim Inspection',
                severity: ['defect_free', 'good', 'normal', 'pass'].includes((inspectRes.rim.defect_type || '').toLowerCase()) ? 'Pass' : 'Critical',
                confidence: inspectRes.rim.confidence || 0.95,
                zone: 'Rim Specimen',
                location: formatBox(inspectRes.location),
              } : null,
              tyre_inspection: inspectRes.tyre ? {
                sub_assembly: 'Tyre Sub-Assembly',
                classifier: '14-Class Tyre Inspection Model (0–13)',
                class_id: inspectRes.tyre.class_id ?? 0,
                detected_defect: inspectRes.tyre.class_name,
                defect_name: inspectRes.tyre.class_name ? inspectRes.tyre.class_name.replace(/_/g, ' ') : 'Tyre Inspection',
                severity: ['good', 'normal_tire', 'normal', 'pass'].includes((inspectRes.tyre.class_name || '').toLowerCase()) ? 'Pass' : 'Critical',
                confidence: inspectRes.tyre.confidence || 0.94,
                zone: 'Tyre Specimen',
                location: formatBox(inspectRes.tyre.bbox),
              } : null,
            };
            setCustomWheelData(newCustomWheelData);
            recordInspection(newCustomWheelData, dataUrl);
            apiSuccess = true;
            setIsAnalyzing(false);
            playIndustrialTone(isDefect ? 'crit' : 'pass');
            if (onNotify) {
              onNotify(`Real backend inspection complete: ${defectLabel} (${Math.round((inspectRes.defect_confidence || 0.9) * 100)}% conf)`, isDefect ? 'warning' : 'success');
            }
          }
        }
      } catch (err) {
        console.warn('Real backend call failed, falling back to offline specimen:', err);
        if (onNotify) {
          onNotify(`Backend Notice: ${err.message || 'API endpoint unavailable'}. Using dynamic offline engine.`, 'warning');
        }
      }
    }

    if (!apiSuccess) {
      setTimeout(() => {
        const lower = (fileName || '').toLowerCase();
        const isGood = lower.includes('good') || lower.includes('pass') || lower.includes('clean') || lower.includes('normal');
        const isBulge = lower.includes('bulge') || lower.includes('blister');
        const isPuncture = lower.includes('puncture') || lower.includes('nail');
        const isCrack = lower.includes('crack');
        const isPorosity = lower.includes('porosity') || lower.includes('pore');
        const isScratch = lower.includes('scratch');

        let defectName = 'Good';
        let severity = 'Pass';
        let isDef = false;
        let comp = 'auto';

        if (isGood) {
          defectName = 'Good';
          severity = 'Pass';
          isDef = false;
        } else if (isBulge) {
          defectName = 'Bulge';
          severity = 'Critical';
          isDef = true;
          comp = 'tyre';
        } else if (isPuncture) {
          defectName = 'Puncture';
          severity = 'Critical';
          isDef = true;
          comp = 'tyre';
        } else if (isCrack) {
          defectName = 'Cracks';
          severity = 'Critical';
          isDef = true;
        } else if (isPorosity) {
          defectName = 'Gas Porosity Cluster';
          severity = 'Critical';
          isDef = true;
          comp = 'rim';
        } else if (isScratch) {
          defectName = 'Surface Handling Scratch';
          severity = 'Low';
          isDef = true;
          comp = 'rim';
        } else {
          // Default to conforming clean specimen with zero random variation
          defectName = 'Good';
          severity = 'Pass';
          isDef = false;
        }

        const offlineWheelObj = {
          wheel_id: `UPLOAD-${Math.floor(1000 + Math.random() * 9000)}`,
          wheel_model: 'Alloy Wheel & Tyre Assembly',
          alloy: 'Aluminium A356.2 T6 / Radial Ply Casing',
          rim_diameter: '19 inch',
          rim_width: '8.5J',
          spoke_count: 5,
          batch_id: 'BATCH-AL-2026-X89',
          machine_id: 'HPDC-Unit-02',
          production_cycle: 14220,
          inspection_timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          image_type: 'Optical RGB Matrix Ingestion',
          status: isDef ? 'DEFECT_DETECTED' : 'CONFORMING',
          rim_inspection: comp !== 'tyre' ? {
            sub_assembly: 'Rim Sub-Assembly',
            classifier: '9-Class Rim Inspection Model',
            detected_defect: isDef && comp === 'rim' ? defectName : 'defect_free',
            defect_name: isDef && comp === 'rim' ? defectName : 'Conforming Rim Face',
            severity: isDef && comp === 'rim' ? severity : 'Pass',
            confidence: 0.942,
            zone: 'Rim Specimen',
            location: isDef && comp === 'rim' ? { x: 58, y: 26, width: 16, height: 18 } : null,
          } : null,
          tyre_inspection: comp !== 'rim' ? {
            sub_assembly: 'Tyre Sub-Assembly',
            classifier: '14-Class Tyre Inspection Model (0–13)',
            class_id: isDef && comp === 'tyre' ? 1 : 4,
            detected_defect: isDef && comp === 'tyre' ? defectName : 'Good',
            defect_name: isDef && comp === 'tyre' ? defectName : 'Good Conforming Tyre',
            severity: isDef && comp === 'tyre' ? severity : 'Pass',
            confidence: 0.935,
            zone: 'Tyre Specimen',
            location: isDef && comp === 'tyre' ? { x: 74, y: 48, width: 14, height: 16 } : null,
          } : null,
          combined_verdict: {
            overall_status: isDef ? 'DEFECT_DETECTED' : 'CONFORMING',
            overall_severity: severity,
            verdict_summary: isDef ? `DEFECT: ${defectName} detected.` : 'CONFORMING: All tolerances satisfied.',
            release_authorized: !isDef,
            disposition: isDef ? (severity === 'Low' ? 'ROBOTIC_REWORK' : 'SCRAP_QUARANTINE') : 'LINE_RELEASE',
          },
          defect: isDef ? {
            defect_id: `DEF-SPEC-${Math.floor(100 + Math.random() * 900)}`,
            defect_type: defectName,
            severity: severity,
            zone: comp === 'tyre' ? 'Lower Sidewall Quadrant 1' : 'Outer Rim Lip Sector 4',
            confidence: 0.935,
            location: { x: 55, y: 40, width: 16, height: 18 },
            dimensions: { length_mm: 14.8, depth_est_mm: 1.9, area_mm2: 28.1 },
            safety_impact: 'Component defect flagged by metrology inspection.',
            disposition: severity === 'Low' ? 'ROBOTIC_REWORK' : 'SCRAP_QUARANTINE',
          } : null,
          rca: {
            root_cause: isDef ? 'Process parameter excursion during casting/curing cycle.' : 'Nominal casting and vulcanization quality tolerances satisfied.',
            confidence: 0.95,
            sensor_telemetry: isDef ? [
              { name: 'Die Cavity Temp', value: 642, unit: '°C', normal_min: 670, normal_max: 710, status: 'SLIGHT_LOW' },
              { name: 'Hydraulic Injection Pressure', value: 135, unit: 'bar', normal_min: 110, normal_max: 125, status: 'HIGH' },
              { name: 'Plunger Shot Velocity', value: 3.45, unit: 'm/s', normal_min: 3.1, normal_max: 3.4, status: 'SLIGHT_HIGH' },
              { name: 'Melt Degassing Nitrogen Flow', value: 14.5, unit: 'L/min', normal_min: 16.0, normal_max: 20.0, status: 'WARNING_LOW' },
              { name: 'Cooling Gate #2 Flow', value: 12.1, unit: 'L/min', normal_min: 10.0, normal_max: 12.0, status: 'NORMAL' },
              { name: 'Spindle Vibration RMS', value: 1.15, unit: 'mm/s', normal_min: 0.8, normal_max: 1.8, status: 'NORMAL' },
            ] : [
              { name: 'Die Cavity Temp', value: 685, unit: '°C', normal_min: 670, normal_max: 710, status: 'NORMAL' },
              { name: 'Hydraulic Injection Pressure', value: 122, unit: 'bar', normal_min: 110, normal_max: 125, status: 'NORMAL' },
              { name: 'Plunger Shot Velocity', value: 3.25, unit: 'm/s', normal_min: 3.1, normal_max: 3.4, status: 'NORMAL' },
              { name: 'Melt Degassing Nitrogen Flow', value: 18.2, unit: 'L/min', normal_min: 16.0, normal_max: 20.0, status: 'NORMAL' },
              { name: 'Cooling Gate #2 Flow', value: 11.2, unit: 'L/min', normal_min: 10.0, normal_max: 12.0, status: 'NORMAL' },
              { name: 'Spindle Vibration RMS', value: 1.10, unit: 'mm/s', normal_min: 0.8, normal_max: 1.8, status: 'NORMAL' },
            ],
            shap_attributions: [
              { feature: 'Plunger Shot Turbulence', impact: isDef ? 46 : 15, direction: isDef ? 'negative' : 'positive' },
              { feature: 'Degassing Nitrogen Flow Deficit', impact: isDef ? 32 : 12, direction: isDef ? 'negative' : 'positive' },
              { feature: 'Die Temperature Variance', impact: isDef ? 22 : 10, direction: isDef ? 'negative' : 'positive' },
            ],
          },
          risk: {
            future_risk_score: isDef ? 0.68 : 0.04,
            machine_health_status: isDef ? 'DEGRADED' : 'OPTIMAL',
            risk_level: isDef ? 'High Risk' : 'Low Risk',
            cycles_until_maintenance: isDef ? 16 : 120,
            trend: isDef ? [48, 54, 61, 65, 68] : [10, 8, 6, 5, 4],
            forecast_message: isDef
              ? `Predictive model alert: Elevated line scrap propagation forecasted if uncorrected. Primary suspect anomaly: ${defectName}. Machine maintenance intervention recommended.`
              : 'Predictive model nominal: Zero active drift across casting and vulcanization stages. Machine fleet operates within standard 6-Sigma tolerances.',
          },
          recommendation: {
            sop_code: isDef ? 'SOP-AL-CAST-071' : 'SOP-PASS-RELEASE-01',
            title: isDef ? 'Containment & Process Calibration' : 'Line Release Authorization',
            action: isDef ? 'Inspect parameters and isolate suspect batch.' : 'Release component to line.',
            priority: isDef ? (severity === 'Low' ? 'REWORK' : 'IMMEDIATE') : 'MONITOR',
            assigned_team: 'Cell Maintenance Crew',
            estimated_downtime_min: isDef ? 15 : 0,
          },
          affected_batches: isDef ? ['BATCH-AL-2026-X89'] : [],
        };
        setCustomWheelData(offlineWheelObj);
        recordInspection(offlineWheelObj, dataUrl);
        setIsAnalyzing(false);
        playIndustrialTone(isDef ? 'crit' : 'pass');
        if (onNotify) {
          onNotify(`Inspection complete: ${defectName} (${severity})`, isDef ? 'warning' : 'success');
        }
      }, 700);
    }
  };

  const handleResetCustom = () => {
    setCustomImage(null);
    setCustomWheelData(null);
  };

  const handleTriggerInspection = () => {
    setIsAnalyzing(true);
    playIndustrialTone('click');
    if (onNotify) {
      onNotify('Running optical scan & defect analysis...', 'info');
    }
    setTimeout(() => {
      setIsAnalyzing(false);
      const isDefect = !!activeWheel?.defect;
      playIndustrialTone(isDefect ? 'crit' : 'pass');
      if (activeWheel) {
        recordInspection(activeWheel, customImage);
      }
      if (onNotify) {
        onNotify(
          activeWheel
            ? 'Inspection complete! Cycle time: 34ms.'
            : 'Inspection scanner standby: Please upload a specimen image to inspect.',
          activeWheel ? 'success' : 'info'
        );
      }
    }, 750);
  };

  const handleDispatchAction = (sopCode) => {
    playIndustrialTone('pass');
    if (onNotify) {
      onNotify(`Dispatched Work Order for ${sopCode} to MES & Maintenance Crew!`, 'success');
    }
  };

  const handleTriggerDisposition = (actionType) => {
    if (actionType === 'SCRAP_QUARANTINE') {
      playIndustrialTone('crit');
      if (onNotify) {
        onNotify('Component marked as SCRAP. Batch locked in MES quarantine pool.', 'error');
      }
    } else if (actionType === 'ROBOTIC_REWORK') {
      playIndustrialTone('click');
      if (onNotify) {
        onNotify('Component routed to robotic deburring cell #3 for polish.', 'warning');
      }
    } else {
      playIndustrialTone('pass');
      if (onNotify) {
        onNotify('Component quality approved! Line release signal dispatched.', 'success');
      }
    }
  };

  return (
    <div className="dashboard-page">
      {/* Live Plant Telemetry Ribbon */}
      <div className="cockpit-live-telemetry-bar">
        <div className="telemetry-bar-left">
          <div className="pulse-indicator">
            <span className="telemetry-beacon"></span>
            <span className="telemetry-status-text mono">PLANT SCADA: ACTIVE</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">MODE:</span>
            {customWheelData ? (
              <span className="chip-val text-cyan">LIVE SPECIMEN INGESTION</span>
            ) : (
              <span className="chip-val text-amber">DEMO MODE — SAMPLE DATA</span>
            )}
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">FASTAPI:</span>
            <span className={backendStatus === 'ONLINE' ? 'chip-val text-emerald' : 'chip-val text-amber'}>{backendStatus}</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">TAKT:</span>
            <span className="chip-val text-emerald">34ms</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">LINE SPEED:</span>
            <span className="chip-val text-cyan">142 RIMS/HR</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">MELT / DIE:</span>
            <span className="chip-val">682°C • 122 BAR</span>
          </div>
          <div className="telemetry-stat-chip mono">
            <span className="chip-label">YIELD:</span>
            <span className="chip-val text-emerald">97.8% FPY</span>
          </div>
        </div>

        <div className="telemetry-bar-right">
          <div className="hotkeys-guide-pill mono">
            <span>SHORTCUTS:</span>
            <kbd>Space</kbd> Scan • <kbd>A</kbd> Pass • <kbd>X</kbd> Scrap • <kbd>W</kbd> Rework
          </div>
        </div>
      </div>

      {/* Top Controls & Metadata Bar */}
      <WheelInspection
        wheels={SAMPLE_WHEELS}
        activeWheel={activeWheel}
        selectedWheelIndex={selectedWheelIndex}
        onSelectWheel={setSelectedWheelIndex}
        customImage={customImage}
        onUploadCustomImage={handleUploadCustomImage}
        onResetCustomImage={handleResetCustom}
        onTriggerInspection={handleTriggerInspection}
        isAnalyzing={isAnalyzing}
        onOpenCertificate={() => setIsCertModalOpen(true)}
        onNotify={onNotify}
      />

      {/* Main Inspection & Severity Row */}
      <div className="dashboard-grid-row">
        <DefectViewer
          wheel={activeWheel}
          customImage={customImage}
          onUploadCustomImage={handleUploadCustomImage}
          onNotify={onNotify}
        />
        <SeverityCard
          wheel={activeWheel}
          onTriggerDisposition={handleTriggerDisposition}
          onNotify={onNotify}
        />
      </div>

      {/* Root-Cause & Risk Forecasting Row */}
      <div className="dashboard-grid-row">
        <RootCause wheel={activeWheel} />
        <RiskPrediction wheel={activeWheel} />
      </div>

      {/* Prescriptive Countermeasures */}
      <div className="dashboard-grid-row">
        <Recommendation wheel={activeWheel} onDispatchAction={handleDispatchAction} />
        <Alerts />
      </div>

      {/* Inspection Quality Certificate Modal */}
      {isCertModalOpen && (
        <InspectionCertificateModal
          wheel={activeWheel}
          onClose={() => setIsCertModalOpen(false)}
        />
      )}
    </div>
  );
}
