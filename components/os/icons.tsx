import type { SVGProps } from "react";

/* ==================================================================== *
 * App icons, drawn in the Windows XP idiom: saturated fills, a light
 * source from the top-left, a gloss highlight, and a dark outline.
 * Authored at 32x32 so they stay crisp at taskbar size.
 * ==================================================================== */

type TileProps = { size?: number; className?: string };

const Svg = ({ size = 32, className, children }: TileProps & { children: React.ReactNode }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true" shapeRendering="geometricPrecision">
    {children}
  </svg>
);

/** Shared gradient defs — one instance is enough for the whole document. */
export function IconDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="xp-screen" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#d8ecff" />
          <stop offset="0.5" stopColor="#7fb7f0" />
          <stop offset="1" stopColor="#2c6fb5" />
        </linearGradient>
        <linearGradient id="xp-case" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#fdfdf8" />
          <stop offset="0.45" stopColor="#ddd8c4" />
          <stop offset="1" stopColor="#a49f8a" />
        </linearGradient>
        <linearGradient id="xp-gold" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#fff6c4" />
          <stop offset="0.45" stopColor="#f5c542" />
          <stop offset="1" stopColor="#a87a10" />
        </linearGradient>
        <linearGradient id="xp-green" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#c6f7b0" />
          <stop offset="0.45" stopColor="#4fb63a" />
          <stop offset="1" stopColor="#1d6b14" />
        </linearGradient>
        <linearGradient id="xp-folder" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="0.45" stopColor="#f5c33c" />
          <stop offset="1" stopColor="#c88a10" />
        </linearGradient>
        <linearGradient id="xp-blue" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#cfe8ff" />
          <stop offset="0.45" stopColor="#3f8ce8" />
          <stop offset="1" stopColor="#11407f" />
        </linearGradient>
        <linearGradient id="xp-violet" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#e6d4ff" />
          <stop offset="0.45" stopColor="#9a63e0" />
          <stop offset="1" stopColor="#4c2286" />
        </linearGradient>
        <linearGradient id="xp-paper" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dcdcd0" />
        </linearGradient>
        <linearGradient id="xp-bin" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#dbe9f7" />
          <stop offset="0.5" stopColor="#8fb0cf" />
          <stop offset="1" stopColor="#4a6a8c" />
        </linearGradient>
        <linearGradient id="xp-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="xp-silver" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9cdd4" />
          <stop offset="1" stopColor="#7d838c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const OUT = { stroke: "#2b2b2b", strokeWidth: 0.9, strokeLinejoin: "round" as const };

/** A CRT monitor on a stand — the base of half the XP icon set. */
function Monitor({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <path d="M15 24h2v2.6h-2z" fill="#8f8a76" {...OUT} />
      <path d="M9.5 27.8c0-.8 1-1.3 2.4-1.3h8.2c1.4 0 2.4.5 2.4 1.3S21.6 29 20.1 29h-8.2c-1.4 0-2.4-.5-2.4-1.2z" fill="url(#xp-case)" {...OUT} />
      <rect x="2.2" y="4" width="27.6" height="20.2" rx="2" fill="url(#xp-case)" {...OUT} />
      <rect x="4.4" y="6.2" width="23.2" height="14.6" rx="1" fill="url(#xp-screen)" stroke="#1d3f66" strokeWidth="0.8" />
      {children}
      <path d="M4.6 6.4h22.8l-6 6.2H4.6z" fill="url(#xp-gloss)" opacity="0.55" />
    </>
  );
}

export const IconTerminalApp = (p: TileProps) => (
  <Svg {...p}>
    <Monitor>
      <path d="M6.4 18.2l4.6-5 3.5 2.8 4.4-6.4 2.6 3.4 3.6-4.2" fill="none" stroke="#0f3f16" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
      <path d="M6.4 18.2l4.6-5 3.5 2.8 4.4-6.4 2.6 3.4 3.6-4.2" fill="none" stroke="#7dff9b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Monitor>
  </Svg>
);

export const IconActivity = (p: TileProps) => (
  <Svg {...p}>
    <Monitor>
      <path d="M5.2 20.4V14h2.6v6.4zM9.4 20.4V9.8H12v10.6zM13.6 20.4v-8.2h2.6v8.2zM17.8 20.4V7.6h2.6v12.8zM22 20.4v-5.6h2.6v5.6z" fill="#8cf57a" stroke="#14521a" strokeWidth="0.6" />
    </Monitor>
  </Svg>
);

