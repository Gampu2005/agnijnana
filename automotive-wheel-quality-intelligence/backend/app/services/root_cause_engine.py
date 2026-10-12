"""Rule-based root-cause lookup for Q-SENTINEL wheel inspection.

The CSV is an engineering knowledge base, not a trained or statistically
calibrated root-cause model. `knowledge_confidence` represents a curated
strength-of-association score and must not be interpreted as cause probability.
"""

from __future__ import annotations

import csv
import logging
import re
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

_REQUIRED_COLUMNS = {
    "defect_class",
    "probable_root_cause",
    "process_factors",
    "corrective_action",
    "knowledge_confidence",
    "process_stage",
}

# Explicit label aliases help match common formatting/plural variants without
# silently applying a root cause to unrelated labels.
_ALIASES = {
    "scratches": "scratch",
    "surface_scratch": "scratch",
    "surface_scratches": "scratch",
    "scuffs": "scuff",
    "severe_scuff": "scuff_severe",
    "paintdamage": "paint_damage",
    "paint_defect": "paint_damage",
    "bent_rim_damage": "bent_rim",
    "cracks": "crack",
    "fracture": "crack",
    "fractures": "crack",
    "blowhole": "blow_hole",
    "blowholes": "blow_hole",
    "gas_hole": "blow_hole",
    "incomplete_weld": "incomplete_welding",
    "incomplete_welds": "incomplete_welding",
    "mixed_porosity_blow_hole": "mixed_porosity_blowhole",
    "porosity_blowhole": "mixed_porosity_blowhole",
    "chips": "chip",
    "pitted_corrosion": "corrosion",
}


def normalize_defect_label(value: Any) -> str:
    """Normalize a model class label for exact mapping lookup."""
    if value is None:
        return ""
    label = str(value).strip().lower()
    label = label.replace("&", "and")
    label = re.sub(r"[\s\-/]+", "_", label)
    label = re.sub(r"[^a-z0-9_]+", "", label)
    label = re.sub(r"_+", "_", label).strip("_")
    return _ALIASES.get(label, label)


class RootCauseEngine:
    """Load and query a CSV-based engineering root-cause knowledge base."""

    DEFAULT_ROWS = [
        {"defect_class": "scratch", "probable_root_cause": "Handling or fixture contact issue", "process_factors": "vibration;handling speed;contact surface", "corrective_action": "Inspect handling path, fixture and contact surfaces for rubbing or sharp edges.", "knowledge_confidence": "0.82", "process_stage": "handling"},
        {"defect_class": "scuff", "probable_root_cause": "Handling or fixture contact issue", "process_factors": "vibration;handling speed;contact surface", "corrective_action": "Inspect fixture/handling surfaces and reduce excessive relative movement.", "knowledge_confidence": "0.82", "process_stage": "handling"},
        {"defect_class": "paint_damage", "probable_root_cause": "Coating-process deviation", "process_factors": "humidity;coating speed;surface preparation", "corrective_action": "Inspect coating parameters, environmental humidity and surface preparation.", "knowledge_confidence": "0.88", "process_stage": "finishing"},
        {"defect_class": "bent_rim", "probable_root_cause": "Tooling or process deformation", "process_factors": "pressure;thermal condition;fixture alignment", "corrective_action": "Inspect tooling/fixture alignment and verify the forming/casting process settings.", "knowledge_confidence": "0.78", "process_stage": "casting"},
        {"defect_class": "crack", "probable_root_cause": "Thermal stress or cooling imbalance", "process_factors": "melt temperature;die temperature;cooling rate", "corrective_action": "Verify thermal control and cooling balance; inspect for abnormal thermal gradients.", "knowledge_confidence": "0.91", "process_stage": "casting"},
        {"defect_class": "porosity", "probable_root_cause": "Gas entrapment or material-condition issue", "process_factors": "melt temperature;fill pressure;degassing;venting", "corrective_action": "Inspect melt quality/degassing and verify filling, pressure and venting conditions.", "knowledge_confidence": "0.90", "process_stage": "casting"},
        {"defect_class": "blow_hole", "probable_root_cause": "Gas entrapment or contamination", "process_factors": "melt condition;pressure;venting;moisture", "corrective_action": "Check gas control, moisture/contamination sources and venting; verify filling conditions.", "knowledge_confidence": "0.89", "process_stage": "casting"},
        {"defect_class": "incomplete_welding", "probable_root_cause": "Insufficient joining-process control", "process_factors": "joining pressure;process speed;cleanliness", "corrective_action": "Verify joining parameters, surface preparation and process speed/pressure.", "knowledge_confidence": "0.86", "process_stage": "welding"},
    ]

    def __init__(self, mapping_file: str | Path | None = None) -> None:
        self.mapping_file = Path(mapping_file) if mapping_file else (
                Path(__file__).resolve().parents[1] / "data" / "root_cause_mapping.csv"
        )
        self._mapping: dict[str, list[dict[str, Any]]] = {}

        rows = []
        if self.mapping_file.is_file():
            with self.mapping_file.open("r", encoding="utf-8-sig", newline="") as handle:
                reader = csv.DictReader(handle)
                rows = list(reader)
        else:
            logger.warning("Root-cause mapping CSV not found at %s. Using embedded knowledge baseline.", self.mapping_file)
            rows = self.DEFAULT_ROWS

        for row in rows:
                key = normalize_defect_label(row.get("defect_class"))
                if not key:
                    continue
                try:
                    knowledge_confidence = float(row["knowledge_confidence"])
                except (TypeError, ValueError):
                    logger.warning(
                        "Skipping root-cause mapping with invalid confidence for %s", key
                    )
                    continue
                if not 0.0 <= knowledge_confidence <= 1.0:
                    logger.warning(
                        "Skipping root-cause mapping with confidence outside 0-1 for %s", key
                    )
                    continue

                entry = {
                    "defect_class": key,
                    "probable_root_cause": (row.get("probable_root_cause") or "").strip(),
                    "process_factors": (row.get("process_factors") or "").strip(),
                    "corrective_action": (row.get("corrective_action") or "").strip(),
                    "knowledge_confidence": knowledge_confidence,
                    "process_stage": (row.get("process_stage") or "").strip(),
                    "confidence_interpretation": (
                        "Curated engineering knowledge confidence; not a statistically "
                        "validated probability that this cause produced the defect."
                    ),
                }
                self._mapping.setdefault(key, []).append(entry)

    def get_root_causes(self, defect_class: Any) -> list[dict[str, Any]]:
        """Return all curated mappings for a class, or an empty list if unmapped."""
        key = normalize_defect_label(defect_class)
        return [dict(item) for item in self._mapping.get(key, [])]

    def get_root_cause(self, defect_class: Any) -> dict[str, Any] | None:
        """Return the first mapping for a class for simple API response fields."""
        matches = self.get_root_causes(defect_class)
        return matches[0] if matches else None


root_cause_engine = RootCauseEngine()
