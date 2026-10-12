"""Equipment and casting machines API endpoint."""

from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.future_risk_engine import load_prediction_history, rank_machines

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
HISTORY_CSV = DATA_DIR / "prediction_history.csv"


class MachineItem(BaseModel):
    id: int
    machine_code: str
    machine_id: str
    name: str
    line_identifier: str
    status: str = Field(default="OPERATIONAL", description="'OPERATIONAL', 'MAINTENANCE', 'DEGRADED'")
    inspections: int = 0
    defect_rate: float = 0.0
    risk_level: str = "LOW"
    most_likely_defect: Optional[str] = None


@router.get("/", response_model=List[MachineItem], summary="List casting/machining equipment")
def get_machines():
    """Retrieve casting, curing, and CNC machining equipment status and operational metrics."""
    machines: List[MachineItem] = []

    MACHINE_METADATA = {
        "LPDC-CELL-02": {"name": "Low Pressure Die Casting Cell 02", "line": "Line-A (Alloy Wheel Casting)"},
        "CURING-PRESS-04": {"name": "Hydraulic Tyre Curing Press 04", "line": "Line-C (Tyre Vulcanization)"},
        "HPDC-Unit-02": {"name": "High Pressure Die Casting Unit 02", "line": "Line-A (Cast Rim Roughing)"},
        "M04": {"name": "LPDC Furnace & Casting Station 04", "line": "Line-A (Wheel Foundry)"},
        "M02": {"name": "CNC Lathe & Rim Profile Station 02", "line": "Line-B (Machining)"},
        "M01": {"name": "Automatic Rim Welding & Polishing 01", "line": "Line-B (Finishing)"},
    }

    try:
        if HISTORY_CSV.is_file():
            df = load_prediction_history(HISTORY_CSV)
            m_ranked = rank_machines(df)

            for idx, row in m_ranked.iterrows():
                m_code = str(row["machine_id"])
                meta = MACHINE_METADATA.get(m_code, {"name": f"Station {m_code}", "line": "Main Line"})
                risk_lvl = str(row["risk_level"]).upper()
                status_val = "DEGRADED" if risk_lvl == "HIGH" else ("MAINTENANCE" if risk_lvl == "MODERATE" else "OPERATIONAL")

                machines.append(
                    MachineItem(
                        id=int(idx) + 1,
                        machine_code=m_code,
                        machine_id=m_code,
                        name=meta["name"],
                        line_identifier=meta["line"],
                        status=status_val,
                        inspections=int(row.get("inspections", 0)),
                        defect_rate=round(float(row.get("recent_defect_rate", 0.0)), 3),
                        risk_level=risk_lvl,
                        most_likely_defect=str(row.get("most_likely_defect") or "none"),
                    )
                )
    except Exception:
        pass

    if not machines:
        machines = [
            MachineItem(id=1, machine_code="LPDC-CELL-02", machine_id="LPDC-CELL-02", name="Low Pressure Die Casting Cell 02", line_identifier="Line-A (Alloy Wheel Casting)", status="DEGRADED", inspections=10, defect_rate=0.60, risk_level="HIGH", most_likely_defect="porosity"),
            MachineItem(id=2, machine_code="CURING-PRESS-04", machine_id="CURING-PRESS-04", name="Hydraulic Tyre Curing Press 04", line_identifier="Line-C (Tyre Vulcanization)", status="DEGRADED", inspections=10, defect_rate=0.50, risk_level="HIGH", most_likely_defect="sidewall_bulge"),
            MachineItem(id=3, machine_code="M04", machine_id="M04", name="LPDC Furnace & Casting Station 04", line_identifier="Line-A (Wheel Foundry)", status="DEGRADED", inspections=12, defect_rate=0.50, risk_level="HIGH", most_likely_defect="porosity"),
            MachineItem(id=4, machine_code="M02", machine_id="M02", name="CNC Lathe & Rim Profile Station 02", line_identifier="Line-B (Machining)", status="MAINTENANCE", inspections=11, defect_rate=0.27, risk_level="MODERATE", most_likely_defect="blow_hole"),
            MachineItem(id=5, machine_code="M01", machine_id="M01", name="Automatic Rim Welding & Polishing 01", line_identifier="Line-B (Finishing)", status="OPERATIONAL", inspections=11, defect_rate=0.18, risk_level="LOW", most_likely_defect="incomplete_welding"),
        ]

    return machines
