import { EnvironmentalMap } from "@/components/EnvironmentalMap";
import { trpc } from "@/lib/trpc";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  Database,
  FileSearch,
  LineChart as LineChartIcon,
  MapPinned,
  Menu,
  ScanLine,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocation } from "wouter";
import type { Anomaly, Station } from "../../../server/environmental.demo";
import type { LucideIcon } from "lucide-react";

type TrendPoint = { day: string; baseline: number; turbidity: number; oxygen: number };
type OverviewData = {
  demo: boolean;
  lastUpdated: string;
  stations: Station[];
  anomalies: Anomaly[];
  trend: TrendPoint[];
  summary: { stationsMonitored: number; priorityInvestigations: number; highRiskAreas: number; dataCompleteness: number };
};
type InvestigationData = { station: Station; primaryAnomaly: Anomaly | null; relatedStations: Station[]; recentTrend: TrendPoint[] } | undefined;

type WorkspaceView = "overview" | "monitoring" | "map" | "trends" | "investigator";

const navItems: { id: WorkspaceView; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: ScanLine },
  { id: "monitoring", label: "Monitoring", icon: Activity },
  { id: "map", label: "Geospatial", icon: MapPinned },
  { id: "trends", label: "Trends", icon: LineChartIcon },
  { id: "investigator", label: "Investigator", icon: FileSearch },
];

const statusStyles = {
  normal: "bg-[#E3EEE8] text-[#2F6849]",
  watch: "bg-[#F7ECD3] text-[#8B641F]",
  anomaly: "bg-[#F7E0D2] text-[#9B4C27]",
  "high-risk": "bg-[#F2D8D4] text-[#8D342E]",
};

const statusLabel = {
  normal: "Normal",
  watch: "Watch",
  anomaly: "Anomaly",
  "high-risk": "High risk",
};

function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.11em] ${statusStyles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`border border-[#ddd7cb] bg-[#fffdf8] ${className}`}>{children}</section>;
}

