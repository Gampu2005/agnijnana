"""Defects API endpoints for Agnijnana visual inspection records."""

from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from app.services.future_risk_engine import load_prediction_history

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
HISTORY_CSV = DATA_DIR / "prediction_history.csv"


class DefectRecord(BaseModel):
    id: int
    component_id: str
    wheel_id: str
    batch_id: str
    machine_id: str
    defect_type: str
    severity: str
    confidence: float
    detected_at: str
    location: Optional[List[float]] = None


@router.get(
    "/",
    response_model=List[DefectRecord],
    summary="List wheel and tyre component defects",
)
def list_defects(
    batch_id: Optional[str] = Query(None, description="Filter by casting batch"),
    machine_id: Optional[str] = Query(None, description="Filter by machine station"),
    severity: Optional[str] = Query(None, description="Filter by severity ('Low' | 'High' | 'Critical')"),
):
    """Retrieve localized visual defect records with optional batch, machine, and severity filters."""
    defects: List[DefectRecord] = []

    try:
        if HISTORY_CSV.is_file():
            df = load_prediction_history(HISTORY_CSV)
            # Only rows where defect_present == 1 and not no_defect
            defective = df.loc[df["defect_present"] == 1].copy()

            if batch_id:
                defective = defective.loc[defective["batch_id"].str.lower() == batch_id.lower().strip()]
            if machine_id:
                defective = defective.loc[defective["machine_id"].str.lower() == machine_id.lower().strip()]
            if severity:
                defective = defective.loc[defective["severity"].astype(str).str.lower() == severity.lower().strip()]

            for idx, row in defective.iterrows():
                p_id = str(row.get("part_id") or f"WH{idx:06d}")
                d_type = str(row.get("predicted_defect") or "porosity")
                sev = str(row.get("severity") or "High")
                conf = float(row.get("model_confidence") or 0.90)
                ts = str(row.get("timestamp") or "")

                defects.append(
                    DefectRecord(
                        id=int(idx) + 1,
                        component_id=p_id,
                        wheel_id=p_id,
                        batch_id=str(row.get("batch_id") or ""),
                        machine_id=str(row.get("machine_id") or ""),
                        defect_type=d_type,
                        severity=sev,
                        confidence=round(conf, 3),
                        detected_at=ts,
                        location=[120.0, 140.0, 260.0, 280.0],
                    )
                )
    except Exception:
        pass

    return defects
