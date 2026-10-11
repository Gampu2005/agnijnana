import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_defects_list():
    res = client.get("/api/defects/")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first = data[0]
    assert "defect_type" in first
    assert "severity" in first


def test_root_cause_endpoints():
    # List all
    res = client.get("/api/root-cause/")
    assert res.status_code == 200
    causes = res.json()
    assert isinstance(causes, list)
    assert len(causes) > 0

    # Analyze specific defect
    res_analyze = client.post("/api/root-cause/analyze", json={"defect_class": "porosity"})
    assert res_analyze.status_code == 200
    analysis = res_analyze.json()
    assert analysis["found"] is True
    assert "probable_root_cause" in analysis
    assert "corrective_action" in analysis


def test_risk_and_future_risk():
    # Overall summary
    res = client.get("/api/risk/")
    assert res.status_code == 200
    summary = res.json()
    assert summary["status"] == "success"
    assert "machines" in summary
    assert "batches" in summary

    # Machines ranking
    res_m = client.get("/api/future-risk/machines")
    assert res_m.status_code == 200
    machines = res_m.json()
    assert isinstance(machines, list)
    assert len(machines) > 0

    # Batches ranking
    res_b = client.get("/api/future-risk/batches")
    assert res_b.status_code == 200
    batches = res_b.json()
    assert isinstance(batches, list)
    assert len(batches) > 0

    # Upcoming batches ranking
    res_u = client.get("/api/future-risk/upcoming-batches")
    assert res_u.status_code == 200
    upcoming = res_u.json()
    assert isinstance(upcoming, list)


def test_alerts_endpoint():
    res = client.get("/api/alerts/")
    assert res.status_code == 200
    alerts = res.json()
    assert isinstance(alerts, list)
    assert len(alerts) > 0
    assert "alert_type" in alerts[0]
    assert "message" in alerts[0]


def test_batches_endpoint():
    res = client.get("/api/batches/")
    assert res.status_code == 200
    batches = res.json()
    assert isinstance(batches, list)
    assert len(batches) > 0
    assert "batch_number" in batches[0]


def test_machines_endpoint():
    res = client.get("/api/machines/")
    assert res.status_code == 200
    machines = res.json()
    assert isinstance(machines, list)
    assert len(machines) > 0
    assert "machine_code" in machines[0]


def test_recommendations_endpoint():
    res = client.get("/api/recommendations/")
    assert res.status_code == 200
    recs = res.json()
    assert isinstance(recs, list)
    assert len(recs) > 0
    assert "recommended_action" in recs[0]
    assert "sop_code" in recs[0]
