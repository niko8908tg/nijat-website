import { useState, useMemo } from "react";
import rawData from "./trainingDataParsed.json";
import trainingStyles from "../Training _ Pedro Araújo_files/_slug_.1PXzLZaY.css?raw";
import fontStyles from "../Training _ Pedro Araújo_files/css2?raw";

const oe = new Set([
  "running", "trail_running", "treadmill_running", "cycling", "indoor_cycling",
  "swimming", "lap_swimming", "open_water_swimming", "hiking", "walking",
  "elliptical", "indoor_rowing", "multi_sport"
]);

const G = {
  running: "Run",
  trail_running: "Trail Run",
  treadmill_running: "Treadmill",
  cycling: "Cycling",
  swimming: "Swim",
  strength_training: "Strength",
  yoga: "Yoga",
  hiking: "Hike",
  walking: "Walk",
  elliptical: "Elliptical",
  other: "Other",
  indoor_cycling: "Indoor Cycling",
  open_water_swimming: "Open Water",
  lap_swimming: "Pool Swim",
  rock_climbing: "Climbing",
  bouldering: "Bouldering",
  fitness_equipment: "Gym",
  multi_sport: "Multi Sport",
  breathwork: "Breathwork",
  pilates: "Pilates",
  indoor_rowing: "Rowing",
  indoor_climbing: "Climbing"
};

const de = {
  running: "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z",
  trail_running: "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z",
  strength_training: "M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z",
  cycling: "M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z",
  swimming: "M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zm0-4.5c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zM8.67 12c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36l.85-.85c-.65-.65-1.72-1.65-2.68-2.81-.18-.22-.36-.38-.54-.49C12.37 7.47 11.68 7 11 7c-.55 0-1.08.22-1.46.59L7.39 9.7c-.38.39-.39 1.01-.01 1.39l1.29 1.29v-.38zm3.83-7.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z",
  hiking: "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.56-.89-1.68-1.25-2.65-.84L7 8v5h2V8.9z"
};

const X = {
  running: "#e8b880", trail_running: "#d4854a", treadmill_running: "#f5d5b0",
  cycling: "#6ba3d6", indoor_cycling: "#8bb8e0", swimming: "#5bc0de",
  lap_swimming: "#5bc0de", open_water_swimming: "#4aa8c4", strength_training: "#b07cd8",
  hiking: "#7cc47c", walking: "#a0d0a0", yoga: "#d4a0d4", pilates: "#c890c8",
  rock_climbing: "#cc9966", bouldering: "#cc9966", breathwork: "#88bbaa", other: "#999999"
};

const xe = {
  1: "text-blue-400", 2: "text-emerald-500", 3: "text-yellow-500",
  4: "text-orange-500", 5: "text-red-500"
};

function K(a) {
  if (!a || a.length < 5 || a.reduce((p, m) => p + m, 0) === 0) return null;
  let i = 0, x = 1;
  for (let p = 0; p < a.length; p++) {
    if (a[p] > i) { i = a[p]; x = p + 1; }
  }
  return { zone: x, label: `Z${x}` };
}

function O(a) {
  const c = Math.floor(a / 3600), i = Math.floor((a % 3600) / 60);
  return c > 0 ? `${c}h ${i}m` : `${i}m`;
}

function H(a) {
  return a === 0 ? "" : a < 1000 ? `${a}m` : `${(a / 1000).toFixed(1)}km`;
}

function pe(a) {
  return a === 0 ? "" : `${a}m`;
}

function ne(a, c) {
  if (a === 0 || c === 0) return "";
  const i = c / (a / 1000), x = Math.floor(i / 60), p = Math.round(i % 60);
  return `${x}:${p.toString().padStart(2, "0")}/km`;
}

function parseRawActivities(raw) {
  const c = {};
  const i = [];
  const x = new Date();
  const p = new Date(2026, 0, 1);

  for (const m of raw) {
    const o = (m.startTimeLocal || "").slice(0, 10);
    if (!o) continue;
    const l = m.activityType?.typeKey || "other";
    if (l === "surfing_v2") continue;
    const d = m.duration || 0;
    const n = m.distance || 0;
    const t = m.calories || 0;
    const r = m.averageHR || null;
    const h = m.elevationGain || 0;
    const s = m.activityName || "Activity";
    const u = m.hrTimeInZone_1 || 0;
    const g = m.hrTimeInZone_2 || 0;
    const f = m.hrTimeInZone_3 || 0;
    const y = m.hrTimeInZone_4 || 0;
    const N = m.hrTimeInZone_5 || 0;
    const v = u + g + f + y + N > 0 ? [u, g, f, y, N] : null;
    const k = K(v);
    const M = ["Vale de Cambra", "Oliveira de Azeméis", "São João da Madeira"];
    let F = s;
    for (const S of M) {
      if (F.includes(S)) {
        const z = G[l] || l;
        F = k ? `Zone ${k.zone} ${z}` : z;
        break;
      }
    }
    i.push({
      date: o,
      name: F,
      type: l,
      duration: Math.round(d),
      distance: Math.round(n),
      calories: Math.round(t),
      avgHr: r ? Math.round(r) : null,
      hrZones: v,
      elevationGain: Math.round(h)
    });
    c[o] || (c[o] = { count: 0, totalDuration: 0, types: [], intensity: 0 });
    const w = c[o];
    w.count++;
    w.totalDuration += Math.round(d);
    if (!w.types.includes(l)) w.types.push(l);
  }

  for (const m of Object.values(c)) {
    const o = m.totalDuration / 60;
    m.intensity = o < 20 ? 1 : o < 45 ? 2 : o < 90 ? 3 : 4;
  }

  i.sort((m, o) => o.date.localeCompare(m.date));
  return {
    heatmap: c,
    activities: i,
    totalActivities: i.length,
    startDate: p.toISOString().slice(0, 10),
    endDate: x.toISOString().slice(0, 10)
  };
}

function calculateWeeklyData(data) {
  const c = [];
  const i = new Date(2026, 0, 1);
  const x = i.getDay();
  const p = x === 0 ? 6 : x - 1;
  const m = new Date(i);
  m.setDate(m.getDate() - p);
  const o = new Date();
  o.setHours(23, 59, 59, 999);
  const l = new Date(m);
  let d = 1;

  for (; l <= o && l.getFullYear() <= 2026; ) {
    const t = new Date(l);
    const r = new Date(l);
    r.setDate(r.getDate() + 6);
    const h = t.toISOString().slice(0, 10);
    const s = r > o ? o.toISOString().slice(0, 10) : r.toISOString().slice(0, 10);
    const u = data.activities.filter(j => j.date >= h && j.date <= s);
    const g = {};
    for (const j of u) g[j.type] = (g[j.type] || 0) + j.duration;
    const f = u.filter(j => j.avgHr);
    const y = f.length > 0 ? Math.round(f.reduce((j, v) => j + v.avgHr, 0) / f.length) : null;
    const N = j => j.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    c.push({
      weekKey: h,
      label: `${N(t)} – ${N(r)}`,
      weekNum: d++,
      duration: u.reduce((j, v) => j + v.duration, 0),
      distance: u.reduce((j, v) => j + v.distance, 0),
      elevation: u.reduce((j, v) => j + v.elevationGain, 0),
      activities: u.length,
      calories: u.reduce((j, v) => j + v.calories, 0),
      types: g,
      avgHr: y
    });
    l.setDate(l.getDate() + 7);
  }

  return c.map((t, r) => {
    const h = Math.max(0, r - 3);
    const s = c.slice(h, r + 1);
    const u = s.reduce((v, k) => v + k.duration, 0) / s.length;
    const g = s.reduce((v, k) => v + k.distance, 0) / s.length;
    const f = u > 0 ? t.duration / u : null;
    const y = r > 0 ? c[r - 1] : null;
    const N = y && y.duration > 0 ? ((t.duration - y.duration) / y.duration) * 100 : null;
    const j = y && y.distance > 0 ? ((t.distance - y.distance) / y.distance) * 100 : null;
    return {
      ...t,
      rollingAvg4w: u,
      rollingAvgDist4w: g,
      acuteChronicRatio: f,
      durationDelta: N,
      distanceDelta: j
    };
  });
}

function StatPill({ label, value }) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2">
      <p className="font-mono text-[13px] uppercase tracking-widest text-[var(--text-secondary)] !mb-0">
        {label}
      </p>
      <p className="text-sm font-semibold !mb-0 mt-0.5">{value}</p>
    </div>
  );
}

function TooltipIcon({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-block ml-1 align-middle leading-none"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={e => { e.stopPropagation(); setShow(prev => !prev); }}
    >
      <svg width="11" height="11" viewBox="0 0 16 16" className="cursor-help opacity-40 hover:opacity-80 inline-block" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6.5" />
        <line x1="8" y1="7" x2="8" y2="11.5" strokeLinecap="round" />
        <circle cx="8" cy="4.75" r="0.5" fill="currentColor" stroke="none" />
      </svg>
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50 w-[220px] px-2.5 py-1.5 rounded bg-[var(--text-primary)] text-[var(--bg)] font-sans text-[11px] leading-snug normal-case tracking-normal whitespace-normal pointer-events-none shadow-md">
          {text}
        </span>
      )}
    </span>
  );
}

