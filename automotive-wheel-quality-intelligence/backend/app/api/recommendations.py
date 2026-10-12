"""Corrective action recommendations API endpoints."""

from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.root_cause_engine import root_cause_engine

router = APIRouter()


class RecommendationItem(BaseModel):
    id: int
    defect_type: str
    recommended_action: str
    priority: str = Field(..., description="'IMMEDIATE', 'SCHEDULED_SHIFT_END', 'MONITOR'")
    sop_code: str
    process_stage: str
    probable_root_cause: str
    created_at: str


@router.get("/", response_model=List[RecommendationItem], summary="List corrective action recommendations")
def get_recommendations():
    """Retrieve actionable corrective maintenance and engineering SOP recommendations."""
    recommendations: List[RecommendationItem] = []
    now_str = datetime.now(timezone.utc).isoformat()

    SOP_MAPPING = {
        "porosity": {"sop": "SOP-MET-04", "priority": "IMMEDIATE"},
        "crack": {"sop": "SOP-NDT-09", "priority": "IMMEDIATE"},
        "incomplete_welding": {"sop": "SOP-WLD-12", "priority": "IMMEDIATE"},
        "blow_hole": {"sop": "SOP-CST-03", "priority": "IMMEDIATE"},
        "bent_rim": {"sop": "SOP-MCH-07", "priority": "IMMEDIATE"},
        "tread_separation": {"sop": "SOP-VLC-01", "priority": "IMMEDIATE"},
        "sidewall_bulge": {"sop": "SOP-VLC-05", "priority": "IMMEDIATE"},
        "scratch": {"sop": "SOP-FIN-02", "priority": "MONITOR"},
        "scuff": {"sop": "SOP-FIN-04", "priority": "MONITOR"},
        "paint_damage": {"sop": "SOP-PNT-01", "priority": "SCHEDULED_SHIFT_END"},
    }

    rec_id = 1
    for defect_key, items in root_cause_engine._mapping.items():
        if not items:
            continue
        primary = items[0]
        sop_info = SOP_MAPPING.get(defect_key, {"sop": "SOP-GEN-01", "priority": "MONITOR"})

        recommendations.append(
            RecommendationItem(
                id=rec_id,
                defect_type=defect_key,
                recommended_action=primary["corrective_action"],
                priority=sop_info["priority"],
                sop_code=sop_info["sop"],
                process_stage=primary["process_stage"],
                probable_root_cause=primary["probable_root_cause"],
                created_at=now_str,
            )
        )
        rec_id += 1

    return recommendations
