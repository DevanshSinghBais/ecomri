# EcoMRI

> **Environmental Intelligence.** EcoMRI is a cinematic environmental-monitoring prototype that turns station observations into prioritized anomaly investigations, spatial context, and field-ready recommended action.

EcoMRI presents a complete product journey from a public, cinematic narrative to an explorable environmental workspace. It is designed to make the sequence **Observe → Measure → Detect → Understand → Act** immediately legible, while keeping the interface restrained, scientific, and accessible.

## Product experience

The public landing page uses the supplied landscape poster and cinematic video as a full-bleed visual introduction. Its narrative explains the relationship between environment, monitoring, patterns, anomalies, and evidence-led action, then directs visitors to the workspace.

The workspace is a responsive product prototype for the fictional Cedar Basin Observatory. It uses an application API and structured demo records to drive the summary metrics, prioritized anomaly feed, station table, trend charts, investigation detail, and interactive geospatial monitoring view.

| Area | What it provides |
| --- | --- |
| **Landing** | Cinematic video hero with poster fallback, editorial narrative, responsive navigation, and workspace entry point. |
| **Overview** | Network status, priority investigations, environmental trend visualization, and immediate investigation order. |
| **Monitoring** | A station table with status, pH, turbidity, and dissolved-oxygen readings. |
| **Geospatial** | A Google Maps monitoring layer with status-coded stations and severity-context halos. |
| **Trends** | A baseline comparison and concise multi-parameter change summary. |
| **Investigator** | Evidence-led anomaly explanation, observation context, confidence, and a recommended field action. |

## Important demo-data notice

All environmental values, locations, anomalies, confidence scores, and recommendations in this project are **simulated demo data**. They are designed to provide credible product interactions and must not be interpreted as live environmental conditions, regulatory findings, or field advice.

The current scenario models a turbidity event at station `ECR-14` and associated downstream observations. The interface always presents the data as simulated, including the workspace timestamp badge.

## Architecture

The application is a React and TypeScript web project with a typed tRPC API running on Express. The environmental domain data is intentionally contained in a small server-side demo-data module, with public API procedures supplying the workspace. This keeps the UI tied to structured records rather than hard-coded presentation strings.

| Layer | Primary responsibility | Key locations |
| --- | --- | --- |
| **Client** | Landing page, workspace views, responsive interaction, charts, and map rendering. | `client/src/pages/`, `client/src/components/` |
| **API** | Typed access to the overview and station-investigation payloads. | `server/routers/environmental.ts` |
| **Demo domain** | Simulated stations, anomalies, evidence, action guidance, and trend records. | `server/environmental.demo.ts` |
| **Maps** | Google Maps JavaScript integration through the project-provided proxy component. | `client/src/components/Map.tsx`, `client/src/components/EnvironmentalMap.tsx` |
| **Static media** | The supplied hero image and video are stored as managed project assets and referenced by their storage paths. | `Home.tsx` |

## Local development

Install dependencies with `pnpm install`, then launch the development server with `pnpm dev`. The managed development environment provides the expected environment configuration for authentication, database, storage, and maps integrations.

```bash
pnpm install
pnpm dev
```

Use the following commands before committing or publishing changes:

```bash
# Run all unit tests
pnpm test

# Check TypeScript types without emitting build output
pnpm check

# Create a production build
pnpm build
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public EcoMRI landing page. |
| `/workspace` | Interactive monitoring and investigation workspace. |

## Extending the prototype

To move from simulated experience to a production monitoring product, replace the demo module with persistent station and observation tables, import validated field data, and apply anomaly logic to historical time series. The existing tRPC contract provides a compact boundary for that change.

Recommended next extensions include user roles for field operators and reviewers, report export, persistent investigation notes, configurable alert thresholds, and audit-ready data provenance.

## Validation

The project includes Vitest coverage for the environmental demo payload and station-investigation relationships. The completed version was also checked with TypeScript and reviewed at desktop and mobile breakpoints.

```text
Vitest: 2 test files passing / 3 tests passing
TypeScript: pnpm check passing
```

## License

This project is provided as an EcoMRI product prototype. Confirm ownership and licensing for supplied media and any live environmental data sources before public reuse.