function Sparkline({ values, color, height = 28, width = 100 }) {
  if (!values || values.length < 2) return null;
  const p = Math.max(...values, 1);
  const m = Math.min(...values);
  const o = p - m || 1;
  const l = 2;
  const d = (width - l * 2) / (values.length - 1);
  const n = values.map((s, u) => {
    const g = l + u * d;
    const f = height - l - ((s - m) / o) * (height - l * 2);
    return `${g},${f}`;
  });
  const t = l;
  const r = l + (values.length - 1) * d;
  const h = [`${t},${height - l}`, ...n, `${r},${height - l}`].join(" ");
  return (
    <svg width={width} height={height} className="block">
      <polygon points={h} fill={color} opacity={0.1} />
      <polyline points={n.join(" ")} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {(() => {
        const s = values[values.length - 1];
        const u = r;
        const g = height - l - ((s - m) / o) * (height - l * 2);
        return <circle cx={u} cy={g} r={2} fill={color} />;
      })()}
    </svg>
  );
}

function ActivityCard({ activity, isExpanded, onToggle }) {
  const x = new Date(activity.date + "T12:00:00");
  const p = x.toLocaleDateString("en-US", { weekday: "short" });
  const m = x.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div>
      <div
        onClick={onToggle}
        className={`flex items-center gap-3 py-3.5 sm:py-2.5 px-3 -mx-3 rounded-lg cursor-pointer ${
          isExpanded ? "bg-[var(--bg-hover)]" : "hover:bg-[var(--bg-hover)]"
        }`}
      >
        <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-md bg-[var(--bg-hover)] flex items-center justify-center shrink-0">
          <svg className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="currentColor">
            <path d={de[activity.type] || "M13 10V3L4 14h7v7l9-11h-7z"} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] sm:text-sm text-[var(--text-primary)] truncate !mb-0 font-medium">{activity.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[13px] sm:text-[12px] font-mono text-[var(--text-secondary)]">
              {p} {m} · {G[activity.type] || activity.type}
              {activity.distance > 0 && <span className="sm:hidden"> · {H(activity.distance)}</span>}
              {activity.duration > 0 && <span className="sm:hidden"> · {O(activity.duration)}</span>}
            </span>
            {oe.has(activity.type) && K(activity.hrZones) && (
              <span className={`text-[12px] sm:text-[13px] font-mono font-bold ${xe[K(activity.hrZones).zone]}`}>
                {K(activity.hrZones).label}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          {activity.distance > 0 && (
            <p className="font-mono text-xs text-[var(--text-primary)] !mb-0">{H(activity.distance)}</p>
          )}
          <p className="font-mono text-[13px] text-[var(--text-secondary)] !mb-0">{O(activity.duration)}</p>
        </div>
        <svg
          className={`w-4 h-4 text-[var(--text-secondary)] shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-3 pb-3 pt-1">
            {activity.duration > 0 && <StatPill label="Duration" value={O(activity.duration)} />}
            {activity.distance > 0 && <StatPill label="Distance" value={H(activity.distance)} />}
            {activity.distance > 0 && activity.duration > 0 && (
              <StatPill label="Pace" value={ne(activity.distance, activity.duration)} />
            )}
            {activity.elevationGain > 0 && <StatPill label="Elevation" value={`${activity.elevationGain}m ↑`} />}
            {activity.calories > 0 && <StatPill label="Calories" value={`${activity.calories}`} />}
            {activity.avgHr && <StatPill label="Avg HR" value={`${activity.avgHr} bpm`} />}

            {activity.hrZones && (
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 col-span-2 sm:col-span-2">
                <p className="font-mono text-[13px] uppercase tracking-widest text-[var(--text-secondary)] !mb-0">
                  HR Zones
                </p>
                <div className="flex gap-0.5 mt-1.5 h-3 rounded-sm overflow-hidden">
                  {activity.hrZones.map((o, l) => {
                    const d = activity.hrZones.reduce((r, h) => r + h, 0);
                    const n = d > 0 ? (o / d) * 100 : 0;
                    if (n < 1) return null;
                    const colors = ["bg-blue-400", "bg-emerald-500", "bg-yellow-500", "bg-orange-500", "bg-red-500"];
                    return (
                      <div
                        key={l}
                        className={`${colors[l]} relative group`}
                        style={{ width: `${n}%` }}
                        title={`Z${l + 1}: ${Math.round(o / 60)}m (${Math.round(n)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {activity.hrZones.map((o, l) => {
                    const d = activity.hrZones.reduce((t, r) => t + r, 0);
                    const n = d > 0 ? (o / d) * 100 : 0;
                    return n < 5 ? null : (
                      <span key={l} className="font-mono text-[12px] text-[var(--text-secondary)]">
                        Z{l + 1} {Math.round(n)}%
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 1. TOP HEADER STATS
function HeaderStats({ data, trainingStatus, sleepData, bodyComp }) {
  const p = trainingStatus?.mostRecentVO2Max?.generic;
  const m = p?.vo2MaxPreciseValue ?? p?.vo2MaxValue;
  const o = sleepData?.dailySleepDTO?.avgHeartRate;
  
  // Custom metrics requested: Weight = 87.9kg, Muscle = 64.8kg
  // Body Fat % = 21.7% (Fat Mass = 87.9 - (64.8 muscle + 4.0 bone/organ) = 19.1kg -> 19.1/87.9 = 21.7%)
  const h = 87.9;
  const r = 64.8;
  const t = 21.7;

  const s = new Date().toISOString().slice(0, 10);
  const u = data.activities.filter(w => w.date === s);
  const g = u.reduce((w, S) => w + S.duration, 0);
  const f = u.reduce((w, S) => w + S.distance, 0);
  const y = u.reduce((w, S) => w + S.calories, 0);
  const N = sleepData?.dailySleepDTO?.sleepTimeSeconds || 0;
  const j = sleepData?.dailySleepDTO?.sleepScores?.overall?.value;

  const v = [];
  if (m) v.push({ label: "VO2 Max", value: `${m.toFixed(1)}`, info: "Maximum oxygen your body can use during intense exercise (ml/kg/min) — a top indicator of cardiovascular fitness." });
  if (o) v.push({ label: "Resting HR", value: `${Math.round(o)}`, info: "Heart rate at rest (bpm) — lower generally indicates better cardiovascular fitness." });

  const k = [];
  if (h) k.push({ label: "Weight", value: `${h.toFixed(1)}kg` });
  if (t) k.push({ label: "Body fat", value: `${t.toFixed(1)}%` });
  if (r) k.push({ label: "Muscle", value: `${r.toFixed(1)}kg` });

  const M = 1.73;
  if (h && t) {
    const z = (h * (1 - t / 100)) / (M * M) + 6.1 * (1.8 - M);
    k.push({ label: "FFMI", value: `${z.toFixed(1)}`, info: "Fat-Free Mass Index — lean mass relative to height, height-adjusted to 1.8m. ~18 average, ~22 well-muscled, ~25 natural ceiling." });
  }

  const F = [];
  if (N > 0) F.push({ label: "Sleep", value: `${Math.floor(N / 3600)}h${Math.round((N % 3600) / 60)}m` });
  if (j) F.push({ label: "Sleep score", value: `${j}` });
  if (u.length > 0) F.push({ label: "Activities", value: `${u.length}` });
  if (g > 0) F.push({ label: "Training", value: O(g) });
  if (f > 0) F.push({ label: "Distance", value: H(f) });
  if (y > 0) F.push({ label: "Calories", value: `${y}` });

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
      <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6 sm:overflow-x-auto sm:pb-1 sm:flex-wrap sm:items-end">
        {v.map(w => (
          <div key={w.label}>
            <p className="text-lg sm:text-2xl font-bold !mb-0 tabular-nums">{w.value}</p>
            <p className="font-mono text-[12px] sm:text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-0 whitespace-nowrap">
              {w.label}
              {w.info && <TooltipIcon text={w.info} />}
            </p>
          </div>
        ))}
        {k.map(w => (
          <div key={w.label}>
            <p className="text-lg sm:text-2xl font-bold !mb-0 tabular-nums">{w.value}</p>
            <p className="font-mono text-[12px] sm:text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-0 whitespace-nowrap">
              {w.label}
              {w.info && <TooltipIcon text={w.info} />}
            </p>
          </div>
        ))}
        {k.length > 0 && (
          <p className="font-mono text-[13px] text-[var(--text-secondary)] opacity-50 !mb-0 self-end pb-0.5 whitespace-nowrap col-span-3 sm:col-span-1 -mt-2 sm:mt-0">
            30d avg · withings
          </p>
        )}
      </div>

      {F.length > 0 && (
        <div className="border border-[var(--border)] rounded-lg px-4 py-3 sm:shrink-0 sm:min-w-[180px]">
          <p className="font-mono text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-2">
            Today
          </p>
          <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-3 sm:flex-wrap">
            {F.map(w => (
              <div key={w.label}>
                <p className="text-sm sm:text-base font-bold !mb-0 tabular-nums">{w.value}</p>
                <p className="font-mono text-[12px] tracking-widest uppercase text-[var(--text-secondary)] !mb-0 whitespace-nowrap">
                  {w.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 2. HEATMAP SECTION & MONTHLY VIEW
function HeatmapSection({ data, selectedDate, onSelectDate, viewMode, setViewMode }) {
  const p = useMemo(() => {
    const a = new Date(2026, 0, 1);
    const c = new Date(2026, 11, 31);
    const i = new Date(a);
    const x = i.getDay();
    const p = x === 0 ? 6 : x - 1;
    i.setDate(i.getDate() - p);
    const m = [];
    const o = new Date(i);
    for (; o <= c; ) {
      const l = [];
      for (let d = 0; d < 7; d++) {
        l.push(o.toISOString().slice(0, 10));
        o.setDate(o.getDate() + 1);
      }
      m.push(l);
    }
    return m;
  }, []);

  const m = useMemo(() => {
    const c = [];
    const i = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let x = -1;
    p.forEach((group, col) => {
      const o = group.find(d => d.startsWith("2026"));
      if (!o) return;
      const l = new Date(o).getMonth();
      if (l !== x) { c.push({ label: i[l], col }); x = l; }
    });
    return c;
  }, [p]);

  const Q = 13, fe = 2, U = Q + fe, ee = 28;
  const ve = ["M", "", "W", "", "F", "", ""];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  function getIntensityColor(intensity, isFuture) {
    if (isFuture) return "var(--training-future)";
    switch (intensity) {
      case 1: return "var(--training-1)";
      case 2: return "var(--training-2)";
      case 3: return "var(--training-3)";
      case 4: return "var(--training-4)";
      default: return "var(--training-0)";
    }
  }

  const svgWidth = ee + p.length * U;
  const svgHeight = 7 * U + 16;

  return (
    <div className="mb-2 -mx-4 sm:-mx-8 md:-mx-12 px-4 sm:px-8 md:px-12">
      <div className="py-4 sm:py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[12px] tracking-widest uppercase text-[var(--text-secondary)] !mb-0">
            {data.totalActivities} activities in 2026
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode("heatmap")}
              className={`p-1.5 rounded ${viewMode === "heatmap" ? "text-[var(--text-primary)] bg-[var(--bg-hover)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              title="Heatmap"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="3" height="3" rx="0.5" />
                <rect x="4.3" y="0" width="3" height="3" rx="0.5" />
                <rect x="8.6" y="0" width="3" height="3" rx="0.5" />
                <rect x="12.9" y="0" width="3" height="3" rx="0.5" />
                <rect x="0" y="4.3" width="3" height="3" rx="0.5" />
                <rect x="4.3" y="4.3" width="3" height="3" rx="0.5" />
                <rect x="8.6" y="4.3" width="3" height="3" rx="0.5" />
                <rect x="12.9" y="4.3" width="3" height="3" rx="0.5" />
                <rect x="0" y="8.6" width="3" height="3" rx="0.5" />
                <rect x="4.3" y="8.6" width="3" height="3" rx="0.5" />
                <rect x="8.6" y="8.6" width="3" height="3" rx="0.5" />
                <rect x="12.9" y="8.6" width="3" height="3" rx="0.5" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("monthly")}
              className={`p-1.5 rounded ${viewMode === "monthly" ? "text-[var(--text-primary)] bg-[var(--bg-hover)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              title="Monthly"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="8" width="3" height="8" rx="0.5" />
                <rect x="4.3" y="4" width="3" height="12" rx="0.5" />
                <rect x="8.6" y="6" width="3" height="10" rx="0.5" />
                <rect x="12.9" y="2" width="3" height="14" rx="0.5" />
              </svg>
            </button>
          </div>
        </div>

        {viewMode === "heatmap" ? (
          <div>
            <div style={{ maxWidth: "100%", overflowX: "auto", overflowY: "hidden" }} className="scrollbar-thin">
              <svg width={svgWidth} height={svgHeight} style={{ display: "block", overflow: "visible" }}>
                {m.map((r, h) => (
                  <text key={h} x={ee + r.col * U} y={10} className="fill-[var(--text-secondary)]" style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)" }}>
                    {r.label}
                  </text>
                ))}
                {ve.map((r, h) => r ? (
                  <text key={h} x={ee - 6} y={16 + h * U + Q / 2 + 4} textAnchor="end" className="fill-[var(--text-secondary)]" style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)", opacity: 0.6 }}>
                    {r}
                  </text>
                ) : null)}
                {p.map((group, col) => group.map((s, row) => {
                  const g = new Date(s + "T00:00:00");
                  if (g.getFullYear() !== 2026) return null;
                  const isFuture = g > now;
                  const N = data.heatmap[s];
                  const isSelected = selectedDate === s;

                  return (
                    <rect
                      key={s}
                      x={ee + col * U}
                      y={16 + row * U}
                      width={Q}
                      height={Q}
                      rx={3}
                      fill={getIntensityColor(N?.intensity || 0, isFuture)}
                      stroke={isSelected ? "var(--text-primary)" : undefined}
                      strokeWidth={isSelected ? 2 : 0}
                      className={isFuture ? "" : "heatmap-cell"}
                      style={{ cursor: isFuture ? "default" : "pointer" }}
                      onClick={() => !isFuture && onSelectDate(isSelected ? null : s)}
                    />
                  );
                }))}
              </svg>
            </div>
            <div className="flex items-center mt-4" style={{ marginLeft: ee }}>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">Less</span>
                {[0, 1, 2, 3, 4].map(r => (
                  <div key={r} className="rounded-[3px]" style={{ width: Q, height: Q, backgroundColor: getIntensityColor(r, false) }} />
                ))}
                <span className="text-[13px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">More</span>
              </div>
            </div>
          </div>
        ) : (
          <MonthlyBarsView data={data} />
        )}
      </div>
    </div>
  );
}

function MonthlyBarsView({ data }) {
  const c = useMemo(() => {
    const o = [];
    for (let l = 0; l < 12; l++) {
      const d = `2026-${String(l + 1).padStart(2, "0")}`;
      const n = data.activities.filter(t => t.date.startsWith(d));
      o.push({
        month: l,
        duration: n.reduce((t, r) => t + r.duration, 0),
        activities: n.length,
        distance: n.reduce((t, r) => t + r.distance, 0)
      });
    }
    return o;
  }, [data]);

  const i = Math.max(...c.map(o => o.duration), 1);
  const x = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const p = new Date();
  const m = p.getFullYear() === 2026 ? p.getMonth() : -1;

  return (
    <div className="flex items-end gap-[6px] sm:gap-2 h-32 sm:h-40">
      {c.map(o => {
        const l = i > 0 ? (o.duration / i) * 100 : 0;
        const d = o.month === m;
        const n = o.month > m && m >= 0;
        return (
          <div key={o.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
            {o.duration > 0 && (
              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                <div className="bg-[var(--text-primary)] text-[var(--bg)] text-[13px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
                  {O(o.duration)} · {o.activities} acts {o.distance > 0 && `· ${H(o.distance)}`}
                </div>
              </div>
            )}
            <div
              className={`w-full rounded-sm ${n ? "bg-[var(--training-future)]" : o.duration > 0 ? (d ? "bg-[var(--training-3)]" : "bg-[var(--training-2)]") : "bg-[var(--training-0)]"}`}
              style={{ height: `${Math.max(n ? 4 : l > 0 ? Math.max(l, 4) : 4, 4)}%` }}
            />
            <span className={`text-[12px] sm:text-[13px] font-mono shrink-0 ${d ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-secondary)]"}`}>
              {x[o.month]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// 3. SELECTED DAY DRAWER
function SelectedDayDrawer({ date, activities, onClose }) {
  const p = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const m = activities.reduce((n, t) => n + t.duration, 0);
  const o = activities.reduce((n, t) => n + t.calories, 0);
  const l = activities.reduce((n, t) => n + t.distance, 0);
  const d = activities.reduce((n, t) => n + t.elevationGain, 0);

  return (
    <div className="overflow-hidden mb-6">
      <div className="pt-4 pb-2">
        <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg)]">
          <div className="px-4 py-3.5 sm:py-3 flex items-center justify-between border-b border-[var(--border)]">
            <div>
              <p className="text-[13px] sm:text-sm font-semibold !mb-0">{p}</p>
              <p className="text-[13px] font-mono text-[var(--text-secondary)] !mb-0 mt-0.5">
                {activities.length} {activities.length === 1 ? "activity" : "activities"}
                {m > 0 && ` · ${O(m)}`}
                {l > 0 && ` · ${H(l)}`}
                {d > 0 && ` · ${pe(d)} ↑`}
                {o > 0 && ` · ${o} cal`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-[var(--text-secondary)] !mb-0">Rest day</p>
            </div>
          ) : (
            <div>
              {activities.map((n, t) => (
                <div key={t} className={`px-4 py-3 flex items-center gap-3 ${t < activities.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d={de[n.type] || "M13 10V3L4 14h7v7l9-11h-7z"} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium !mb-0 truncate">{n.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-mono text-[12px] tracking-wide uppercase text-[var(--text-secondary)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded">
                        {G[n.type] || n.type}
                      </span>
                      {n.avgHr && <span className="font-mono text-[12px] text-[var(--text-secondary)]">{n.avgHr} bpm</span>}
                      {oe.has(n.type) && K(n.hrZones) && (
                        <span className={`font-mono text-[12px] font-bold ${xe[K(n.hrZones).zone]}`}>
                          Zone {K(n.hrZones).zone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {n.distance > 0 && <p className="font-mono text-xs text-[var(--text-primary)] !mb-0">{H(n.distance)}</p>}
                    <p className="font-mono text-[13px] text-[var(--text-secondary)] !mb-0">{O(n.duration)}</p>
                    {n.distance > 0 && n.duration > 0 && (
                      <p className="font-mono text-[12px] text-[var(--text-secondary)] !mb-0">{ne(n.distance, n.duration)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. TRAINING LOAD CHART (CTL / ATL / TSB)
function TrainingLoadChart({ data }) {
  const c = useMemo(() => {
    const i = {};
    for (const r of data.activities) {
      const h = r.duration / 60;
      let s;
      if (r.avgHr && r.avgHr > 0) {
        const u = r.avgHr / 190;
        s = h * u * u;
      } else s = h * 0.5;
      i[r.date] = (i[r.date] || 0) + s;
    }
    const x = new Date(2026, 0, 1);
    const p = new Date();
    p.setHours(0, 0, 0, 0);
    const m = [];
    const o = new Date(x);
    const l = 42, d = 7;
    let n = 0, t = 0;
    for (; o <= p; ) {
      const r = o.toISOString().slice(0, 10);
      const h = i[r] || 0;
      n = n + (h - n) * (1 / l);
      t = t + (h - t) * (1 / d);
      const s = n - t;
      m.push({ date: r, load: h, ctl: n, atl: t, tsb: s });
      o.setDate(o.getDate() + 1);
    }
    return m;
  }, [data]);

  if (c.length < 7) return null;

  const i = 600, x = 160, p = 32, m = 8, o = 8, l = 24;
  const d = i - p - m, n = x - o - l;
  const t = c.flatMap(D => [D.ctl, D.atl, D.tsb]);
  const r = Math.max(...t, 1);
  const h = Math.min(...t, 0);
  const s = r - h || 1;

  const u = D => p + (D / (c.length - 1)) * d;
  const g = D => o + (1 - (D - h) / s) * n;
  const f = D => D.map((W, _) => `${_ === 0 ? "M" : "L"}${u(_).toFixed(1)},${g(W).toFixed(1)}`).join(" ");

  const y = f(c.map(D => D.ctl));
  const N = f(c.map(D => D.atl));
  const j = f(c.map(D => D.tsb));
  const v = g(0);

  const k = c.map((D, W) => `${u(W).toFixed(1)},${g(D.tsb).toFixed(1)}`);
  const M = `M${u(0).toFixed(1)},${v.toFixed(1)} ` + k.map(D => `L${D}`).join(" ") + ` L${u(c.length - 1).toFixed(1)},${v.toFixed(1)} Z`;

  const F = [];
  const w = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let S = -1;
  c.forEach((D, W) => {
    const _ = new Date(D.date).getMonth();
    if (_ !== S) { F.push({ label: w[_], x: u(W) }); S = _; }
  });

  const z = [];
  const R = s < 20 ? 5 : s < 50 ? 10 : 20;
  for (let D = Math.ceil(h / R) * R; D <= r; D += R) z.push(D);

  const A = c[c.length - 1];

  const D_recent = c.slice(-7);
  const W_prev = c.slice(-14, -7);
  const _ctlRecent = D_recent.reduce((B, V) => B + V.ctl, 0) / D_recent.length;
  const EctlPrev = W_prev.length > 0 ? W_prev.reduce((B, V) => B + V.ctl, 0) / W_prev.length : _ctlRecent;
  const P_fitnessChange = EctlPrev > 0 ? ((_ctlRecent - EctlPrev) / EctlPrev) * 100 : 0;
  const b = A.tsb, $ = A.atl, T = A.ctl;

  let L;
  if (T < 5 && c.length < 30)
    L = { label: "Building base", description: "Early phase — establishing a training foundation. Consistency matters more than intensity right now.", color: "text-blue-400", bgColor: "bg-blue-400/10" };
  else if (b > 15 && P_fitnessChange < -3)
    L = { label: "Detraining", description: "Fitness is declining and form is high. Extended rest is causing training adaptations to fade. Time to resume structured training.", color: "text-red-400", bgColor: "bg-red-400/10" };
  else if (b > 10 && P_fitnessChange >= -3)
    L = { label: "Fresh & ready", description: "Low fatigue with maintained fitness — peak performance window. Ideal for a race, test, or hard session.", color: "text-emerald-500", bgColor: "bg-emerald-500/10" };
  else if (b >= 0 && b <= 10)
    L = { label: "Recovered", description: "Good balance between fitness and fatigue. Ready for a normal training block or a slight push.", color: "text-emerald-500", bgColor: "bg-emerald-500/10" };
  else if (b < 0 && b >= -15 && P_fitnessChange > 0)
    L = { label: "Productive overreach", description: "Carrying manageable fatigue while fitness is building. This is the sweet spot — training is working. Maintain and recover periodically.", color: "text-[var(--training-3)]", bgColor: "bg-[var(--training-3)]/10" };
  else if (b < 0 && b >= -15 && P_fitnessChange <= 0)
    L = { label: "Maintaining", description: "Some accumulated fatigue but fitness is stable. Not gaining or losing — a holding pattern. Consider increasing stimulus or taking a recovery week.", color: "text-[var(--text-secondary)]", bgColor: "bg-[var(--bg-hover)]" };
  else if (b < -15 && b >= -30)
    L = { label: "High fatigue", description: "Significant accumulated fatigue. If intentional (training block), plan a recovery week soon. If not, back off before it becomes counterproductive.", color: "text-orange-400", bgColor: "bg-orange-400/10" };
  else
    L = { label: "Overreaching", description: "Very high fatigue relative to fitness. Risk of overtraining, illness, or injury. Strongly recommend a recovery period — easy sessions or complete rest.", color: "text-red-400", bgColor: "bg-red-400/10" };

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-mono text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-0">
          Training load
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[2px] bg-[#6ba3d6] rounded" />
            <span className="font-mono text-[13px] text-[var(--text-secondary)]">
              Fitness <span className="text-[var(--text-primary)] font-medium">{A.ctl.toFixed(1)}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[2px] bg-[#e07c5a] rounded" />
            <span className="font-mono text-[13px] text-[var(--text-secondary)]">
              Fatigue <span className="text-[var(--text-primary)] font-medium">{A.atl.toFixed(1)}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[2px] rounded" style={{ backgroundColor: A.tsb >= 0 ? "#5bc47c" : "#e05a5a" }} />
            <span className="font-mono text-[13px] text-[var(--text-secondary)]">
              Form <span className={`font-medium ${A.tsb >= 0 ? "text-emerald-500" : "text-red-400"}`}>{A.tsb >= 0 ? "+" : ""}{A.tsb.toFixed(1)}</span>
            </span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${i} ${x}`} className="w-full" style={{ maxHeight: 180 }}>
        {h < 0 && <line x1={p} y1={v} x2={i - m} y2={v} stroke="var(--border)" strokeWidth={1} />}
        {z.map(D => (
          <g key={D}>
            <line x1={p} y1={g(D)} x2={i - m} y2={g(D)} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
            <text x={p - 4} y={g(D) + 3} textAnchor="end" className="fill-[var(--text-secondary)]" style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)" }}>
              {D}
            </text>
          </g>
        ))}
        {F.map(D => (
          <text key={D.label} x={D.x} y={x - 4} className="fill-[var(--text-secondary)]" style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)" }}>
            {D.label}
          </text>
        ))}
        <defs>
          <linearGradient id="tsbGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5bc47c" stopOpacity={0.15} />
            <stop offset={`${(r / s) * 100}%`} stopColor="#5bc47c" stopOpacity={0.05} />
            <stop offset={`${(r / s) * 100}%`} stopColor="#e05a5a" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#e05a5a" stopOpacity={0.15} />
          </linearGradient>
        </defs>
        <path d={M} fill="url(#tsbGrad)" />
        <path d={y} fill="none" stroke="#6ba3d6" strokeWidth={1.5} strokeLinejoin="round" />
        <path d={N} fill="none" stroke="#e07c5a" strokeWidth={1.5} strokeLinejoin="round" />
        <path d={j} fill="none" stroke={A.tsb >= 0 ? "#5bc47c" : "#e05a5a"} strokeWidth={1} strokeLinejoin="round" opacity={0.7} />
        <circle cx={u(c.length - 1)} cy={g(A.ctl)} r={2.5} fill="#6ba3d6" />
        <circle cx={u(c.length - 1)} cy={g(A.atl)} r={2.5} fill="#e07c5a" />
        <circle cx={u(c.length - 1)} cy={g(A.tsb)} r={2.5} fill={A.tsb >= 0 ? "#5bc47c" : "#e05a5a"} />
      </svg>

      <div className={`mt-3 rounded-md px-3 py-2.5 ${L.bgColor}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-mono text-[12px] font-medium uppercase tracking-wider ${L.color}`}>{L.label}</span>
          <span className="font-mono text-[13px] text-[var(--text-secondary)]">
            CTL {T.toFixed(1)} · ATL {$.toFixed(1)} · TSB {b >= 0 ? "+" : ""}{b.toFixed(1)}
            {P_fitnessChange !== 0 && (
              <span className={P_fitnessChange > 0 ? "text-emerald-500" : "text-red-400"}>
                {" "}· fitness {P_fitnessChange > 0 ? "↑" : "↓"}{Math.abs(P_fitnessChange).toFixed(0)}%
              </span>
            )}
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-primary)] !mb-0 leading-relaxed opacity-80">{L.description}</p>
      </div>

      <p className="font-mono text-[12px] text-[var(--text-secondary)] opacity-50 !mb-0 mt-2">
        Fitness (CTL) = 42d avg · Fatigue (ATL) = 7d avg · Form (TSB) = fitness − fatigue · Based on duration × HR intensity
      </p>
    </div>
  );
}

// 5. TRENDS SECTION (LAST 4 WEEKS VS PREVIOUS 4)
function calculateTrends(data, weeksChronological) {
  const i = [];
  const x = weeksChronological.filter(b => b.duration > 0);
  if (x.length < 4) return i;

  const p = Math.min(4, x.length);
  const m = x.slice(-p);
  const o = Math.min(4, x.length - p);
  if (o === 0) return i;

  const l = x.slice(-p - o, -p);
  const d = b => (b.length > 0 ? b.reduce(($, T) => $ + T, 0) / b.length : 0);
  const n = (b, $) => ($ > 0 ? ((b - $) / $) * 100 : 0);

  const t = d(m.map(b => b.duration));
  const r = d(l.map(b => b.duration));
  const h = n(t, r);
  i.push({
    label: "Weekly volume",
    direction: Math.abs(h) < 3 ? "flat" : h > 0 ? "up" : "down",
    sentiment: Math.abs(h) < 3 ? "neutral" : h > 0 ? "positive" : "negative",
    recent: O(t),
    previous: O(r),
    delta: h
  });

  const s = d(m.map(b => b.distance));
  const u = d(l.map(b => b.distance));
  const g = n(s, u);
  if (s > 0 || u > 0)
    i.push({
      label: "Weekly distance",
      direction: Math.abs(g) < 3 ? "flat" : g > 0 ? "up" : "down",
      sentiment: Math.abs(g) < 3 ? "neutral" : g > 0 ? "positive" : "negative",
      recent: H(s),
      previous: H(u),
      delta: g
    });

  const f = d(m.map(b => b.elevation));
  const y = d(l.map(b => b.elevation));
  const N = n(f, y);
  if (f > 0 || y > 0)
    i.push({
      label: "Weekly elevation",
      direction: Math.abs(N) < 3 ? "flat" : N > 0 ? "up" : "down",
      sentiment: Math.abs(N) < 3 ? "neutral" : N > 0 ? "positive" : "negative",
      recent: `${Math.round(f)}m`,
      previous: `${Math.round(y)}m`,
      delta: N
    });

  const j = d(m.map(b => b.activities));
  const v = d(l.map(b => b.activities));
  const k = n(j, v);
  i.push({
    label: "Sessions / week",
    direction: Math.abs(k) < 5 ? "flat" : k > 0 ? "up" : "down",
    sentiment: Math.abs(k) < 5 ? "neutral" : k > 0 ? "positive" : "negative",
    recent: j.toFixed(1),
    previous: v.toFixed(1),
    delta: k
  });

  const M = t / Math.max(j, 1);
  const F = r / Math.max(v, 1);
  const w = n(M, F);
  i.push({
    label: "Avg session length",
    direction: Math.abs(w) < 3 ? "flat" : w > 0 ? "up" : "down",
    sentiment: Math.abs(w) < 3 ? "neutral" : "positive",
    recent: O(M),
    previous: O(F),
    delta: w
  });

  const S = m[0].weekKey;
  const z = new Set(["running", "trail_running", "treadmill_running"]);
  const R = data.activities.filter(b => z.has(b.type) && b.date >= S && b.distance > 0 && b.duration > 0);
  const A = data.activities.filter(b => z.has(b.type) && b.date >= l[0].weekKey && b.date < S && b.distance > 0 && b.duration > 0);

  if (R.length >= 2 && A.length >= 2) {
    const calcPace = Z => {
      const se = Z.reduce((I, Y) => I + Y.distance, 0);
      return Z.reduce((I, Y) => I + Y.duration, 0) / (se / 1000);
    };
    const $ = calcPace(R);
    const T = calcPace(A);
    const L = n($, T);
    i.push({
      label: "Running pace",
      direction: Math.abs(L) < 2 ? "flat" : L < 0 ? "up" : "down",
      sentiment: Math.abs(L) < 2 ? "neutral" : L < 0 ? "positive" : "negative",
      recent: ne(1000, $),
      previous: ne(1000, T),
      delta: -L,
      detail: `${R.length} runs vs ${A.length}`
    });

    const B = R.filter(Z => Z.avgHr);
    const V = A.filter(Z => Z.avgHr);
    if (B.length >= 2 && V.length >= 2) {
      const calcEff = Y => {
        const he = Y.reduce((re, J) => re + J.distance, 0);
        return Y.reduce((re, J) => {
          const ue = J.duration / (J.distance / 1000);
          return re + (ue / J.avgHr) * (J.distance / he);
        }, 0);
      };
      const se = calcEff(B);
      const ae = calcEff(V);
      const I = n(se, ae);
      i.push({
        label: "Cardiac efficiency",
        direction: Math.abs(I) < 2 ? "flat" : I < 0 ? "up" : "down",
        sentiment: Math.abs(I) < 2 ? "neutral" : I < 0 ? "positive" : "negative",
        recent: `${se.toFixed(2)}`,
        previous: `${ae.toFixed(2)}`,
        delta: -I,
        detail: "sec/km per bpm"
      });
    }
  }

  const D = m.filter(b => b.avgHr).map(b => b.avgHr);
  const W = l.filter(b => b.avgHr).map(b => b.avgHr);
  if (D.length >= 2 && W.length >= 2) {
    const b = d(D);
    const $ = d(W);
    const T = n(b, $);
    i.push({
      label: "Avg training HR",
      direction: Math.abs(T) < 1.5 ? "flat" : T < 0 ? "down" : "up",
      sentiment: Math.abs(T) < 1.5 ? "neutral" : T < 0 ? "positive" : "negative",
      recent: `${Math.round(b)} bpm`,
      previous: `${Math.round($)} bpm`,
      delta: -T
    });
  }

  const _typesM = {}, E_typesL = {};
  for (const b of m) for (const [$, T] of Object.entries(b.types)) _typesM[$] = (_typesM[$] || 0) + T;
  for (const b of l) for (const [$, T] of Object.entries(b.types)) E_typesL[$] = (E_typesL[$] || 0) + T;

  const P_all = new Set([...Object.keys(_typesM), ...Object.keys(E_typesL)]);
  for (const b of P_all) {
    const $ = (_typesM[b] || 0) / p;
    const T = (E_typesL[b] || 0) / o;
    const L = n($, T);
    if (Math.abs(L) > 20 && ($ > 300 || T > 300))
      i.push({
        label: G[b] || b,
        direction: L > 0 ? "up" : "down",
        sentiment: "neutral",
        recent: `${O($)}/wk`,
        previous: `${O(T)}/wk`,
        delta: L,
        detail: "volume shift"
      });
  }

  return i;
}

function TrendsSection({ data, weeksChronological }) {
  const i = useMemo(() => calculateTrends(data, weeksChronological), [data, weeksChronological]);
  if (i.length === 0) return null;

  const x = i.filter(d => d.sentiment === "positive");
  const p = i.filter(d => d.sentiment === "negative");
  const m = i.filter(d => d.sentiment === "neutral" && d.direction !== "flat");
  const o = i.filter(d => d.direction === "flat");

  const l = [];
  if (x.length > 0) l.push({ title: "Improving", items: x, color: "text-emerald-500" });
  if (p.length > 0) l.push({ title: "Declining", items: p, color: "text-red-400" });
  if (m.length > 0) l.push({ title: "Shifting", items: m, color: "text-[var(--training-3)]" });
  if (o.length > 0) l.push({ title: "Steady", items: o, color: "text-[var(--text-secondary)]" });

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 mb-6">
      <p className="font-mono text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-3">
        Trends · last 4 weeks vs previous 4
      </p>

      <div className="space-y-4">
        {l.map(d => (
          <div key={d.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-mono text-[12px] font-medium tracking-wide uppercase ${d.color}`}>
                {d.title === "Improving" ? "▲" : d.title === "Declining" ? "▼" : d.title === "Shifting" ? "◆" : "—"}{" "}
                {d.title}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {d.items.map(n => (
                <div key={n.label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[13px] font-mono font-medium ${n.sentiment === "positive" ? "text-emerald-500" : n.sentiment === "negative" ? "text-red-400" : "text-[var(--text-secondary)]"}`}>
                      {n.direction === "up" ? "↑" : n.direction === "down" ? "↓" : "→"}
                    </span>
                    <span className="text-[12px] text-[var(--text-primary)] truncate">{n.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-mono text-[12px] text-[var(--text-secondary)]">{n.previous}</span>
                    <span className="font-mono text-[12px] text-[var(--text-secondary)]">→</span>
                    <span className="font-mono text-[12px] text-[var(--text-primary)] font-medium">{n.recent}</span>
                    <span className={`font-mono text-[13px] font-medium px-1 py-0.5 rounded ${n.sentiment === "positive" ? "text-emerald-500 bg-emerald-500/10" : n.sentiment === "negative" ? "text-red-400 bg-red-400/10" : "text-[var(--text-secondary)] bg-[var(--bg-hover)]"}`}>
                      {n.delta >= 0 ? "+" : ""}{Math.round(n.delta)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(() => {
        const d = x.length, n = p.length;
        let t;
        if (d > 0 && n === 0) t = "All tracked metrics are trending in the right direction. Whatever you're doing, keep doing it.";
        else if (d > n * 2) t = "Mostly positive trends. A few areas to watch but the overall trajectory is good.";
        else if (n > d * 2) t = "Several metrics declining. Could signal overtraining, under-recovery, or a disrupted routine. Worth checking in with how you feel.";
        else if (n > 0 && d > 0) t = "Mixed signals — some things improving while others slip. Common during training shifts. Focus on the metrics that matter most to your current goal.";
        else t = "Metrics are mostly holding steady. Stable is fine if you're in a maintenance phase, but push something if you want gains.";
        return <p className="text-[13px] text-[var(--text-secondary)] !mb-0 mt-3 leading-relaxed">{t}</p>;
      })()}
    </div>
  );
}

// 6. HR ZONE DISTRIBUTION
const zoneColors = ["#60a5fa", "#34d399", "#facc15", "#fb923c", "#f87171"];
const zoneLabels = ["Z1", "Z2", "Z3", "Z4", "Z5"];

function HRZoneDistribution({ data, weeksChronological }) {
  const i = useMemo(() => {
    return weeksChronological
      .map(n => {
        const t = data.activities.filter(s => {
          const u = n.weekKey;
          const g = new Date(u);
          g.setDate(g.getDate() + 6);
          const f = g.toISOString().slice(0, 10);
          return s.date >= u && s.date <= f && s.hrZones;
        });
        const r = [0, 0, 0, 0, 0];
        for (const s of t) {
          if (s.hrZones) {
            for (let u = 0; u < 5; u++) r[u] += s.hrZones[u];
          }
        }
        const h = r.reduce((s, u) => s + u, 0);
        return { weekKey: n.weekKey, weekNum: n.weekNum, zones: r, total: h };
      })
      .filter(n => n.total > 0);
  }, [data, weeksChronological]);

  if (i.length < 2) return null;

  const x = i.slice(-Math.min(4, i.length));
  const p = i.length > 4 ? i.slice(-Math.min(8, i.length), -Math.min(4, i.length)) : null;

  const calcDist = n => {
    const t = [0, 0, 0, 0, 0];
    for (const h of n) for (let s = 0; s < 5; s++) t[s] += h.zones[s];
    const r = t.reduce((h, s) => h + s, 0);
    return t.map(h => (r > 0 ? (h / r) * 100 : 0));
  };

  const o = calcDist(x);
  const l = p ? calcDist(p) : null;
  const d = o[2];

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-mono text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-0">
          HR zone distribution
        </p>
        <span className="font-mono text-[13px] text-[var(--text-secondary)]">
          {d < 20 ? "polarized" : d < 35 ? "pyramidal" : "threshold-heavy"}
          <span className="opacity-50"> · Z3 {d.toFixed(0)}%</span>
        </span>
      </div>

      <div className="flex items-end gap-[3px] h-24 mb-3">
        {i.map(n => (
          <div key={n.weekKey} className="flex-1 flex flex-col h-full justify-end group relative">
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10">
              <div className="bg-[var(--text-primary)] text-[var(--bg)] text-[12px] font-mono px-1.5 py-1 rounded whitespace-nowrap">
                W{n.weekNum}: {n.zones.map((t, r) => `Z${r + 1} ${Math.round(t / 60)}m`).join(" · ")}
              </div>
            </div>
            <div className="w-full h-full rounded-sm overflow-hidden flex flex-col">
              {[...n.zones].reverse().map((t, r) => {
                const h = 4 - r;
                return t < 1 ? null : (
                  <div key={h} style={{ flex: `${t} 0 0%`, backgroundColor: zoneColors[h] }} />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {zoneLabels.map((n, t) => (
          <div key={t} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: zoneColors[t] }} />
            <span className="font-mono text-[13px] text-[var(--text-secondary)]">{n}</span>
            <span className="font-mono text-[13px] text-[var(--text-primary)] font-medium">{o[t].toFixed(0)}%</span>
            {l && Math.abs(o[t] - l[t]) > 2 && (
              <span className={`font-mono text-[12px] ${o[t] > l[t] ? "text-emerald-500" : "text-red-400"}`}>
                {o[t] > l[t] ? "+" : ""}{(o[t] - l[t]).toFixed(0)}
              </span>
            )}
          </div>
        ))}
      </div>

      {(() => {
        const n = o[0] + o[1];
        const t = o[3] + o[4];
        const r = l ? l[0] + l[1] : null;
        const h = l ? l[3] + l[4] : null;
        let s;
        if (d < 20 && n > 55) s = "Good polarized split — most time easy, hard when it counts. Sustainable for endurance gains.";
        else if (d < 20) s = "Polarized approach — avoiding the grey zone. High-intensity sessions complement the easy work.";
        else if (d >= 35) s = "Heavy on threshold work (Z3). Effective short-term, but can build fatigue fast. Consider more Z1-Z2 easy days.";
        else if (r !== null && n - r > 5) s = "Shifting easier — more Z1-Z2 time recently. Good for aerobic base building and recovery.";
        else if (h !== null && t - h > 5) s = "More high-intensity recently — Z4-Z5 time is up. Make sure easy days stay easy to absorb the load.";
        else s = "Pyramidal distribution — mostly easy, moderate threshold, some intensity. Classic endurance structure.";
        return <p className="text-[13px] text-[var(--text-secondary)] !mb-0 mt-2.5 leading-relaxed">{s}</p>;
      })()}
    </div>
  );
}

// 7. LONG RUN PROGRESSION
function LongRunProgression({ data, weeksChronological }) {
  const i = new Set(["running", "trail_running", "treadmill_running"]);
  const x = useMemo(() => {
    return weeksChronological
      .map(n => {
        const t = new Date(n.weekKey);
        t.setDate(t.getDate() + 6);
        const r = t.toISOString().slice(0, 10);
        const h = data.activities.filter(u => i.has(u.type) && u.date >= n.weekKey && u.date <= r && u.distance > 0);
        if (h.length === 0) return { weekNum: n.weekNum, weekKey: n.weekKey, distance: 0, duration: 0, pace: "", name: "" };
        const s = h.reduce((u, g) => (g.distance > u.distance ? g : u), h[0]);
        return {
          weekNum: n.weekNum,
          weekKey: n.weekKey,
          distance: s.distance,
          duration: s.duration,
          pace: s.distance > 0 && s.duration > 0 ? ne(s.distance, s.duration) : "",
          name: s.name
        };
      })
      .filter(n => n.distance > 0);
  }, [data, weeksChronological]);

  if (x.length < 3) return null;

  const p = x.map(n => n.distance);
  const m = Math.max(...p, 1);
  const o = x[x.length - 1];
  const l = x.length > 1 ? x[x.length - 2] : null;
  const d = x.reduce((n, t) => (t.distance > n.distance ? t : n), x[0]);

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-mono text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-0">
          Long run progression
        </p>
        <span className="font-mono text-[13px] text-[var(--text-secondary)]">
          peak <span className="text-[var(--text-primary)] font-medium">{H(d.distance)}</span>
          <span className="opacity-50"> wk {d.weekNum}</span>
        </span>
      </div>

      <div className="flex items-end gap-[3px] h-20 mb-2">
        {x.map((n, t) => {
          const r = (n.distance / m) * 100;
          const h = t === x.length - 1;
          const s = n.distance === d.distance;
          return (
            <div key={n.weekKey} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                <div className="bg-[var(--text-primary)] text-[var(--bg)] text-[12px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
                  W{n.weekNum}: {H(n.distance)} · {O(n.duration)} {n.pace && `· ${n.pace}`}
                </div>
              </div>
              <div
                className={`w-full rounded-sm ${h ? "bg-[var(--training-3)]" : s ? "bg-[var(--training-4)]" : "bg-[var(--training-2)]"}`}
                style={{ height: `${Math.max(r, 4)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[12px] text-[var(--text-primary)] font-medium">{H(o.distance)}</span>
        {o.pace && <span className="font-mono text-[12px] text-[var(--text-secondary)]">{o.pace}</span>}
        {l && l.distance > 0 && (
          <span className={`font-mono text-[13px] px-1 py-0.5 rounded ${o.distance >= l.distance ? "text-emerald-500 bg-emerald-500/10" : "text-red-400 bg-red-400/10"}`}>
            {o.distance >= l.distance ? "+" : ""}{(((o.distance - l.distance) / l.distance) * 100).toFixed(0)}% vs prev
          </span>
        )}
        <span className="font-mono text-[12px] text-[var(--text-secondary)] opacity-50">longest run per week</span>
      </div>

      {(() => {
        const n = x.slice(-4);
        const t = x.length >= 8 ? x.slice(-8, -4) : null;
        const r = n.reduce((y, N) => y + N.distance, 0) / n.length;
        const h = t ? t.reduce((y, N) => y + N.distance, 0) / t.length : null;
        const s = h ? ((r - h) / h) * 100 : null;
        const u = o.distance === d.distance;
        const g = o.distance >= d.distance * 0.9;
        let f;
        if (u) f = "Hit a new peak this week. Make sure the next week has a step-back to absorb the stimulus.";
        else if (s !== null && s > 15) f = "Long run distance building well. Keep the weekly increase under 10-15% to stay injury-free.";
        else if (s !== null && s < -15) f = "Long run distance has dropped off. If intentional (recovery block), that's fine. Otherwise, prioritize getting the long run back in.";
        else if (g) f = "Hovering near peak long run distance. Consistent — good place to hold before pushing further.";
        else f = "Long run is steady. The backbone of endurance — keep showing up for this one.";
        return <p className="text-[13px] text-[var(--text-secondary)] !mb-0 mt-2.5 leading-relaxed">{f}</p>;
      })()}
    </div>
  );
}

// 8. BODY COMPOSITION TRENDS
function BodyCompTrends({ bodyComp }) {
  const c = bodyComp?.dateWeightList || [];
  const i = useMemo(() => {
    if (c.length < 2) return null;
    const s = {};
    for (const g of c) {
      const f = g.calendarDate;
      if (!f) continue;
      const y = new Date(f + "T12:00:00");
      const N = y.getDay();
      const j = new Date(y);
      j.setDate(y.getDate() - (N + 6) % 7);
      const v = j.toISOString().slice(0, 10);
      s[v] || (s[v] = { weights: [], bodyFats: [], muscles: [] });
      if (g.weight) s[v].weights.push(g.weight / 1000);
      if (g.bodyFat) s[v].bodyFats.push(g.bodyFat);
      if (g.muscleMass) s[v].muscles.push(g.muscleMass / 1000);
    }
    return Object.entries(s)
      .sort((g, f) => g[0].localeCompare(f[0]))
      .map(([g, f]) => ({
        weekKey: g,
        weight: f.weights.length > 0 ? f.weights.reduce((y, N) => y + N, 0) / f.weights.length : null,
        bodyFat: f.bodyFats.length > 0 ? f.bodyFats.reduce((y, N) => y + N, 0) / f.bodyFats.length : null,
        muscle: f.muscles.length > 0 ? f.muscles.reduce((y, N) => y + N, 0) / f.muscles.length : null
      }));
  }, [c]);

  if (!i || i.length < 3) return null;
  const x = i.map(s => s.weight).filter(s => s !== null);
  const p = i.map(s => s.bodyFat).filter(s => s !== null);
  const m = i.map(s => s.muscle).filter(s => s !== null);

  const o = x.length >= 3;
  const l = p.length >= 3;
  const d = m.length >= 3;
  if (!o && !l && !d) return null;

  const n = s => {
    if (s.length < 4) return null;
    const u = s.slice(-4);
    const g = s.slice(-8, -4);
    if (g.length === 0) return null;
    const f = u.reduce((N, j) => N + j, 0) / u.length;
    const y = g.reduce((N, j) => N + j, 0) / g.length;
    return { recent: f, previous: y, change: f - y };
  };

  const t = o ? n(x) : null;
  const r = l ? n(p) : null;
  const h = d ? n(m) : null;

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 mb-6">
      <p className="font-mono text-[13px] tracking-widest uppercase text-[var(--text-secondary)] !mb-3">
        Body composition trends
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {o && (
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-mono text-[13px] text-[var(--text-secondary)]">Weight</span>
              {t && (
                <span className={`font-mono text-[13px] font-medium ${t.change < -0.2 ? "text-emerald-500" : t.change > 0.2 ? "text-red-400" : "text-[var(--text-secondary)]"}`}>
                  {t.change >= 0 ? "+" : ""}{t.change.toFixed(1)}kg
                </span>
              )}
            </div>
            <Sparkline values={x} color={t && t.change < -0.2 ? "#34d399" : t && t.change > 0.2 ? "#f87171" : "var(--text-secondary)"} width={160} height={36} />
            <p className="font-mono text-[12px] text-[var(--text-primary)] font-medium !mb-0 mt-1">
              {x[x.length - 1].toFixed(1)}kg
            </p>
          </div>
        )}
        {l && (
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-mono text-[13px] text-[var(--text-secondary)]">Body fat</span>
              {r && (
                <span className={`font-mono text-[13px] font-medium ${r.change < -0.3 ? "text-emerald-500" : r.change > 0.3 ? "text-red-400" : "text-[var(--text-secondary)]"}`}>
                  {r.change >= 0 ? "+" : ""}{r.change.toFixed(1)}%
                </span>
              )}
            </div>
            <Sparkline values={p} color={r && r.change < -0.3 ? "#34d399" : r && r.change > 0.3 ? "#f87171" : "var(--text-secondary)"} width={160} height={36} />
            <p className="font-mono text-[12px] text-[var(--text-primary)] font-medium !mb-0 mt-1">
              {p[p.length - 1].toFixed(1)}%
            </p>
          </div>
        )}
        {d && (
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-mono text-[13px] text-[var(--text-secondary)]">Muscle mass</span>
              {h && (
                <span className={`font-mono text-[13px] font-medium ${h.change > 0.2 ? "text-emerald-500" : h.change < -0.2 ? "text-red-400" : "text-[var(--text-secondary)]"}`}>
                  {h.change >= 0 ? "+" : ""}{h.change.toFixed(1)}kg
                </span>
              )}
            </div>
            <Sparkline values={m} color={h && h.change > 0.2 ? "#34d399" : h && h.change < -0.2 ? "#f87171" : "var(--text-secondary)"} width={160} height={36} />
            <p className="font-mono text-[12px] text-[var(--text-primary)] font-medium !mb-0 mt-1">
              {m[m.length - 1].toFixed(1)}kg
            </p>
          </div>
        )}
      </div>

      {(() => {
        const s = t && t.change < -0.3;
        const u = t && t.change > 0.3;
        const g = h && h.change > 0.2;
        const f = h && h.change < -0.2;
        const y = h && Math.abs(h.change) <= 0.2;
        const N = r && r.change < -0.3;
        const j = r && r.change > 0.3;
        let v;
        if (s && g) v = "Recomping — losing weight while building muscle. Ideal body composition shift.";
        else if (s && N && y) v = "Leaning out — weight and body fat dropping while muscle holds. Clean cut.";
        else if (s && N && f) v = "Losing weight but also losing muscle. Increase protein intake or reduce the deficit to preserve lean mass.";
        else if (s && N) v = "Leaning out — weight and body fat both trending down. Training is driving the cut.";
        else if (g && N) v = "Textbook recomp — muscle up, body fat down. Hard to achieve and you're doing it.";
        else if (g && !s) v = "Building muscle while weight holds steady. Strength work is paying off.";
        else if (g && u) v = "Gaining weight and muscle — bulking phase. Watch body fat to keep the gain clean.";
        else if (f && !s) v = "Muscle mass trending down while weight is stable. Could signal insufficient protein or not enough resistance training.";
        else if (f && s) v = "Losing both weight and muscle. Slow the deficit or add more strength work to protect lean mass.";
        else if (s) v = "Weight trending down. Make sure energy and recovery are still adequate for training load.";
        else if (u && j) v = "Weight and body fat both climbing. If unintentional, check nutrition — training alone may not be enough.";
        else if (y && !s && !u) v = "Muscle mass is holding steady — maintaining your lean mass base. Add progressive overload to push it higher.";
        else {
          const k = [];
          s ? k.push("weight down") : u ? k.push("weight up") : t && k.push("weight stable");
          N ? k.push("body fat down") : j && k.push("body fat up");
          g ? k.push("muscle up") : f ? k.push("muscle down") : y && k.push("muscle stable");
          v = k.length > 0 ? `Body comp: ${k.join(", ")}. Track against your goals.` : "Body composition is holding steady. No significant shifts in the last few weeks.";
        }
        return <p className="text-[13px] text-[var(--text-secondary)] !mb-0 mt-3 leading-relaxed">{v}</p>;
      })()}
    </div>
  );
}

// 9. WEEKLY BREAKDOWN SECTION
function WeeklyBreakdownSection({ data, bodyComp, sleepHistory }) {
  const weeksChronological = useMemo(() => calculateWeeklyData(data), [data]);
  const weeksReversed = useMemo(() => [...weeksChronological].reverse(), [weeksChronological]);
  const maxDuration = Math.max(...weeksReversed.map(t => t.duration), 1);

  const [expandedWeekKey, setExpandedWeekKey] = useState(null);
  const [expandedActivityId, setExpandedActivityId] = useState(null);

  return (
    <div>
      <TrainingLoadChart data={data} />
      <TrendsSection data={data} weeksChronological={weeksChronological} />
      <HRZoneDistribution data={data} weeksChronological={weeksChronological} />
      <LongRunProgression data={data} weeksChronological={weeksChronological} />
      <BodyCompTrends bodyComp={bodyComp} />

      <div className="space-y-0">
        {weeksReversed.map((t, r) => {
          const h = Object.entries(t.types).sort((v, k) => k[1] - v[1]);
          const s = h.reduce((v, [, k]) => v + k, 0);
          const u = r === 0;
          const g = maxDuration > 0 ? (t.rollingAvg4w / maxDuration) * 100 : 0;
          const isExpanded = expandedWeekKey === t.weekKey;

          const y = new Date(t.weekKey);
          y.setDate(y.getDate() + 6);
          const N = y.toISOString().slice(0, 10);
          const weekActivities = isExpanded
            ? data.activities
                .filter(v => v.date >= t.weekKey && v.date <= N)
                .sort((v, k) => k.date.localeCompare(v.date))
            : [];

          return (
            <div key={t.weekKey} className={`py-3 ${r < weeksReversed.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
              {/* WEEK ROW (CLICKABLE TO TOGGLE EXPAND/COLLAPSE) */}
              <div
                className="cursor-pointer"
                onClick={() => {
                  setExpandedWeekKey(isExpanded ? null : t.weekKey);
                  setExpandedActivityId(null);
                }}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[13px] ${u ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-secondary)]"}`}>
                      {t.label}
                    </span>
                    <span className="font-mono text-[13px] text-[var(--text-secondary)] opacity-50">W{t.weekNum}</span>
                    {u && (
                      <span className="font-mono text-[12px] tracking-widest uppercase text-[var(--training-3)] font-medium">
                        current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-[var(--text-secondary)]">
                      {t.activities} {t.activities === 1 ? "session" : "sessions"}
                      {t.durationDelta !== null && (
                        <span
                          className={`ml-1.5 ${
                            Math.abs(t.durationDelta) < 5
                              ? "text-[var(--text-secondary)]"
                              : t.durationDelta > 0
                              ? t.durationDelta > 15
                                ? "text-orange-400"
                                : "text-emerald-500"
                              : "text-red-400"
                          }`}
                        >
                          {t.durationDelta >= 0 ? "+" : ""}
                          {Math.round(t.durationDelta)}%
                        </span>
                      )}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex-1 relative group/bar">
                    <div className="h-5 bg-[var(--training-0)] rounded-[3px] overflow-hidden flex">
                      {s > 0 &&
                        h.map(([v, k]) => (
                          <div
                            key={v}
                            className="h-full"
                            style={{
                              width: `${(k / maxDuration) * 100}%`,
                              backgroundColor: X[v] || X.other,
                              minWidth: k > 0 ? "2px" : 0
                            }}
                          />
                        ))}
                    </div>
                    {s > 0 && (
                      <div className="absolute bottom-full mb-1.5 left-0 opacity-0 group-hover/bar:opacity-100 pointer-events-none z-10">
                        <div className="bg-[var(--text-primary)] text-[var(--bg)] text-[11px] font-mono px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap flex items-center gap-3">
                          {h.map(([v, k]) => (
                            <span key={v} className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ backgroundColor: X[v] || X.other }} />
                              {G[v] || v} {O(k)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {g > 0 && g <= 100 && (
                      <div
                        className="absolute top-0 h-5 border-r-[1.5px] border-dashed border-[var(--text-secondary)] opacity-30 pointer-events-none"
                        style={{ left: `${g}%` }}
                      />
                    )}
                  </div>
                  <span className="font-mono text-[13px] text-[var(--text-primary)] w-[52px] text-right tabular-nums font-medium shrink-0">
                    {t.duration > 0 ? O(t.duration) : "–"}
                  </span>
                </div>

                {t.duration > 0 && (
                  <div className="flex items-center gap-4 flex-wrap">
                    {t.distance > 0 && <span className="font-mono text-[12px] text-[var(--text-secondary)] tabular-nums">{H(t.distance)}</span>}
                    {t.elevation > 0 && <span className="font-mono text-[12px] text-[var(--text-secondary)] tabular-nums">{t.elevation}m ↑</span>}
                    {t.avgHr && <span className="font-mono text-[12px] text-[var(--text-secondary)] tabular-nums">{t.avgHr} bpm</span>}
                    {t.calories > 0 && <span className="font-mono text-[12px] text-[var(--text-secondary)] tabular-nums">{t.calories} cal</span>}
                  </div>
                )}
              </div>

              {/* EXPANDED ACTIVITIES FOR THIS WEEK */}
              {isExpanded && weekActivities.length > 0 && (
                <div className="overflow-hidden">
                  <div className="mt-3 border border-[var(--border)] rounded-lg px-3">
                    {weekActivities.map((v, k) => {
                      const M = `week-${t.weekKey}-${v.date}-${v.name}-${k}`;
                      return (
                        <div key={M} className={k < weekActivities.length - 1 ? "border-b border-[var(--border)]" : ""}>
                          <ActivityCard
                            activity={v}
                            isExpanded={expandedActivityId === M}
                            onToggle={() => setExpandedActivityId(expandedActivityId === M ? null : M)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrainingPage() {
  const data = useMemo(() => parseRawActivities(rawData.rawActivities), []);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("heatmap");

  const selectedDayActivities = useMemo(() => {
    return selectedDate ? data.activities.filter(a => a.date === selectedDate) : [];
  }, [data, selectedDate]);

  return (
    <section className="page training-page dark" aria-label="2026 Training">
      <style>{`${fontStyles}\n${trainingStyles}\n:root { --bg: #191919; --bg-sidebar: #252525; --bg-hover: #2E2E2E; --text-primary: #D4D4D4; --text-secondary: #9B9B9B; --border: #2E2E2E; --training-0: #252525; --training-future: #1f1f1f; }\n.sidebar nav { display: flex !important; flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; padding: 0 !important; margin: 0 !important; }\n.sidebar .nav-link { padding: 1px 0 !important; margin: 0 !important; line-height: 1.4 !important; min-height: 0 !important; height: auto !important; border: none !important; background: transparent !important; }\n.training-page { padding-top: 70px !important; padding-bottom: 80px !important; }\n.training-content { width: 100% !important; max-width: 896px !important; margin: 0 !important; margin-left: var(--home-content-inset) !important; padding: 0 !important; }`}</style>

      <div className="training-content antialiased font-sans text-[var(--text-primary)]">
        <div className="w-full">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">2026 Training</h1>
            <p className="text-sm text-[var(--text-secondary)]">Daily training log · synced from Garmin Connect</p>
          </div>

          <HeaderStats
            data={data}
            trainingStatus={rawData.trainingStatus}
            sleepData={rawData.sleepData}
            bodyComp={rawData.bodyComp}
          />

          <HeatmapSection
            data={data}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {selectedDate && (
            <SelectedDayDrawer
              date={selectedDate}
              activities={selectedDayActivities}
              onClose={() => setSelectedDate(null)}
            />
          )}

          <div className="mt-10">
            <WeeklyBreakdownSection
              data={{ ...data, activities: data.activities.filter(M => oe.has(M.type)) }}
              bodyComp={rawData.bodyComp}
              sleepHistory={rawData.sleepHistory}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
