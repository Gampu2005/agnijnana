# AI-Based Automotive Wheel / Rim Quality Intelligence System

**SINGULARITY 2026 — Track 3**

## Project Scope
This system is an industrial Quality Intelligence platform built specifically for **aluminium alloy automotive wheels and rims**.

Aluminium alloy wheels undergo high-pressure die casting, heat treatment, CNC machining, and painting. Structural defects (such as shrinkage cavities, inclusions, casting cracks, gas porosity, and machining burrs) compromise vehicle safety and can lead to structural wheel failure under dynamic road loading.

This platform provides an end-to-end industrial quality pipeline:
```
Aluminium Wheel/Rim 
  ➔ Image Inspection 
  ➔ Defect Detection 
  ➔ Defect Classification 
  ➔ Defect Localization 
  ➔ Severity Assessment (Low vs Critical) 
  ➔ Process / Production Data 
  ➔ Root-Cause Analysis 
  ➔ Future Defect Risk Prediction 
  ➔ Corrective-Action Recommendation 
  ➔ Affected Batch / Machine Alerts 
  ➔ Quality Intelligence Dashboard
```

---

## Core Objectives
1. **Wheel Defect Detection & Localization**: Detect and localize surface and casting defects on aluminium alloy wheel/rim images with spatial bounding coordinates and confidence scores.
2. **Defect Severity Assessment**: Classify detected wheel defects into `Low` (cosmetic/reworkable) or `Critical` (structural defect requiring wheel rejection/scrap).
3. **Process Root-Cause Analysis (RCA)**: Correlate wheel casting/machining defects with production process parameters (casting batch, machine station, temperature, pressure, speed, vibration, cycle time) to identify the probable operational root cause with confidence.
4. **Predictive Defect Risk Forecasting**: Analyze historical casting batches and equipment telemetry to forecast impending defect risks for specific machines and subsequent production cycles.
5. **Quality Intelligence Dashboard**: Deliver a unified cockpit for plant quality engineers answering:
   - *What went wrong?*
   - *Where is the defect on the wheel rim?*
   - *How severe is it?*
   - *Why did it probably happen?*
   - *How confident is the diagnosis?*
   - *What is likely to go wrong next?*
   - *What corrective action should the engineer take?*
6. **Corrective Action Recommendations**: Prescribe actionable industrial countermeasures (e.g., mould maintenance, degassing check, thermal recalibration).
7. **Batch & Machine Alerts**: Dispatch instant notifications for affected casting batches and flag high-risk machines.
8. **Industrial Safety & Security**: Enforce role-based access control, strict input validation, and data leakage prevention.

---

## Team Ownership

| Member | Role | Responsibilities |
| :--- | :--- | :--- |
| **Ashish** | Backend / FastAPI Lead | FastAPI architecture, REST endpoints (`/inspection`, `/defects`, `/root-cause`, etc.), AI model serving, DB integration, Auth/RBAC, payload validation. |
| **Ganesh** | Frontend / UI Lead | React + Vite Wheel Quality Dashboard, wheel inspection viewer, defect overlays, severity/root-cause/risk visualization, operator UX. |
| **Deepak** | Database Lead | PostgreSQL schema design, `wheels`, `casting batches`, `machines`, `production cycles`, `process_data`, `defects`, `predictions`, `alerts`. |
| **Vijeth** | Data + AI/ML Lead | Aluminium wheel dataset acquisition, preprocessing, defect detection model, severity mapping, tabular RCA model, risk forecasting, inference export. |

**Shared**: Documentation, Integration testing, CI/CD pipeline, End-to-end deployment.

---

## Repository Structure

