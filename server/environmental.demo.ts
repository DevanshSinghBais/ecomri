export type RiskStatus = "normal" | "watch" | "anomaly" | "high-risk";

export type Station = {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  status: RiskStatus;
  waterbody: string;
  latest: {
    ph: number;
    turbidity: number;
    oxygen: number;
    temperature: number;
  };
};

export type Anomaly = {
  id: string;
  stationId: string;
  parameter: string;
  observed: number;
  unit: string;
  expected: string;
  deviation: string;
  severity: "High" | "Elevated" | "Watch";
  confidence: number;
  time: string;
  action: string;
  evidence: string[];
};

const stations: Station[] = [
  {
    id: "ECR-14",
    name: "North Reach",
    region: "Upper Catchment",
    latitude: 46.8826,
    longitude: -121.7325,
    status: "high-risk",
    waterbody: "North Fork",
    latest: { ph: 6.7, turbidity: 48, oxygen: 6.1, temperature: 14.2 },
  },
  {
    id: "ECR-08",
    name: "Confluence",
    region: "Mid Basin",
    latitude: 46.8436,
    longitude: -121.7698,
    status: "anomaly",
    waterbody: "Cedar Run",
    latest: { ph: 7.0, turbidity: 25, oxygen: 6.9, temperature: 13.8 },
  },
  {
    id: "ECR-03",
    name: "South Bend",
    region: "Lower Valley",
    latitude: 46.8109,
    longitude: -121.8021,
    status: "watch",
    waterbody: "Cedar Run",
    latest: { ph: 7.2, turbidity: 17, oxygen: 7.6, temperature: 13.1 },
  },
  {
    id: "ECR-01",
    name: "Headwaters",
    region: "Upper Catchment",
    latitude: 46.9132,
    longitude: -121.6854,
    status: "normal",
    waterbody: "North Fork",
    latest: { ph: 7.4, turbidity: 9, oxygen: 8.7, temperature: 11.9 },
  },
  {
    id: "ECR-22",
    name: "Estuary Gate",
    region: "Lower Valley",
    latitude: 46.7741,
    longitude: -121.8315,
    status: "normal",
    waterbody: "Cedar Run",
    latest: { ph: 7.3, turbidity: 11, oxygen: 8.1, temperature: 13.3 },
  },
];

const anomalies: Anomaly[] = [
  {
    id: "AN-042",
    stationId: "ECR-14",
    parameter: "Turbidity",
    observed: 48,
    unit: "NTU",
    expected: "8–16 NTU",
    deviation: "+4.1σ",
    severity: "High",
    confidence: 94,
    time: "Today, 07:20",
    action: "Inspect the upstream outfall and collect a confirmatory grab sample within 4 hours.",
    evidence: [
      "Turbidity rose 246% above the 21-day rolling baseline.",
      "Dissolved oxygen declined 1.8 mg/L during the same observation window.",
      "The ECR-08 downstream sensor shows a matching but smaller rise 5 hours later.",
    ],
  },
  {
    id: "AN-041",
    stationId: "ECR-08",
    parameter: "Turbidity",
    observed: 25,
    unit: "NTU",
    expected: "7–14 NTU",
    deviation: "+2.7σ",
    severity: "Elevated",
    confidence: 86,
    time: "Today, 12:10",
    action: "Verify downstream transport and assess the adjacent tributary crossing.",
    evidence: [
      "A sustained positive trend followed the ECR-14 event.",
      "Dissolved oxygen remains below the seasonal baseline.",
      "No comparable signal appears at the headwaters control station.",
    ],
  },
  {
    id: "AN-040",
    stationId: "ECR-03",
    parameter: "Dissolved oxygen",
    observed: 7.6,
    unit: "mg/L",
    expected: "7.8–9.2 mg/L",
    deviation: "−1.6σ",
    severity: "Watch",
    confidence: 72,
    time: "Yesterday, 18:00",
    action: "Continue high-frequency monitoring through the next diurnal cycle.",
    evidence: [
      "The oxygen signal is trending down but remains above the action threshold.",
      "Water temperature is seasonally stable.",
      "No nitrate co-signal has been detected.",
    ],
  },
];

const trend = [
  { day: "Aug 17", baseline: 12, turbidity: 11, oxygen: 8.6 },
  { day: "Aug 18", baseline: 12, turbidity: 13, oxygen: 8.5 },
  { day: "Aug 19", baseline: 12, turbidity: 12, oxygen: 8.6 },
  { day: "Aug 20", baseline: 12, turbidity: 16, oxygen: 8.1 },
  { day: "Aug 21", baseline: 12, turbidity: 19, oxygen: 7.7 },
  { day: "Aug 22", baseline: 12, turbidity: 31, oxygen: 6.8 },
  { day: "Aug 23", baseline: 12, turbidity: 48, oxygen: 6.1 },
];

export function getOverviewPayload() {
  return {
    demo: true,
    lastUpdated: "23 Aug 2026 · 14:40 UTC",
    stations,
    anomalies,
    trend,
    summary: {
      stationsMonitored: stations.length,
      priorityInvestigations: anomalies.filter(anomaly => anomaly.severity !== "Watch").length,
      highRiskAreas: stations.filter(station => station.status === "high-risk").length,
      dataCompleteness: 98.6,
    },
  };
}

export function getStationInvestigation(stationId: string) {
  const station = stations.find(item => item.id === stationId);
  if (!station) return null;

  const stationAnomalies = anomalies.filter(item => item.stationId === station.id);
  const primary = stationAnomalies[0];
  return {
    station,
    primaryAnomaly: primary ?? null,
    relatedStations: stations.filter(item => item.id !== station.id).slice(0, 3),
    recentTrend: trend,
  };
}