export default function Workspace() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<WorkspaceView>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const { data, error, isLoading, refetch } = trpc.environmental.overview.useQuery();

  useEffect(() => {
    if (data && !selectedId) setSelectedId(data.anomalies[0]?.stationId ?? data.stations[0]?.id);
  }, [data, selectedId]);

  const selectedStation = useMemo(
    () => data?.stations.find(station => station.id === selectedId) ?? data?.stations[0],
    [data, selectedId],
  );
  const investigation = trpc.environmental.investigation.useQuery(
    { stationId: selectedStation?.id ?? "ECR-14" },
    { enabled: Boolean(selectedStation) },
  );

  const setStation = (stationId: string) => {
    setSelectedId(stationId);
    setView("investigator");
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f1ea] text-[#14181a]">
        <div className="w-72">
          <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[#2e5c66]"><ScanLine className="h-4 w-4 animate-pulse" /> Initializing field model</div>
          <div className="h-px overflow-hidden bg-[#d9d2c6]"><div className="h-full w-2/3 animate-pulse bg-[#2f4a3c]" /></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f1ea] px-6 text-center text-[#14181a]">
        <Panel className="max-w-md p-8">
          <CircleAlert className="mx-auto mb-4 h-7 w-7 text-[#a6342b]" />
          <h1 className="font-display text-3xl">Signal unavailable.</h1>
          <p className="mt-3 text-sm leading-6 text-[#4a5450]">The environmental model could not be loaded. Check the connection and try again.</p>
          <button onClick={() => refetch()} className="mt-6 border border-[#2f4a3c] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2f4a3c]">Retry data request</button>
        </Panel>
      </div>
    );
  }

  const currentInvestigation = investigation.data;
  const priorityAnomaly = currentInvestigation?.primaryAnomaly;
  const activeLabel = navItems.find(item => item.id === view)?.label;

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#14181a]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-white/10 bg-[#14181a] px-5 py-6 text-[#fbf9f4] lg:block">
        <button onClick={() => setLocation("/")} className="mb-14 flex items-center gap-2 text-left" aria-label="Return to EcoMRI landing page">
          <span className="grid h-8 w-8 place-items-center border border-[#b7c5ba]/50 text-[#dfe9e1]"><ScanLine className="h-4 w-4" /></span>
          <span><span className="block font-display text-xl leading-none">EcoMRI</span><span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-[#aebbb0]">Environmental intelligence</span></span>
        </button>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#88958b]">Field workspace</p>
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = view === item.id;
            return <button key={item.id} onClick={() => setView(item.id)} className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left text-sm transition-colors ${active ? "border-[#dfe9e1] bg-white/7 text-white" : "border-transparent text-[#b7c2b9] hover:bg-white/5 hover:text-white"}`}><Icon className="h-4 w-4" />{item.label}</button>;
          })}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 border-t border-white/10 pt-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#9cad9f]"><span className="h-1.5 w-1.5 rounded-full bg-[#8bb88d]" /> Live model context</div>
          <p className="mt-2 text-xs leading-5 text-[#aebbb0]">Demo scenario · upper Cedar basin</p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#ddd7cb] bg-[#f4f1ea]/90 px-5 backdrop-blur md:px-8 lg:ml-[248px]">
        <div className="flex items-center gap-3">
          <button className="grid h-9 w-9 place-items-center border border-[#d9d2c6] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open workspace navigation"><Menu className="h-4 w-4" /></button>
          <div><p className="font-mono text-[10px] uppercase tracking-[0.19em] text-[#65706b]">Workspace / <span className="text-[#2f4a3c]">{activeLabel}</span></p><h1 className="mt-0.5 font-display text-xl leading-none">Cedar Basin Observatory</h1></div>
        </div>
        <div className="hidden items-center gap-3 sm:flex"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#65706b]">{data.lastUpdated}</span><span className="border border-[#c8d7c9] bg-[#e7f0e7] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#2f6849]">Simulated data</span></div>
      </header>

      <AnimatePresence>
        {mobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#14181a] p-6 text-[#fbf9f4] lg:hidden"><div className="flex items-center justify-between"><span className="font-display text-2xl">EcoMRI</span><button onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button></div><nav className="mt-14 space-y-2">{navItems.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => { setView(item.id); setMobileOpen(false); }} className="flex w-full items-center gap-4 border-b border-white/10 py-4 text-left text-lg"><Icon className="h-5 w-5 text-[#b7c2b9]" />{item.label}</button>; })}</nav></motion.div>}
      </AnimatePresence>

      <main className="px-5 py-7 md:px-8 md:py-10 lg:ml-[248px]">
        <div className="mx-auto max-w-[1500px]">
          <section className="mb-8 flex flex-col justify-between gap-4 border-b border-[#d9d2c6] pb-7 md:flex-row md:items-end">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#2e5c66]">Observe → Measure → Detect → Understand → Act</p><h2 className="mt-2 max-w-2xl font-display text-4xl tracking-[-0.04em] md:text-5xl">A clearer reading of the basin.</h2></div>
            <p className="max-w-sm text-sm leading-6 text-[#5b6661]">Prioritize fieldwork with a connected view of stations, deviations, and the observation context behind every signal.</p>
          </section>

          {view === "overview" && <OverviewView data={data} selectStation={setStation} />}
          {view === "monitoring" && <MonitoringView data={data} selectStation={setStation} />}
          {view === "map" && <MapView data={data} selectStation={setStation} />}
          {view === "trends" && <TrendsView data={data} />}
          {view === "investigator" && <InvestigatorView station={selectedStation} investigation={currentInvestigation} loading={investigation.isLoading} onMap={() => setView("map")} />}
        </div>
      </main>
    </div>
  );
}

function OverviewView({ data, selectStation }: { data: OverviewData; selectStation: (id: string) => void }) {
  const metrics: [string, string, string, LucideIcon][] = [
    ["Stations online", data.summary.stationsMonitored.toString().padStart(2, "0"), "All reporting", ShieldCheck],
    ["Priority investigations", data.summary.priorityInvestigations.toString().padStart(2, "0"), "Requires review", AlertTriangle],
    ["High-risk areas", data.summary.highRiskAreas.toString().padStart(2, "0"), "Field action due", CircleAlert],
    ["Data completeness", `${data.summary.dataCompleteness}%`, "Last 24 hours", Database],
  ];
  return <>
    <div className="grid border border-[#ddd7cb] bg-[#fffdf8] sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, meta, Icon], index) => <div key={String(label)} className={`p-5 ${index ? "border-l border-[#ddd7cb]" : ""}`}><div className="flex items-center justify-between text-[#65706b]"><span className="font-mono text-[10px] uppercase tracking-[0.14em]">{label}</span><Icon className="h-4 w-4" /></div><div className="mt-6 font-display text-4xl tracking-[-0.04em]">{value}</div><div className="mt-2 text-xs text-[#65706b]">{meta}</div></div>)}</div>
    <div className="mt-7 grid gap-7 xl:grid-cols-[1.3fr_.7fr]">
      <Panel className="p-5 md:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Network condition</p><h3 className="mt-1 font-display text-3xl">Where to look first</h3></div><button onClick={() => selectStation(data.anomalies[0].stationId)} className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#2f4a3c] hover:underline">Investigate signal <ArrowUpRight className="h-3.5 w-3.5" /></button></div><div className="mt-7 h-[270px]"><TrendChart trend={data.trend} /></div><p className="mt-4 border-t border-[#ddd7cb] pt-4 text-xs leading-5 text-[#65706b]">Turbidity at <strong className="font-semibold text-[#14181a]">North Reach</strong> crossed the expected operating band after a steady upstream rise.</p></Panel>
      <Panel className="p-5 md:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Investigation order</p><div className="mt-4 divide-y divide-[#e5ded3]">{data.anomalies.map((anomaly, index) => <button key={anomaly.id} onClick={() => selectStation(anomaly.stationId)} className="group flex w-full items-start gap-4 py-4 text-left"><span className="font-display text-2xl text-[#9aa39b]">0{index + 1}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><strong className="text-sm">{anomaly.stationId} · {anomaly.parameter}</strong><ChevronRight className="h-4 w-4 text-[#7e8882] transition-transform group-hover:translate-x-1" /></span><span className="mt-1 block text-xs text-[#65706b]">{anomaly.observed} {anomaly.unit} · {anomaly.deviation} from baseline</span></span></button>)}</div></Panel>
    </div>
  </>;
}

function MonitoringView({ data, selectStation }: { data: OverviewData; selectStation: (id: string) => void }) {
  return <Panel className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ddd7cb] p-5 md:p-7"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Monitoring network</p><h3 className="mt-1 font-display text-3xl">Station status</h3></div><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#65706b]">5 stations · 4 parameters</span></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-[#ddd7cb] bg-[#f7f4ed] font-mono text-[10px] uppercase tracking-[0.13em] text-[#65706b]"><tr><th className="px-6 py-4 font-medium">Station</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 font-medium">Turbidity</th><th className="px-6 py-4 font-medium">Dissolved oxygen</th><th className="px-6 py-4 font-medium">pH</th><th className="px-6 py-4 font-medium"></th></tr></thead><tbody>{data.stations.map(station => <tr key={station.id} className="border-b border-[#e7e1d7] last:border-0 hover:bg-[#faf8f2]"><td className="px-6 py-5"><strong className="text-sm">{station.id}</strong><span className="ml-2 text-xs text-[#65706b]">{station.name}</span></td><td className="px-6 py-5"><StatusBadge status={station.status} /></td><td className="px-6 py-5 font-mono text-sm">{station.latest.turbidity} <span className="text-xs text-[#65706b]">NTU</span></td><td className="px-6 py-5 font-mono text-sm">{station.latest.oxygen} <span className="text-xs text-[#65706b]">mg/L</span></td><td className="px-6 py-5 font-mono text-sm">{station.latest.ph}</td><td className="px-6 py-5"><button onClick={() => selectStation(station.id)} className="text-xs font-bold text-[#2f4a3c] hover:underline">Inspect</button></td></tr>)}</tbody></table></div></Panel>;
}

function MapView({ data, selectStation }: { data: OverviewData; selectStation: (id: string) => void }) {
  return <div className="grid gap-7 xl:grid-cols-[1fr_340px]"><Panel className="min-h-[530px] overflow-hidden"><div className="border-b border-[#ddd7cb] p-5 md:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Spatial investigation</p><h3 className="mt-1 font-display text-3xl">Connected environmental signals</h3><p className="mt-3 max-w-xl text-sm leading-6 text-[#65706b]">Select a station to move from regional context into its field-ready evidence chain.</p></div><EnvironmentalMap stations={data.stations} onStationSelect={selectStation} /></Panel><Panel className="p-5 md:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Map legend</p><div className="mt-6 space-y-5">{(["high-risk", "anomaly", "watch", "normal"] as const).map(status => <div key={status} className="flex items-center justify-between"><StatusBadge status={status} /><span className="text-xs text-[#65706b]">{status === "high-risk" ? "Immediate field action" : status === "anomaly" ? "Evidence building" : status === "watch" ? "Monitor trend" : "Within baseline"}</span></div>)}</div><div className="mt-8 border-t border-[#ddd7cb] pt-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#65706b]">Observation context</p><p className="mt-2 text-sm leading-6 text-[#4a5450]">Halo radii indicate the current area of investigation, not the full extent of environmental impact.</p></div></Panel></div>;
}

function TrendsView({ data }: { data: OverviewData }) {
  return <div className="grid gap-7 xl:grid-cols-[1.35fr_.65fr]"><Panel className="p-5 md:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Temporal pattern</p><h3 className="mt-1 font-display text-3xl">Turbidity against its expected band</h3><div className="mt-8 h-[350px]"><TrendChart trend={data.trend} /></div></Panel><Panel className="p-5 md:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Co-signals</p><h3 className="mt-1 font-display text-3xl">What changed together</h3><div className="mt-8 space-y-5"><SignalRow label="Turbidity" value="+300%" note="7-day change" tone="bg-[#a6342b]" /><SignalRow label="Dissolved oxygen" value="−29%" note="7-day change" tone="bg-[#c1622b]" /><SignalRow label="pH" value="−0.4" note="Relative stability" tone="bg-[#2e5c66]" /></div><p className="mt-8 border-t border-[#ddd7cb] pt-5 text-xs leading-5 text-[#65706b]">The inverse turbidity–oxygen movement supports prioritizing a source investigation over treating this as a single-sensor outlier.</p></Panel></div>;
}

function SignalRow({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) { return <div><div className="flex items-baseline justify-between"><span className="text-sm font-semibold">{label}</span><span className="font-display text-3xl">{value}</span></div><div className="mt-3 h-1 bg-[#e7e1d7]"><div className={`h-full ${tone}`} style={{ width: label === "Turbidity" ? "88%" : label === "Dissolved oxygen" ? "62%" : "24%" }} /></div><p className="mt-2 text-xs text-[#65706b]">{note}</p></div>; }

function InvestigatorView({ station, investigation, loading, onMap }: { station: Station | undefined; investigation: InvestigationData; loading: boolean; onMap: () => void }) {
  if (loading || !station) return <Panel className="p-8"><div className="h-5 w-36 animate-pulse bg-[#e7e1d7]" /><div className="mt-6 h-56 animate-pulse bg-[#f0ede5]" /></Panel>;
  const anomaly = investigation?.primaryAnomaly;
  if (!anomaly) return <Panel className="p-10 text-center"><Check className="mx-auto h-7 w-7 text-[#3e7a5c]" /><h3 className="mt-4 font-display text-3xl">No active investigation.</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#65706b]">This station is within its current monitoring baseline. Select a flagged station from the network to inspect evidence.</p><button onClick={onMap} className="mt-6 text-xs font-bold text-[#2f4a3c] hover:underline">Open geospatial view</button></Panel>;
  return <div className="grid gap-7 xl:grid-cols-[1.25fr_.75fr]"><Panel className="p-5 md:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2e5c66]">Evidence-led investigation · {anomaly.id}</p><h3 className="mt-1 font-display text-4xl">{station.id} — {station.name}</h3><p className="mt-2 text-sm text-[#65706b]">{station.waterbody} · {station.region}</p></div><StatusBadge status={station.status} /></div><div className="mt-8 grid border border-[#ddd7cb] sm:grid-cols-3"><MetricReadout label={anomaly.parameter} value={`${anomaly.observed}`} unit={anomaly.unit} /><MetricReadout label="Expected range" value={anomaly.expected} unit="21-day baseline" /><MetricReadout label="Deviation" value={anomaly.deviation} unit={`${anomaly.confidence}% confidence`} /></div><div className="mt-8"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#65706b]">Observation record</p><div className="mt-3 h-[260px]"><TrendChart trend={investigation?.recentTrend ?? []} /></div></div></Panel><div className="space-y-7"><Panel className="p-5 md:p-7"><div className="flex items-center gap-2 text-[#2f4a3c]"><Sparkles className="h-4 w-4" /><span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">Investigator synthesis</span></div><p className="mt-4 font-display text-2xl leading-[1.05]">The signal is consistent with an upstream sediment or discharge event, not an isolated reading.</p><ul className="mt-6 space-y-3 border-t border-[#ddd7cb] pt-5">{anomaly.evidence.map(item => <li key={item} className="flex gap-3 text-xs leading-5 text-[#4a5450]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e5c66]" />{item}</li>)}</ul></Panel><Panel className="border-[#aebfac] bg-[#e6eee7] p-5 md:p-7"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#2f4a3c]">Recommended field action</p><p className="mt-3 text-sm leading-6 text-[#284435]">{anomaly.action}</p><button onClick={onMap} className="mt-5 flex items-center gap-2 text-xs font-bold text-[#2f4a3c] hover:underline">Locate in map <ArrowUpRight className="h-3.5 w-3.5" /></button></Panel></div></div>;
}

function MetricReadout({ label, value, unit }: { label: string; value: string; unit: string }) { return <div className="border-b border-[#ddd7cb] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#65706b]">{label}</p><p className="mt-3 font-display text-3xl tracking-[-0.04em]">{value}</p><p className="mt-1 text-xs text-[#65706b]">{unit}</p></div>; }

function TrendChart({ trend }: { trend: { day: string; baseline: number; turbidity: number; oxygen: number }[] }) { return <ResponsiveContainer width="100%" height="100%"><LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e4ded4" strokeDasharray="2 5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#65706b" }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#65706b" }} /><Tooltip contentStyle={{ background: "#fffdf8", border: "1px solid #d9d2c6", fontSize: 12 }} /><Line type="monotone" dataKey="baseline" name="Expected baseline" stroke="#8a6e4b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} /><Line type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="#a6342b" strokeWidth={2.3} dot={{ r: 3, strokeWidth: 0, fill: "#a6342b" }} /><Line type="monotone" dataKey="oxygen" name="Oxygen (mg/L)" stroke="#2e5c66" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>; }