export const IconPayouts = (p: TileProps) => (
  <Svg {...p}>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(0 ${-i * 4.6})`}>
        <path d="M4 22.6c0-1.7 4-3.1 9-3.1s9 1.4 9 3.1v3c0 1.7-4 3.1-9 3.1s-9-1.4-9-3.1z" fill="url(#xp-gold)" {...OUT} />
        <ellipse cx="13" cy="22.6" rx="9" ry="3.1" fill="#ffe27a" stroke="#8a6209" strokeWidth="0.8" />
        <ellipse cx="13" cy="22.6" rx="5.6" ry="1.8" fill="none" stroke="#c9970f" strokeWidth="0.7" />
      </g>
    ))}
    <path d="M25 6.5v10m0 0l-3.4-3.6M25 16.5l3.4-3.6" fill="none" stroke="#0e5c1d" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 6.5v10m0 0l-3.4-3.6M25 16.5l3.4-3.6" fill="none" stroke="#5fd94a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconWallet = (p: TileProps) => (
  <Svg {...p}>
    <path d="M3.6 9.4c0-1.2 1-2.2 2.2-2.2h20.4c1.2 0 2.2 1 2.2 2.2v14c0 1.2-1 2.2-2.2 2.2H5.8a2.2 2.2 0 01-2.2-2.2z" fill="url(#xp-violet)" {...OUT} />
    <path d="M3.9 9.5h24.2l-3 6.4H3.9z" fill="url(#xp-gloss)" opacity="0.5" />
    <path d="M19 14.4h9.4v6.4H19a3.2 3.2 0 010-6.4z" fill="url(#xp-silver)" {...OUT} />
    <circle cx="22.4" cy="17.6" r="1.7" fill="#3c2168" stroke="#1d1036" strokeWidth="0.7" />
  </Svg>
);

export const IconCharts = (p: TileProps) => (
  <Svg {...p}>
    <path d="M5.4 2.8h15l6.2 6.2v20.2H5.4z" fill="url(#xp-paper)" {...OUT} />
    <path d="M20.4 2.8L26.6 9h-6.2z" fill="#c9c9bb" {...OUT} />
    <rect x="8.4" y="18" width="3.4" height="7.6" fill="#2a78d6" stroke="#154678" strokeWidth="0.7" />
    <rect x="13.4" y="13.4" width="3.4" height="12.2" fill="#eb6834" stroke="#8c3a17" strokeWidth="0.7" />
    <rect x="18.4" y="15.8" width="3.4" height="9.8" fill="#1baf7a" stroke="#0c6647" strokeWidth="0.7" />
  </Svg>
);

export const IconFolder = (p: TileProps) => (
  <Svg {...p}>
    <path d="M2.6 7.2h9.6l2.6 2.8h14.6v16.4a1.6 1.6 0 01-1.6 1.6H4.2a1.6 1.6 0 01-1.6-1.6z" fill="url(#xp-folder)" {...OUT} />
    <path d="M2.8 12.6h26.4l-2.4 13.4a1.6 1.6 0 01-1.6 1.4H4.2a1.6 1.6 0 01-1.6-1.6z" fill="#ffd968" opacity="0.85" />
    <path d="M3 8h9l2.4 2.6H29" fill="none" stroke="#fff3c4" strokeWidth="0.9" opacity="0.8" />
  </Svg>
);

export const IconNotepad = (p: TileProps) => (
  <Svg {...p}>
    <path d="M6.4 2.6h13.2l6 6v20.8H6.4z" fill="url(#xp-paper)" {...OUT} />
    <path d="M19.6 2.6l6 6h-6z" fill="#c9c9bb" {...OUT} />
    {[13, 16.2, 19.4, 22.6].map((y, i) => (
      <path key={y} d={`M9.4 ${y}h${i === 3 ? 8 : 13}`} stroke="#5f7fa8" strokeWidth="1.2" strokeLinecap="round" />
    ))}
    <path d="M6.6 2.8h12.8v5.8h5.8l-3.4 3.2H6.6z" fill="url(#xp-gloss)" opacity="0.45" />
  </Svg>
);

export const IconGlobe = (p: TileProps) => (
  <Svg {...p}>
    <circle cx="16" cy="16" r="13" fill="url(#xp-blue)" {...OUT} />
    <path d="M3.4 16h25.2M16 3.1c4 4.6 4 21.2 0 25.8-4-4.6-4-21.2 0-25.8z" fill="none" stroke="#dff0ff" strokeWidth="1.1" opacity="0.85" />
    <path d="M5.6 9.6h20.8M5.6 22.4h20.8" fill="none" stroke="#dff0ff" strokeWidth="1" opacity="0.6" />
    <path d="M5 11a13 13 0 0122 0 13 13 0 00-22 0z" fill="url(#xp-gloss)" opacity="0.6" />
  </Svg>
);

export const IconGear = (p: TileProps) => (
  <Svg {...p}>
    <rect x="2.6" y="5" width="26.8" height="22" rx="2" fill="url(#xp-case)" {...OUT} />
    <rect x="5" y="7.4" width="22" height="6" rx="1" fill="#dfe9f5" stroke="#8a95a4" strokeWidth="0.7" />
    <circle cx="9.4" cy="10.4" r="2" fill="#2a78d6" stroke="#154678" strokeWidth="0.7" />
    <rect x="5" y="15.4" width="22" height="3.4" rx="1.7" fill="#c8c4b2" stroke="#8a8676" strokeWidth="0.7" />
    <circle cx="19" cy="17.1" r="2.6" fill="url(#xp-silver)" {...OUT} />
    <rect x="5" y="21" width="22" height="3.4" rx="1.7" fill="#c8c4b2" stroke="#8a8676" strokeWidth="0.7" />
    <circle cx="11.4" cy="22.7" r="2.6" fill="url(#xp-silver)" {...OUT} />
  </Svg>
);

export const IconCmd = (p: TileProps) => (
  <Svg {...p}>
    <rect x="2.6" y="4.6" width="26.8" height="22.8" rx="1.5" fill="#101010" {...OUT} />
    <rect x="2.6" y="4.6" width="26.8" height="4" rx="1.5" fill="url(#xp-blue)" stroke="#11407f" strokeWidth="0.7" />
    <path d="M6.6 14l4 3.4-4 3.4M13 21h7.4" fill="none" stroke="#e8e8e8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconHolders = (p: TileProps) => (
  <Svg {...p}>
    <circle cx="21.4" cy="12" r="4.6" fill="url(#xp-green)" {...OUT} />
    <path d="M13.4 27.4c0-4.4 3.6-7.4 8-7.4s8 3 8 7.4z" fill="url(#xp-green)" {...OUT} />
    <circle cx="11" cy="10.4" r="5.4" fill="url(#xp-blue)" {...OUT} />
    <path d="M2 27.4c0-5 4-8.4 9-8.4s9 3.4 9 8.4z" fill="url(#xp-blue)" {...OUT} />
    <path d="M6.2 6.4a5.4 5.4 0 019.2 1.6 5.4 5.4 0 00-9.2-1.6z" fill="url(#xp-gloss)" opacity="0.7" />
  </Svg>
);

export const IconRecycle = (p: TileProps) => (
  <Svg {...p}>
    <path d="M7.4 9.4h17.2l-1.8 18.2a1.8 1.8 0 01-1.8 1.6h-10a1.8 1.8 0 01-1.8-1.6z" fill="url(#xp-bin)" {...OUT} />
    <ellipse cx="16" cy="9.4" rx="8.6" ry="2.8" fill="#cfe2f4" stroke="#3f5f80" strokeWidth="0.9" />
    <path d="M11.4 13.6l.9 12M16 13.6v12M20.6 13.6l-.9 12" fill="none" stroke="#5d7f9f" strokeWidth="1" opacity="0.75" />
    <path d="M13 4.2h6l1.4 3H11.6z" fill="#9fb8cf" {...OUT} />
    <path d="M8.6 10.6h6.2l-1.4 17.4h-3.2z" fill="url(#xp-gloss)" opacity="0.4" />
  </Svg>
);

export const IconMyComputer = (p: TileProps) => (
  <Svg {...p}>
    <Monitor />
  </Svg>
);

/* ==================================================================== *
 * Line glyphs and chrome marks.
 * ==================================================================== */

type G = SVGProps<SVGSVGElement> & { size?: number };

const glyph = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/** The XP four-pane waving flag. */
export const WindowsFlag = ({ size = 22, ...r }: G) => (
  <svg width={size} height={size * 0.84} viewBox="0 0 26 22" aria-hidden="true" {...r}>
    <path d="M1.6 4.4C4.4 2.2 8 1.2 12 1.6v8.2c-4-.4-7.6.6-10.4 2.8z" fill="#f04a3c" />
    <path d="M13.4 1.8c3.8.6 7.4 2 10.8 3.6v8.2c-3.4-1.6-7-3-10.8-3.6z" fill="#7bc142" />
    <path d="M1.6 13.8c2.8-2.2 6.4-3.2 10.4-2.8v8.2c-4-.4-7.6.6-10.4 2.8z" fill="#3aa0e8" />
    <path d="M13.4 11.2c3.8.6 7.4 2 10.8 3.6v8.2c-3.4-1.6-7-3-10.8-3.6z" fill="#f5c400" />
  </svg>
);

export const IconSearch = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><circle cx="6.8" cy="6.8" r="4.3" /><path d="M10.2 10.2L14 14" strokeWidth="2" /></svg>
);

export const IconWindowsTiles = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="1.8" y="1.8" width="5" height="5" /><rect x="9.2" y="1.8" width="5" height="5" /><rect x="1.8" y="9.2" width="5" height="5" /><rect x="9.2" y="9.2" width="5" height="5" /></svg>
);

export const IconVolume = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M3 6.2h2.2L8.4 3.6v8.8L5.2 9.8H3z" fill="currentColor" /><path d="M10.6 6a2.8 2.8 0 010 4M12.6 4.2a5.4 5.4 0 010 7.6" /></svg>
);

export const IconNetwork = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="1.6" y="4" width="6.2" height="4.6" rx="0.6" fill="currentColor" /><rect x="8.4" y="7.4" width="6" height="4.6" rx="0.6" fill="currentColor" /></svg>
);

export const IconShield = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M8 1.6l5.4 2v4.2c0 3.2-2.2 5.6-5.4 6.6-3.2-1-5.4-3.4-5.4-6.6V3.6z" fill="currentColor" stroke="none" /></svg>
);

export const IconChevronRight = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M6 3.4L10.4 8 6 12.6" /></svg>
);

export const IconChevronDown = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M3.4 6L8 10.4 12.6 6" /></svg>
);

export const IconPower = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M8 2.2v5.4" strokeWidth="2" /><path d="M11.8 4.4a5 5 0 11-7.6 0" strokeWidth="1.8" /></svg>
);

export const IconBack = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M13 8H4M8 3.6L3.4 8 8 12.4" strokeWidth="1.8" /></svg>
);

export const IconRefresh = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M13.4 8a5.4 5.4 0 11-1.7-3.9" /><path d="M13.6 2.2v3.2h-3.2" /></svg>
);

export const IconCopy = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="5.4" y="5.4" width="8.2" height="8.2" rx="0.6" /><path d="M10.6 5.4V3.8a1 1 0 00-1-1H3.6a1 1 0 00-1 1v6a1 1 0 001 1h1.8" /></svg>
);

export const IconCheck = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M3 8.4l3.2 3.2L13 4.8" strokeWidth="2" /></svg>
);

export const IconExternal = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><path d="M9.4 2.4h4.2v4.2M13.4 2.6L7.6 8.4" /><path d="M12.4 9.6v3a1.2 1.2 0 01-1.2 1.2H3.6a1.2 1.2 0 01-1.2-1.2V5a1.2 1.2 0 011.2-1.2h3" /></svg>
);

export const IconLock = ({ size, ...r }: G) => (
  <svg {...glyph(size)} {...r}><rect x="3.4" y="7" width="9.2" height="6.8" rx="0.8" fill="currentColor" stroke="none" /><path d="M5.6 7V5.2a2.4 2.4 0 014.8 0V7" strokeWidth="1.5" /></svg>
);

/* Caption buttons — XP drew these as little glossy squares. */
export const CaptionMin = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M1.6 6.2h5.8v1.6H1.6z" fill="currentColor" /></svg>
);
export const CaptionMax = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
    <path d="M1 1h7.2v7.2H1z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1 1h7.2v2H1z" fill="currentColor" />
  </svg>
);
export const CaptionRestore = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
    <path d="M2.6 3h5.4v5.4H2.6z" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2.6 3h5.4v1.6H2.6z" fill="currentColor" />
    <path d="M1 1h5.4v1.4H2.4V6H1z" fill="currentColor" />
  </svg>
);
export const CaptionClose = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
    <path d="M1.2 0.4l3.3 3.3L7.8.4l1 1-3.3 3.3L8.8 8l-1 1-3.3-3.3L1.2 9l-1-1 3.3-3.3L.2 1.4z" fill="currentColor" />
  </svg>
);
