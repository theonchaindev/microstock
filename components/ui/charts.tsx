"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------ plumbing */

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export type Pt = { t: number; v: number };

const niceDomain = (vals: number[], padRatio = 0.08) => {
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = (hi - lo || Math.abs(hi) || 1) * padRatio;
  return [lo - pad, hi + pad] as const;
};

/* ---------------------------------------------------------- area chart */

/**
 * Single-series area + line with a crosshair tooltip. One series means no
 * legend box — the caption above names what is plotted.
 */
export function AreaChart({
  data,
  color = "var(--series-1)",
  height = 220,
  fmtValue,
  fmtTime,
  label,
}: {
  data: Pt[];
  color?: string;
  height?: number;
  fmtValue: (v: number) => string;
  fmtTime: (t: number) => string;
  label: string;
}) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const uid = useId().replace(/[:]/g, "");

  const padL = 68;
  const padR = 14;
  const padT = 14;
  const padB = 24;
  const iw = Math.max(10, w - padL - padR);
  const ih = height - padT - padB;

  const [lo, hi] = useMemo(() => niceDomain(data.map((d) => d.v)), [data]);
  const x = useCallback((i: number) => padL + (i / Math.max(1, data.length - 1)) * iw, [data.length, iw]);
  const y = useCallback((v: number) => padT + (1 - (v - lo) / (hi - lo || 1)) * ih, [hi, ih, lo]);

  const line = useMemo(() => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(" "), [data, x, y]);
  const area = `${line} L${x(data.length - 1).toFixed(1)} ${padT + ih} L${padL} ${padT + ih} Z`;

  const ticks = useMemo(() => [0, 0.25, 0.5, 0.75, 1].map((f) => lo + (hi - lo) * f), [hi, lo]);
  const idx = hover == null ? null : Math.max(0, Math.min(data.length - 1, Math.round(((hover - padL) / iw) * (data.length - 1))));
  const hp = idx == null ? null : data[idx];
  const last = data[data.length - 1];

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {w > 0 && (
        <svg
          width={w}
          height={height}
          role="img"
          aria-label={label}
          onMouseMove={(e) => setHover(e.clientX - e.currentTarget.getBoundingClientRect().left)}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.34" />
              <stop offset="1" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} stroke="var(--grid)" strokeWidth="1" />
              <text x={padL - 10} y={y(t) + 4} textAnchor="end" fontSize="10.5" fill="var(--text-faint)" className="tabular">
                {fmtValue(t)}
              </text>
            </g>
          ))}

          <path d={area} fill={`url(#fill-${uid})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {/* last point carries a direct label; no number on every point */}
          <circle cx={x(data.length - 1)} cy={y(last.v)} r="4" fill={color} stroke="var(--content)" strokeWidth="2" />

          {[0, 0.5, 1].map((f) => {
            const i = Math.round(f * (data.length - 1));
            return (
              <text key={f} x={x(i)} y={height - 7} textAnchor={f === 0 ? "start" : f === 1 ? "end" : "middle"} fontSize="10.5" fill="var(--text-faint)">
                {fmtTime(data[i].t)}
              </text>
            );
          })}

          {hp && idx != null && (
            <g>
              <line x1={x(idx)} x2={x(idx)} y1={padT} y2={padT + ih} stroke="#b9b5a4" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={x(idx)} cy={y(hp.v)} r="5" fill={color} stroke="var(--content)" strokeWidth="2" />
            </g>
          )}
        </svg>
      )}

      {hp && idx != null && (
        <Tooltip left={x(idx)} top={y(hp.v)} width={w}>
          <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{fmtTime(hp.t)}</div>
          <div className="tabular text-[13px] font-semibold">{fmtValue(hp.v)}</div>
        </Tooltip>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- bar chart */

export function BarChart({
  data,
  color = "var(--series-3)",
  height = 190,
  fmtValue,
  fmtTime,
  label,
}: {
  data: Pt[];
  color?: string;
  height?: number;
  fmtValue: (v: number) => string;
  fmtTime: (t: number) => string;
  label: string;
}) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const padL = 68;
  const padR = 10;
  const padT = 12;
  const padB = 22;
  const iw = Math.max(10, w - padL - padR);
  const ih = height - padT - padB;
  const hi = Math.max(...data.map((d) => d.v), 1) * 1.1;
  const slot = iw / data.length;
  const bw = Math.max(3, slot - 2); // 2px surface gap between adjacent bars

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {w > 0 && (
        <svg width={w} height={height} role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
          {[0, 0.5, 1].map((f) => {
            const v = hi * f;
            const yy = padT + (1 - f) * ih;
            return (
              <g key={f}>
                <line x1={padL} x2={w - padR} y1={yy} y2={yy} stroke="var(--grid)" strokeWidth="1" />
                <text x={padL - 10} y={yy + 4} textAnchor="end" fontSize="10.5" fill="var(--text-faint)" className="tabular">
                  {fmtValue(v)}
                </text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const h = Math.max(2, (d.v / hi) * ih);
            const xx = padL + i * slot + (slot - bw) / 2;
            return (
              <rect
                key={i}
                x={xx}
                y={padT + ih - h}
                width={bw}
                height={h}
                rx={Math.min(4, bw / 2)}
                fill={color}
                opacity={hover == null || hover === i ? 1 : 0.42}
                onMouseEnter={() => setHover(i)}
              />
            );
          })}
          {[0, data.length - 1].map((i, k) => (
            <text key={k} x={padL + i * slot + slot / 2} y={height - 6} textAnchor={k ? "end" : "start"} fontSize="10.5" fill="var(--text-faint)">
              {fmtTime(data[i].t)}
            </text>
          ))}
        </svg>
      )}
      {hover != null && (
        <Tooltip left={padL + hover * slot + slot / 2} top={padT + ih - (data[hover].v / hi) * ih} width={w}>
          <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{fmtTime(data[hover].t)}</div>
          <div className="tabular text-[13px] font-semibold">{fmtValue(data[hover].v)}</div>
        </Tooltip>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- donut */

/** Dash length + offset for each ring segment, as a prefix sum of the values. */
function arcGeometry(values: number[], total: number, circ: number) {
  return values.map((v, i) => ({
    dash: (v / total) * circ,
    offset: -(values.slice(0, i).reduce((a, b) => a + b, 0) / total) * circ,
  }));
}

export function Donut({
  slices,
  size = 168,
  centerLabel,
  centerValue,
}: {
  slices: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const r = size / 2 - 12;
  const c = size / 2;
  const stroke = 18;
  const circ = 2 * Math.PI * r;
  const [hover, setHover] = useState<number | null>(null);

  const arcs = useMemo(() => arcGeometry(slices.map((s) => s.value), total, circ), [circ, slices, total]);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} role="img" aria-label="Supply breakdown">
        <g transform={`rotate(-90 ${c} ${c})`}>
          {slices.map((s, i) => {
            // 2px surface gap keeps neighbouring fills apart
            const dash = Math.max(0, arcs[i].dash - 2);
            return (
              <circle
                key={s.label}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={hover === i ? stroke + 3 : stroke}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={arcs[i].offset}
                opacity={hover == null || hover === i ? 1 : 0.45}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </g>
        {centerValue && (
          <>
            <text x={c} y={c - 2} textAnchor="middle" fontSize="19" fontWeight="600" fill="var(--text)" className="tabular">
              {centerValue}
            </text>
            <text x={c} y={c + 16} textAnchor="middle" fontSize="10.5" fill="var(--text-faint)">
              {centerLabel}
            </text>
          </>
        )}
      </svg>
      {/* legend — identity never rests on colour alone */}
      <ul className="min-w-[180px] space-y-2.5">
        {slices.map((s, i) => (
          <li
            key={s.label}
            className="flex items-center justify-between gap-4 text-[12.5px]"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ opacity: hover == null || hover === i ? 1 : 0.5 }}
          >
            <span className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
              <span style={{ color: "var(--text-dim)" }}>{s.label}</span>
            </span>
            <span className="tabular font-medium">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------- sparkline */

export function Sparkline({ data, color = "var(--series-1)", w = 120, h = 34 }: { data: Pt[]; color?: string; w?: number; h?: number }) {
  const [lo, hi] = niceDomain(data.map((d) => d.v), 0.12);
  const d = data
    .map((p, i) => `${i ? "L" : "M"}${((i / (data.length - 1)) * w).toFixed(1)} ${((1 - (p.v - lo) / (hi - lo || 1)) * h).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={w} height={h} aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------- tooltip */

function Tooltip({ left, top, width, children }: { left: number; top: number; width: number; children: React.ReactNode }) {
  const flip = left > width - 130;
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-md px-2.5 py-1.5"
      style={{
        left: flip ? left - 12 : left + 12,
        top: Math.max(0, top - 34),
        transform: flip ? "translateX(-100%)" : undefined,
        background: "var(--content-alt)",
        border: "1px solid #b9b5a4",
        boxShadow: "var(--shadow-menu)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

