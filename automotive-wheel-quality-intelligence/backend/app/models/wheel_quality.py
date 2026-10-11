"""SQLAlchemy ORM models for Agnijnana Quality Intelligence System."""

from datetime import datetime, timezone
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    machine_code = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    line_identifier = Column(String(64))
    status = Column(String(32), default="OPERATIONAL")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    batches = relationship("Batch", back_populates="machine")
    components = relationship("Component", back_populates="machine")


class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    batch_number = Column(String(128), unique=True, nullable=False, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id", ondelete="SET NULL"), nullable=True)
    start_time = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    end_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(32), default="IN_PROGRESS")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    machine = relationship("Machine", back_populates="batches")
    components = relationship("Component", back_populates="batch", cascade="all, delete-orphan")


class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    component_uuid = Column(String(128), unique=True, nullable=False, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id", ondelete="CASCADE"), nullable=True)
    machine_id = Column(Integer, ForeignKey("machines.id", ondelete="SET NULL"), nullable=True)
    part_type = Column(String(128), nullable=False)
    inspection_timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    image_uri = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    batch = relationship("Batch", back_populates="components")
    machine = relationship("Machine", back_populates="components")
    defects = relationship("Defect", back_populates="component", cascade="all, delete-orphan")


class Defect(Base):
    __tablename__ = "defects"

    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(Integer, ForeignKey("components.id", ondelete="CASCADE"), nullable=False)
    defect_type = Column(String(128), nullable=False, index=True)
    severity = Column(String(32), nullable=False, index=True)
    location = Column(JSON, nullable=True)
    confidence = Column(Float, nullable=True)
    detected_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    component = relationship("Component", back_populates="defects")


class ProcessData(Base):
    __tablename__ = "process_data"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id", ondelete="CASCADE"), nullable=True)
    machine_id = Column(Integer, ForeignKey("machines.id", ondelete="CASCADE"), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    telemetry = Column(JSON, nullable=False)


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    defect_id = Column(Integer, ForeignKey("defects.id", ondelete="SET NULL"), nullable=True)
    component_id = Column(Integer, ForeignKey("components.id", ondelete="CASCADE"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batches.id", ondelete="CASCADE"), nullable=True)
    prediction_type = Column(String(64), default="rim")
    defect_type = Column(String(128), nullable=True)
    severity = Column(String(32), nullable=True)
    root_cause = Column(Text, nullable=True)
    root_cause_confidence = Column(Float, nullable=True)
    future_risk = Column(Float, nullable=True)
    model_version = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="CASCADE"), nullable=True)
    recommended_action = Column(Text, nullable=False)
    priority = Column(String(32), default="MONITOR")
    sop_code = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(64), nullable=False)
    severity = Column(String(32), nullable=False)
    message = Column(Text, nullable=False)
    affected_batch_id = Column(Integer, ForeignKey("batches.id", ondelete="SET NULL"), nullable=True)
    acknowledged = Column(Boolean, default=False, index=True)
    acknowledged_by = Column(String(128), nullable=True)
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