```
automotive-wheel-quality-intelligence/
├── README.md                   # Project overview & guidelines
├── .gitignore                  # Exclusions for model weights, datasets, venv
├── .env.example                # Environment variable configuration
├── docker-compose.yml          # Container orchestration (PostgreSQL, FastAPI, React)
├── docs/                       # Specifications and architecture docs
│   ├── architecture/           # System design and wheel inspection data flow
│   ├── dataset/                # Wheel dataset documentation and data dictionary
│   ├── models/                 # Defect detection, severity, RCA, and risk plans
│   └── api/                    # REST API interface specification
├── data/                       # Datasets (ignored in version control)
│   ├── raw/                    # Raw wheel imagery and process logs
│   ├── processed/              # Normalized and split datasets
│   ├── annotations/            # Bounding box / mask annotations
│   └── sample/                 # Sample images for integration testing
├── ai/                         # Machine learning modules (owned by Vijeath)
│   ├── defect_detection/       # Wheel defect localization (YOLO / Detectron / etc.)
│   ├── severity/               # Low vs Critical severity classifier
│   ├── root_cause/             # Process parameter attribution & explainability
│   ├── risk_prediction/        # Machine / batch failure risk forecasting
│   └── recommendation/         # Corrective action recommendation engine
├── backend/                    # FastAPI web application (owned by Ashish)
│   ├── app/
│   │   ├── api/                # Endpoints (/inspection, /defects, /root-cause, /risk, etc.)
│   │   ├── core/               # Configuration settings and CORS
│   │   ├── schemas/            # Pydantic schemas (Wheel AI Contract)
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── database/           # DB engine and session handling
│   │   ├── services/           # Business logic and AI service adapters
│   │   ├── auth/               # Access control and security
│   │   └── main.py             # FastAPI entrypoint
│   ├── tests/                  # Backend unit & health tests
│   ├── requirements.txt
│   └── README.md
├── frontend/                   # React + Vite application (owned by Ganesh)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # WheelInspection, DefectViewer, SeverityCard, RootCause, etc.
│   │   ├── pages/              # Dashboard, Inspection, Batches, Machines
│   │   ├── services/           # API client
│   │   ├── App.jsx             # Shell layout with focused inspection flow
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/                   # Database schemas and migrations (owned by Deepak)
│   ├── schema/schema.sql       # Wheel-specific PostgreSQL schema
│   ├── migrations/             # Migration scripts
│   ├── seeds/                  # Seed scripts
│   └── README.md
├── notebooks/                  # Exploratory data analysis & experiments
├── tests/                      # Integration and End-to-End test suites
└── .github/workflows/ci.yml    # Continuous Integration pipeline
```

---

## Technology Stack
- **Frontend**: React 18, Vite, Vanilla CSS
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn
- **Database**: PostgreSQL 15+, SQLAlchemy
- **AI/ML**: Python (PyTorch / OpenCV / Scikit-learn / LightGBM)
- **Containerization**: Docker, Docker Compose

---

## Current Status
**INTEGRATED OPERATIONAL PHASE (WHEEL & TYRE DUAL STREAM)**
- **Deterministic Computer Vision Metrology**: Active CPU inspection pipeline (`cv_inspection_engine.py`) performs edge gradient analysis, background subtraction, and connected component defect dimensioning for both alloy wheel rims and tyre assemblies.
- **Explainable Predictive Risk Engine**: Historical inspection analysis (`future_risk_engine.py`) forecasts machine and batch risk rates, trend changes, and upcoming production risks.
- **Active Industrial Endpoints**: All REST endpoints (`/api/inspection`, `/api/defects`, `/api/root-cause`, `/api/risk`, `/api/alerts`, `/api/batches`, `/api/machines`, `/api/recommendations`) are fully functional with structured telemetry and test coverage.
- **Model Checkpoints**: PyTorch/YOLO checkpoint files in `ai/model_assets/` are tracked via Git LFS pointers. Run `git lfs pull` to fetch full binary weights for GPU training environments.

---

## Setup Instructions

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger API docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Dashboard: `http://localhost:5188`

### 4. Database Setup (Optional)
```bash
docker-compose up -d db
psql -U quality_user -d quality_db -f database/schema/schema.sql
```

---

## Cloud Deployment Guide

