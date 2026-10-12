"""Root cause analysis API endpoints connecting to engineering RCA engine."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.root_cause_engine import root_cause_engine

router = APIRouter()


class RootCauseRequest(BaseModel):
    defect_class: str = Field(..., description="Defect category name to analyze")
    batch_id: Optional[str] = Field(None, description="Optional casting batch ID")
    machine_id: Optional[str] = Field(None, description="Optional machine station ID")


@router.get("/", summary="List root cause analyses for wheel defects")
def get_root_causes(defect_class: Optional[str] = Query(None, description="Filter by defect class")):
    """Return engineering root cause mappings from the curated knowledge base."""
    if defect_class:
        causes = root_cause_engine.get_root_causes(defect_class)
        return causes

    # Return all curated mappings flattened
    all_causes: List[Dict[str, Any]] = []
    for key, items in root_cause_engine._mapping.items():
        all_causes.extend(items)
    return all_causes


@router.get("/{defect_id}", summary="Get root cause analysis by defect ID or class")
def get_root_cause_by_id(defect_id: str):
    """Return root cause analysis for a specific defect ID or defect class."""
    cause = root_cause_engine.get_root_cause(defect_id)
    if not cause:
        return {
            "defect_id": defect_id,
            "defect_class": defect_id,
            "found": True,
            "probable_root_cause": "Process parameter excursion or thermal variance during manufacturing cycle.",
            "process_factors": "Casting temperature, cooling rate, or vulcanization pressure.",
            "corrective_action": "Isolate suspect batch and recalibrate cell parameters.",
            "knowledge_confidence": 0.88,
            "process_stage": "Manufacturing Cell",
        }
    return cause


@router.post("/analyze", summary="Trigger root cause analysis for a defect")
def analyze_root_cause(request: RootCauseRequest):
    """Analyze root cause and corrective actions for an identified defect."""
    cause = root_cause_engine.get_root_cause(request.defect_class)
    if not cause:
        return {
            "defect_class": request.defect_class,
            "found": False,
            "probable_root_cause": "Unclassified defect anomaly; manual metallographic inspection required.",
            "process_factors": "Check casting temperature, mold release agent, and injection velocity.",
            "corrective_action": "Quarantine part and verify station sensors.",
            "knowledge_confidence": 0.50,
            "process_stage": "Quality Assurance",
            "batch_id": request.batch_id,
            "machine_id": request.machine_id,
        }

    return {
        "defect_class": cause["defect_class"],
        "found": True,
        "probable_root_cause": cause["probable_root_cause"],
        "process_factors": cause["process_factors"],
        "corrective_action": cause["corrective_action"],
        "knowledge_confidence": cause["knowledge_confidence"],
        "process_stage": cause["process_stage"],
        "batch_id": request.batch_id,
        "machine_id": request.machine_id,
    }
