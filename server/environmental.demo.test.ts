import { describe, expect, it } from "vitest";
import { getOverviewPayload, getStationInvestigation } from "./environmental.demo";

describe("EcoMRI simulated environmental dataset", () => {
  it("exposes clearly labelled demo data with a prioritized anomaly", () => {
    const overview = getOverviewPayload();
    expect(overview.demo).toBe(true);
    expect(overview.anomalies[0]).toMatchObject({
      stationId: "ECR-14",
      parameter: "Turbidity",
      severity: "High",
    });
  });

  it("links a station investigation to its evidence and trend context", () => {
    const investigation = getStationInvestigation("ECR-14");
    expect(investigation?.primaryAnomaly?.evidence.length).toBeGreaterThan(2);
    expect(investigation?.recentTrend.at(-1)?.turbidity).toBe(48);
  });
});