### Option A: 1-Click / Blueprint Deployment (Render)
This repository includes a [`render.yaml`](./render.yaml) blueprint:
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a **New > Blueprint Instance** and select your repository.
3. Render automatically provisions the FastAPI backend service and the static React frontend service with proper routing and environment links.

### Option B: Deploy Frontend to Vercel
1. Import repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://your-backend.onrender.com`).
5. Deploy. SPA routing is already configured in [`frontend/vercel.json`](./frontend/vercel.json).

### Option C: Deploy Frontend to Netlify
1. Import repository into [Netlify](https://netlify.com).
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variable: `VITE_API_BASE_URL` set to your backend URL.
6. Deploy. SPA routing is handled by [`frontend/public/_redirects`](./frontend/public/_redirects).

### Option D: Deploy Backend to Render / Railway / Fly.io
1. Create a Web Service pointing to `backend/`.
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: `*` (or your frontend domain, e.g. `https://your-frontend.vercel.app`)
   - `SECRET_KEY`: `<generate-a-random-64-character-string>`

### Option E: Full-Stack Docker Deployment
```bash
docker-compose up --build -d
```
Access frontend at `http://localhost:5188` and backend at `http://localhost:8000`.

---

## REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Service readiness and operational health check |
| `/api/inspection/upload` | `POST` | Upload RGB wheel or tyre specimen image |
| `/api/inspection/inspect` | `POST` | Run dual-stream computer vision metrology pipeline |
| `/api/defects/` | `GET` | Filter detected defects by batch, machine, and severity |
| `/api/root-cause/` | `GET` | Retrieve engineering root cause knowledge base mappings |
| `/api/root-cause/analyze` | `POST` | Run attribution analysis for identified defect anomaly |
| `/api/risk/` | `GET` | Consolidated plant defect risk forecast summary |
| `/api/future-risk/machines` | `GET` | Equipment defect risk ranking and historical trend changes |
| `/api/future-risk/batches` | `GET` | Casting lot failure risk rankings and defect shares |
| `/api/future-risk/upcoming-batches` | `GET` | Scheduled upcoming batch risk forecast |
| `/api/alerts/` | `GET` | Active quality alerts (`BATCH_QUARANTINE`, `MACHINE_DRIFT`) |
| `/api/batches/` | `GET` | Live casting batch telemetry and disposition records |
| `/api/machines/` | `GET` | Die-casting and curing press fleet operational health |
| `/api/recommendations/` | `GET` | Corrective action maintenance SOP recommendations |

---

## Wheel & Tyre Defect Taxonomy

### 9 Rim Defect Classes
1. `rim_defect` — Bead seat / flange rim geometry flaw
2. `scratch` — Superficial surface handling scratch
3. `blow_hole` — Sub-surface trapped gas casting cavity
4. `incomplete_welding` — Incomplete rim weld seam / root gap
5. `bent_rim` — Radial or lateral runout distortion
6. `crack` — Structural or metallurgical fatigue crack
7. `porosity` — Gas porosity cluster (degassing failure)
8. `scuff` — Outer rim lip friction scuff
9. `paint_damage` — Clear-coat / paint delamination

### 14 Tyre Defect Classes (Classes 0–13)
`Generic_Defect` (0), `Bulge` (1), `Cracks` (2), `Flat_Spots` (3), `Good` (4), `Pitting` (5), `Puncture` (6), `Bad_Tire` (7), `Bald_Tire` (8), `Normal_Tire` (9), `Xray_Open` (10), `Cord_Defect` (11), `Impurity` (12), `Belt_Defect` (13)

---

## Operator Cockpit Hotkeys

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Trigger Optical Scan & Defect Inference |
| <kbd>A</kbd> | Authorize Conforming Line Release (`LINE_RELEASE`) |
| <kbd>X</kbd> | Dispatch Critical Scrap Quarantine (`SCRAP_QUARANTINE`) |
| <kbd>W</kbd> | Dispatch Robotic Rework Disposition (`ROBOTIC_REWORK`) |
| <kbd>1</kbd>–<kbd>5</kbd> | Instant Specimen Selection (Alloy Rim & Tyre Presets) |
