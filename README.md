<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00C6FF,100:0072FF&height=180&section=header&text=EcoMRI&fontSize=48&fontColor=ffffff&fontAlignY=35&desc=Environmental%20Intelligence%20Platform&descAlignY=55&descSize=18" width="100%" />
</p>

<p align="center">
  <strong>Observe → Measure → Detect → Understand → Act</strong>
</p>

<p align="center">
  A cinematic environmental intelligence platform that turns monitoring data into prioritized anomalies, spatial context, evidence, and recommended action.
</p>

<p align="center">
  <a href="https://ecomri-gsy3klvs.manus.space">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-0072FF?style=for-the-badge" />
  </a>
  <a href="https://github.com/DevanshSinghBais/ecomri">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

---
<p align="center">
  <img src="./assets/ecomri-hero.png"
       alt="EcoMRI Environmental Intelligence Platform"
       width="100%" />
</p>
## 🧠 What is EcoMRI?

EcoMRI is an **environmental intelligence prototype** designed to transform environmental monitoring observations into actionable investigations.

Instead of simply displaying raw measurements, EcoMRI creates a workflow:

```text
Environmental Observations
          ↓
      Monitoring
          ↓
    Anomaly Detection
          ↓
    Spatial Context
          ↓
   Evidence & Confidence
          ↓
   Recommended Action
```

The goal is to make environmental data easier to **observe, understand, investigate, and act upon**.

> ⚠️ **Demo Data:** All environmental values, locations, anomalies, confidence scores, and recommendations are simulated demo data. They do not represent live environmental conditions, regulatory findings, or field advice.

---

## ✨ Features

### 🌍 Environmental Overview

- Network monitoring status
- Priority investigations
- Environmental trend visualization
- Investigation prioritization
- Structured monitoring records

### 🚨 Anomaly Investigation

- Prioritized anomaly feed
- Evidence-backed explanations
- Observation context
- Confidence scoring
- Recommended field actions
- Investigation workflow

### 📡 Station Monitoring

Environmental stations provide structured observations including:

- pH
- Turbidity
- Dissolved oxygen
- Station status
- Observation timestamps

### 🗺️ Geospatial Monitoring

Interactive environmental monitoring map with:

- Station locations
- Status indicators
- Severity context
- Spatial investigation

### 📈 Environmental Trends

- Baseline comparisons
- Multi-parameter trends
- Change summaries
- Historical investigation context

### 🎬 Cinematic Product Experience

EcoMRI isn't designed as a traditional dashboard.

The experience starts with a cinematic landing page and transitions into an interactive environmental intelligence workspace.

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────┐
│                 EcoMRI UI                   │
│                                             │
│  Landing Page • Dashboard • Monitoring      │
│  Trends • Maps • Investigation              │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              tRPC API / Express             │
│                                             │
│  Typed environmental data procedures        │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│          Environmental Domain Layer         │
│                                             │
│  Stations • Observations • Anomalies        │
│  Evidence • Trends • Recommendations        │
└─────────────────────────────────────────────┘
```

### Project Structure

```text
ecomri/
├── client/
│   └── src/
│       ├── components/
│       └── pages/
│
├── server/
│   ├── routers/
│   │   └── environmental.ts
│   └── environmental.demo.ts
│
├── shared/
├── drizzle/
├── patches/
├── package.json
├── drizzle.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Responsive UI
- Data visualization
- Google Maps integration

### Backend

- Node.js
- Express
- tRPC
- TypeScript

### Data & Infrastructure

- Drizzle
- Structured environmental domain models
- Typed API contracts

### Testing & Quality

- Vitest
- TypeScript
- Prettier

---

## 🚀 Local Development

### 1. Clone

```bash
git clone https://github.com/DevanshSinghBais/ecomri.git
cd ecomri
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start development server

```bash
pnpm dev
```

The application should then be available through your local development server.

---

## 🧪 Development Commands

Run tests:

```bash
pnpm test
```

Check TypeScript:

```bash
pnpm check
```

Create production build:

```bash
pnpm build
```

---

## 🧭 Routes

| Route | Description |
|---|---|
| `/` | Public EcoMRI landing page |
| `/workspace` | Environmental monitoring workspace |

---

## 🔬 Current Demo Scenario

The current prototype models a simulated environmental event involving station:

```text
ECR-14
```

The scenario demonstrates how an environmental observation can move through:

```text
Observation
   ↓
Anomaly
   ↓
Evidence
   ↓
Confidence
   ↓
Investigation
   ↓
Recommended Action
```

All values in this scenario are **simulated**.

---

## 🔮 Future Roadmap

### Phase 1 — Intelligence

- [ ] Real environmental datasets
- [ ] Historical time-series analysis
- [ ] Automated anomaly detection
- [ ] Configurable alert thresholds
- [ ] ML-based environmental forecasting

### Phase 2 — Operations

- [ ] Field operator accounts
- [ ] Investigation notes
- [ ] Report generation
- [ ] Alert management
- [ ] Audit-ready data provenance

### Phase 3 — Scale

- [ ] Persistent environmental database
- [ ] Streaming sensor ingestion
- [ ] Real-time monitoring
- [ ] Advanced geospatial analytics
- [ ] Production ML inference pipeline

---

## ⚠️ Important Disclaimer

EcoMRI is currently a **product prototype using simulated environmental data**.

The information displayed by the application should not be interpreted as:

- Live environmental monitoring
- Regulatory findings
- Scientific measurements
- Emergency information
- Professional environmental advice

---

## 🌐 Live Demo

<p align="center">
  <a href="https://ecomri-gsy3klvs.manus.space">
    <img src="https://img.shields.io/badge/OPEN%20ECOMRI-00C6FF?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
</p>

---

## 👨‍💻 Author

**Devansh Singh Bais**

AI/ML • LLMs • Computer Vision • Backend • AI Engineering

<p align="center">
  <a href="https://github.com/DevanshSinghBais">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/devansh-singh-bais-748b192b5/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
</p>

---

<p align="center">
  <i>Turning environmental data into intelligence.</i>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0072FF,100:00C6FF&height=100&section=footer" width="100%" />
</p>
