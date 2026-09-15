import type { SVGProps } from "react";

/* ------------------------------------------------------------------ *
 * App tile icons — rounded plates with a white glyph, Fluent-ish.
 * ------------------------------------------------------------------ */

type TileProps = { size?: number; className?: string };

function Plate({
  id,
  from,
  to,
  size,
  className,
  children,
}: TileProps & { id: string; from: string; to: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="11" fill={`url(#${id})`} />
      <rect x="2" y="2" width="44" height="44" rx="11" fill="none" stroke="rgba(255,255,255,.22)" />
      {children}
    </svg>
  );
}

const S = { fill: "none", stroke: "#fff", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconTerminalApp = (p: TileProps) => (
  <Plate id="g-term" from="#2f6df6" to="#27b7ff" {...p}>
    <path d="M14 30l6-7 5 4 9-12" {...S} />
    <circle cx="34" cy="15" r="2.6" fill="#fff" />
    <path d="M13 35h22" {...S} strokeWidth={2} opacity={0.65} />
  </Plate>
);

export const IconPayouts = (p: TileProps) => (
  <Plate id="g-pay" from="#0f8f5a" to="#37d39b" {...p}>
    <ellipse cx="24" cy="17" rx="10" ry="4.2" {...S} />
    <path d="M14 17v8c0 2.3 4.5 4.2 10 4.2s10-1.9 10-4.2v-8" {...S} />
    <path d="M24 32v6m0 0l-3.2-3.2M24 38l3.2-3.2" {...S} />
  </Plate>
);

export const IconWallet = (p: TileProps) => (
  <Plate id="g-wal" from="#7a3ff2" to="#b06bff" {...p}>
    <rect x="12" y="15" width="24" height="19" rx="4" {...S} />
    <path d="M12 21h24" {...S} />
    <circle cx="30" cy="27.5" r="2.2" fill="#fff" />
  </Plate>
);

export const IconCharts = (p: TileProps) => (
  <Plate id="g-cha" from="#d4541f" to="#ff9440" {...p}>
    <path d="M17 13v22M17 18h5v10h-5M31 13v22M31 21h5v8h-5" {...S} strokeWidth={2.2} />
  </Plate>
);

export const IconFolder = (p: TileProps) => (
  <Plate id="g-fol" from="#d79b13" to="#ffd166" {...p}>
    <path d="M12 17h8l3 3h13v14a2 2 0 01-2 2H14a2 2 0 01-2-2V17z" {...S} />
  </Plate>
);

export const IconNotepad = (p: TileProps) => (
  <Plate id="g-not" from="#1f7ec9" to="#63c8ff" {...p}>
    <path d="M16 12h12l6 6v18a2 2 0 01-2 2H16a2 2 0 01-2-2V14a2 2 0 012-2z" {...S} />
    <path d="M28 12v6h6M19 26h10M19 31h7" {...S} strokeWidth={2} />
  </Plate>
);

export const IconGlobe = (p: TileProps) => (
  <Plate id="g-glo" from="#0b7f9e" to="#2fd0c9" {...p}>
    <circle cx="24" cy="24" r="11" {...S} />
    <path d="M13 24h22M24 13c3.5 4 3.5 18 0 22-3.5-4-3.5-18 0-22z" {...S} strokeWidth={2} />
  </Plate>
);

export const IconGear = (p: TileProps) => (
  <Plate id="g-set" from="#5b6470" to="#8c98a8" {...p}>
    <circle cx="24" cy="24" r="4.6" {...S} />
    <path d="M24 13.4v3.3M24 31.3v3.3M34.6 24h-3.3M16.7 24h-3.3M31.5 16.5l-2.3 2.3M18.8 29.2l-2.3 2.3M31.5 31.5l-2.3-2.3M18.8 18.8l-2.3-2.3" {...S} strokeWidth={2.6} />
  </Plate>
);

export const IconActivity = (p: TileProps) => (
  <Plate id="g-act" from="#1552b5" to="#3f9bff" {...p}>
    <path d="M12 24h6l3.5-9 5 18 3.5-9h6" {...S} />
  </Plate>
);

export const IconCmd = (p: TileProps) => (
  <Plate id="g-cmd" from="#101418" to="#31383f" {...p}>
    <path d="M16 18l6 6-6 6M26 31h8" {...S} />
  </Plate>
);

export const IconHolders = (p: TileProps) => (
  <Plate id="g-hol" from="#b23a86" to="#f07ab4" {...p}>
    <circle cx="20" cy="20" r="4.6" {...S} />
    <path d="M12 34c0-4.4 3.6-7 8-7s8 2.6 8 7" {...S} />
    <path d="M30 18.4a4.4 4.4 0 010 8.4M31 33.6c0-3.4-1-5.3-2.6-6.6" {...S} strokeWidth={2} />
  </Plate>
);

export const IconRecycle = (p: TileProps) => (
  <Plate id="g-rec" from="#3c4650" to="#66727f" {...p}>
    <path d="M14 17h20M19 17v-3h10v3M17 17l1.6 19a2 2 0 002 1.9h6.8a2 2 0 002-1.9L31 17" {...S} strokeWidth={2.1} />
  </Plate>
);

/* ------------------------------------------------------------------ *
 * Line glyphs — taskbar, chrome, tray.  Currentcolor, 1.3px strokes.
 * ------------------------------------------------------------------ */

type G = SVGProps<SVGSVGElement> & { size?: number };

const glyph = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const WindowsLogo = ({ size = 20, ...r }: G) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...r}>
    <path fill="currentColor" d="M3 5.2l8-1.1v7.4H3V5.2zm0 13.6l8 1.1v-7.3H3v6.2zM12.2 4l8.8-1.2v8.7h-8.8V4zm0 16l8.8 1.2v-8.6h-8.8V20z" />
  </svg>
);

export const IconSearch = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><circle cx="7" cy="7" r="4.4" /><path d="M10.4 10.4L14 14" /></svg>
);

export const IconTaskView = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="1.6" y="4" width="8.4" height="8" rx="1.4" /><path d="M12 5.4v5.2M14 6.6v2.8" /></svg>
);

export const IconWidgets = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="1.8" y="1.8" width="5.4" height="5.4" rx="1.2" /><rect x="8.8" y="1.8" width="5.4" height="5.4" rx="1.2" /><rect x="1.8" y="8.8" width="5.4" height="5.4" rx="1.2" /><rect x="8.8" y="8.8" width="5.4" height="5.4" rx="1.2" /></svg>
);

export const IconWifi = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M1.4 5.9a9.6 9.6 0 0113.2 0M3.9 8.5a6 6 0 018.2 0M6.3 11a2.6 2.6 0 013.4 0" /><circle cx="8" cy="13.2" r="0.7" fill="currentColor" stroke="none" /></svg>
);

export const IconVolume = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M3 6.2h2.2L8.4 3.6v8.8L5.2 9.8H3z" /><path d="M10.6 6a2.8 2.8 0 010 4M12.6 4.2a5.4 5.4 0 010 7.6" /></svg>
);

export const IconBattery = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="1.4" y="5.4" width="11.6" height="5.6" rx="1.4" /><path d="M14.4 7.4v1.8" /><rect x="2.8" y="6.8" width="7.6" height="2.8" rx="0.7" fill="currentColor" stroke="none" /></svg>
);

export const IconBell = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M4 11V7.2a4 4 0 118 0V11l1.2 1.6H2.8z" /><path d="M6.6 14h2.8" /></svg>
);

export const IconChevronUp = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M4 9.6L8 5.8l4 3.8" /></svg>
);

export const IconChevronRight = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M6 3.4L10.4 8 6 12.6" /></svg>
);

export const IconPower = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M8 2.2v5.4" /><path d="M11.8 4.4a5 5 0 11-7.6 0" /></svg>
);

export const IconMin = (r: G) => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...r}><path d="M0.6 5h8.8" stroke="currentColor" strokeWidth="1" /></svg>
);

export const IconMax = (r: G) => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...r}><rect x="0.9" y="0.9" width="8.2" height="8.2" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
);

export const IconRestore = (r: G) => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...r}>
    <rect x="0.6" y="2.6" width="6.8" height="6.8" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M2.8 2.4V1.8A1.2 1.2 0 014 .6h4.2a1.2 1.2 0 011.2 1.2V6a1.2 1.2 0 01-1.2 1.2h-.6" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const IconClose = (r: G) => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...r}><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1" /></svg>
);

export const IconCopy = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="5.4" y="5.4" width="8.2" height="8.2" rx="1.4" /><path d="M10.6 5.4V3.8a1.4 1.4 0 00-1.4-1.4H3.8a1.4 1.4 0 00-1.4 1.4v5.4a1.4 1.4 0 001.4 1.4h1.6" /></svg>
);

export const IconCheck = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M3 8.4l3.2 3.2L13 4.8" /></svg>
);

export const IconRefresh = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M13.4 8a5.4 5.4 0 11-1.7-3.9" /><path d="M13.6 2.2v3.2h-3.2" /></svg>
);

export const IconExternal = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M9.4 2.4h4.2v4.2M13.4 2.6L7.6 8.4" /><path d="M12.4 9.6v3a1.4 1.4 0 01-1.4 1.4H3.4A1.4 1.4 0 012 12.6V5a1.4 1.4 0 011.4-1.4h3" /></svg>
);

export const IconLock = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="3.2" y="7" width="9.6" height="7" rx="1.6" /><path d="M5.4 7V5.2a2.6 2.6 0 015.2 0V7" /></svg>
);
