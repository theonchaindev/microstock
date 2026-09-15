import type { SVGProps } from "react";

/* ==================================================================== *
 * Icons drawn in the Windows XP idiom.
 *
 * These are original recreations — Microsoft's icon files are theirs, so
 * everything here is hand-drawn to match the Luna language instead:
 * three-quarter perspective, thick soft outlines in a darker shade of the
 * fill (never black), a specular gloss up and to the left, saturated
 * gradients, and a soft drop shadow down and to the right.
 *
 * Authored at 48x48 because the silhouette is what survives at 16px.
 * ==================================================================== */

type TileProps = { size?: number; className?: string };

const Svg = ({ size = 32, className, children }: TileProps & { children: React.ReactNode }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
    <g filter="url(#xp-shadow)">{children}</g>
  </svg>
);

/** Gradients and the shared drop shadow, mounted once per document. */
export function IconDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <filter id="xp-shadow" x="-25%" y="-25%" width="160%" height="160%">
          <feDropShadow dx="0.9" dy="1.4" stdDeviation="0.9" floodColor="#1c2430" floodOpacity="0.45" />
        </filter>

        {/* CRT case: warm silver, lit from the top-left */}
        <linearGradient id="g-case" x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#fbfbf7" />
          <stop offset="0.35" stopColor="#dedbcb" />
          <stop offset="0.75" stopColor="#b9b5a2" />
          <stop offset="1" stopColor="#94907d" />
        </linearGradient>
        <linearGradient id="g-case-side" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#a9a593" />
          <stop offset="1" stopColor="#817d6c" />
        </linearGradient>
        {/* Phosphor blue screen */}
        <linearGradient id="g-screen" x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#8fd4ff" />
          <stop offset="0.4" stopColor="#2f8fe0" />
          <stop offset="1" stopColor="#134a8c" />
        </linearGradient>

        {/* XP manila folder */}
        <linearGradient id="g-folder-back" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#ffe9a4" />
          <stop offset="1" stopColor="#e8a92a" />
        </linearGradient>
        <linearGradient id="g-folder-front" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0" stopColor="#ffdf8a" />
          <stop offset="0.45" stopColor="#fbc340" />
          <stop offset="1" stopColor="#d88f12" />
        </linearGradient>

        {/* Paper */}
        <linearGradient id="g-paper" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f4f4ee" />
          <stop offset="1" stopColor="#dcdccf" />
        </linearGradient>

        {/* Translucent bin plastic */}
        <linearGradient id="g-bin" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#e6f1fb" />
          <stop offset="0.28" stopColor="#a9c6e0" />
          <stop offset="0.62" stopColor="#7ea3c4" />
          <stop offset="1" stopColor="#5b7fa2" />
        </linearGradient>

        {/* Globe */}
        <radialGradient id="g-globe" cx="0.34" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#bfe6ff" />
          <stop offset="0.38" stopColor="#3d9ae8" />
          <stop offset="0.85" stopColor="#14539c" />
          <stop offset="1" stopColor="#0c3a72" />
        </radialGradient>

        {/* Gold */}
        <linearGradient id="g-gold" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#fff6c0" />
          <stop offset="0.35" stopColor="#f6cc48" />
          <stop offset="1" stopColor="#a87a10" />
        </linearGradient>
        <linearGradient id="g-gold-face" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.5" stopColor="#f3c73f" />
          <stop offset="1" stopColor="#c8990f" />
        </linearGradient>

        {/* Leather */}
        <linearGradient id="g-leather" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#b184e8" />
          <stop offset="0.4" stopColor="#7c47c9" />
          <stop offset="1" stopColor="#442272" />
        </linearGradient>

        {/* People */}
        <linearGradient id="g-shirt-blue" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#9ed2fb" />
          <stop offset="0.45" stopColor="#3f92e2" />
          <stop offset="1" stopColor="#17568f" />
        </linearGradient>
        <linearGradient id="g-shirt-green" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#c5ee9a" />
          <stop offset="0.45" stopColor="#68b83e" />
          <stop offset="1" stopColor="#2c6a18" />
        </linearGradient>
        <linearGradient id="g-skin" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffe2bd" />
          <stop offset="1" stopColor="#d8a066" />
        </linearGradient>

        {/* Bevelled metal for the Control Panel sliders */}
        <linearGradient id="g-steel" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#ccd2d9" />
          <stop offset="1" stopColor="#7d858f" />
        </linearGradient>

        {/* The gloss sweep every XP icon carries */}
        <linearGradient id="g-gloss" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* --------------------------------------------------------------- shapes */

/**
 * The CRT that fronts My Computer, the Terminal and Task Manager: case in
 * three-quarter view with a visible right cheek, screen inset and glossed.
 */
function Crt({ screen }: { screen?: React.ReactNode }) {
  return (
    <>
      {/* stand */}
      <path d="M20.5 33.5h7l1.2 5h-9.4z" fill="url(#g-case-side)" stroke="#6f6b5b" strokeWidth="0.8" strokeLinejoin="round" />
      <ellipse cx="24" cy="40.2" rx="10.5" ry="3.1" fill="url(#g-case)" stroke="#6f6b5b" strokeWidth="0.8" />
      {/* case: front face plus the right cheek */}
      <path d="M38.5 8.5l4.4 2.6v20.2l-4.4 2.6z" fill="url(#g-case-side)" stroke="#6f6b5b" strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="4.6" y="8.5" width="34" height="25.4" rx="2.6" fill="url(#g-case)" stroke="#6f6b5b" strokeWidth="0.9" />
      {/* screen */}
      <rect x="7.6" y="11.2" width="26.4" height="17.6" rx="1.6" fill="url(#g-screen)" stroke="#123f72" strokeWidth="0.9" />
      {screen}
      <path d="M7.9 11.5h25.8L20.4 24.6H7.9z" fill="url(#g-gloss)" opacity="0.5" />
      {/* power LED */}
      <circle cx="35.6" cy="31" r="1.05" fill="#7ee36a" stroke="#2f6b22" strokeWidth="0.5" />
      <path d="M5.6 9.4h32v3.2c-10-1.4-22-1.4-32 0z" fill="#ffffff" opacity="0.4" />
    </>
  );
}

export const IconMyComputer = (p: TileProps) => (
  <Svg {...p}>
    <Crt />
  </Svg>
);

export const IconTerminalApp = (p: TileProps) => (
  <Svg {...p}>
    <Crt
      screen={
        <>
          <path d="M10.4 25.4l5.6-6.4 4.2 3.4 5.4-8 3.2 4.2 3.4-4" fill="none" stroke="#0b3a14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          <path d="M10.4 25.4l5.6-6.4 4.2 3.4 5.4-8 3.2 4.2 3.4-4" fill="none" stroke="#8dff9f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </>
      }
    />
  </Svg>
);

export const IconActivity = (p: TileProps) => (
  <Svg {...p}>
    <Crt
      screen={
        <>
          {[
            [9.6, 22.4],
            [13.2, 17.6],
            [16.8, 20.2],
            [20.4, 14.6],
            [24, 19],
            [27.6, 16],
            [31.2, 21],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="2.6" height={28.4 - y} fill="#8df57a" stroke="#186024" strokeWidth="0.45" />
          ))}
        </>
      }
    />
  </Svg>
);

export const IconFolder = (p: TileProps) => (
  <Svg {...p}>
    {/* back panel with the tab */}
    <path
      d="M4.5 12.8a1.8 1.8 0 011.8-1.8h11.3l3.4 3.9h21.2a1.5 1.5 0 011.5 1.5v6H4.5z"
      fill="url(#g-folder-back)"
      stroke="#b47c0c"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    {/* front flap, wider at the top so it reads as open */}
    <path
      d="M4.5 19.4h42.2l-4.3 16.8a2 2 0 01-1.9 1.5H8.2a2 2 0 01-2-1.6z"
      fill="url(#g-folder-front)"
      stroke="#b47c0c"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    <path d="M5.6 20.4h39.8l-1 3.8H6.2z" fill="#ffffff" opacity="0.45" />
  </Svg>
);

export const IconNotepad = (p: TileProps) => (
  <Svg {...p}>
    <path d="M10 5.4h18.6L38 14.8v27.8H10z" fill="url(#g-paper)" stroke="#9a9a8a" strokeWidth="0.9" strokeLinejoin="round" />
    {/* folded corner */}
    <path d="M28.6 5.4L38 14.8h-9.4z" fill="#e5e5d8" stroke="#9a9a8a" strokeWidth="0.9" strokeLinejoin="round" />
    {[20, 24.4, 28.8, 33.2].map((y, i) => (
      <path key={y} d={`M14.4 ${y}h${i === 3 ? 12 : 19}`} stroke="#6d8fb8" strokeWidth="1.5" strokeLinecap="round" />
    ))}
    <path d="M10.8 6.2h17.2v8.6H36l-4 4H10.8z" fill="url(#g-gloss)" opacity="0.55" />
  </Svg>
);

export const IconCharts = (p: TileProps) => (
  <Svg {...p}>
    <path d="M8.4 5.4h20.2L38 14.8v27.8H8.4z" fill="url(#g-paper)" stroke="#9a9a8a" strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M28.6 5.4L38 14.8h-9.4z" fill="#e5e5d8" stroke="#9a9a8a" strokeWidth="0.9" strokeLinejoin="round" />
    <rect x="13" y="27" width="5" height="11.2" fill="#2a78d6" stroke="#154678" strokeWidth="0.7" />
    <rect x="20.4" y="20.4" width="5" height="17.8" fill="#eb6834" stroke="#8c3a17" strokeWidth="0.7" />
    <rect x="27.8" y="24" width="5" height="14.2" fill="#1baf7a" stroke="#0c6647" strokeWidth="0.7" />
    <path d="M9 6.2h19.2v8.6H36l-3 3H9z" fill="url(#g-gloss)" opacity="0.5" />
  </Svg>
);

export const IconGlobe = (p: TileProps) => (
  <Svg {...p}>
    <circle cx="24" cy="24" r="18.4" fill="url(#g-globe)" stroke="#0b3566" strokeWidth="1" />
    <g fill="none" stroke="#e2f2ff" strokeWidth="1.1" opacity="0.8">
      <path d="M5.8 24h36.4" />
      <path d="M8.6 14.4h30.8M8.6 33.6h30.8" strokeWidth="0.9" opacity="0.75" />
      <path d="M24 5.6c6.2 6.6 6.2 30.2 0 36.8-6.2-6.6-6.2-30.2 0-36.8z" />
      <path d="M24 5.6c-1.6 6.6-1.6 30.2 0 36.8" strokeWidth="0.8" opacity="0.6" />
    </g>
    {/* landmass hint, then the sphere's gloss */}
    <path d="M14 18.6c3.4-2.4 7-1 9.4 1.2 2.6 2.4 1 5.4-2 5.8-3.6.4-6-1.4-7.4-4z" fill="#8fd77a" opacity="0.55" />
    <path d="M9.4 15.6a18.4 18.4 0 0129.4-2.2A18.4 18.4 0 009.4 15.6z" fill="url(#g-gloss)" opacity="0.75" />
  </Svg>
);

export const IconRecycle = (p: TileProps) => (
  <Svg {...p}>
    {/* tapered translucent bin */}
    <path
      d="M10.4 13.6h27.2l-3.1 26.2a2.4 2.4 0 01-2.4 2.1H15.9a2.4 2.4 0 01-2.4-2.1z"
      fill="url(#g-bin)"
      stroke="#3f6486"
      strokeWidth="1"
      strokeLinejoin="round"
      opacity="0.95"
    />
    {/* vertical ribs */}
    <g stroke="#6d93b5" strokeWidth="1" opacity="0.65">
      <path d="M17.6 18l1.4 20M24 18v20M30.4 18l-1.4 20" />
    </g>
    {/* rim */}
    <ellipse cx="24" cy="13.6" rx="13.6" ry="4.4" fill="#d5e6f5" stroke="#3f6486" strokeWidth="1" />
    <ellipse cx="24" cy="13.6" rx="10.6" ry="2.8" fill="#8fb2d0" opacity="0.6" />
    {/* recycling triangle */}
    <path d="M24 22.6l3.4 5.8h-6.8z" fill="none" stroke="#2f6ea8" strokeWidth="1.5" strokeLinejoin="round" opacity="0.85" />
    <path d="M11.6 14.6h5.6l2.6 26h-4.4z" fill="url(#g-gloss)" opacity="0.5" />
  </Svg>
);

export const IconPayouts = (p: TileProps) => (
  <Svg {...p}>
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(0 ${-i * 6.4})`}>
        <path d="M3.6 35.4c0-2.8 6-5 13.4-5s13.4 2.2 13.4 5v4.6c0 2.8-6 5-13.4 5s-13.4-2.2-13.4-5z" fill="url(#g-gold)" stroke="#8a6209" strokeWidth="0.9" strokeLinejoin="round" />
        <ellipse cx="17" cy="35.4" rx="13.4" ry="5" fill="url(#g-gold-face)" stroke="#8a6209" strokeWidth="0.9" />
        <ellipse cx="17" cy="35.4" rx="8" ry="2.8" fill="none" stroke="#c9970f" strokeWidth="0.8" />
        <path d="M5.4 34c1.8-2.2 6.4-3.6 11.6-3.6-4.8.6-9 2-11.6 3.6z" fill="#ffffff" opacity="0.7" />
      </g>
    ))}
    {/* the green arrow that says "paid out" */}
    <path d="M38 13.6v17m0 0l-5.6-5.8m5.6 5.8l5.6-5.8" fill="none" stroke="#0f5c1e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M38 13.6v17m0 0l-5.6-5.8m5.6 5.8l5.6-5.8" fill="none" stroke="#5fd94a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconWallet = (p: TileProps) => (
  <Svg {...p}>
    <path d="M5.4 14.2a3 3 0 013-3h31.2a3 3 0 013 3v20a3 3 0 01-3 3H8.4a3 3 0 01-3-3z" fill="url(#g-leather)" stroke="#331a57" strokeWidth="1" strokeLinejoin="round" />
    <path d="M6.4 12.6h35.2l-4.4 9.4H6.4z" fill="url(#g-gloss)" opacity="0.45" />
    {/* card pocket */}
    <path d="M27 20.4h15.6v9.2H27a4.6 4.6 0 010-9.2z" fill="url(#g-steel)" stroke="#5c646e" strokeWidth="0.9" strokeLinejoin="round" />
    <circle cx="32.2" cy="25" r="2.5" fill="#3a2168" stroke="#1d1036" strokeWidth="0.8" />
    <circle cx="31.4" cy="24.2" r="0.9" fill="#8f6fd0" opacity="0.8" />
  </Svg>
);

export const IconHolders = (p: TileProps) => (
  <Svg {...p}>
    {/* back figure */}
    <circle cx="31.6" cy="17.4" r="6.2" fill="url(#g-skin)" stroke="#a5733f" strokeWidth="0.9" />
    <path d="M20.4 41.4c0-6.4 5.2-10.8 11.2-10.8s11.2 4.4 11.2 10.8z" fill="url(#g-shirt-green)" stroke="#255c13" strokeWidth="0.9" strokeLinejoin="round" />
    {/* front figure */}
    <circle cx="17.4" cy="15.4" r="7.4" fill="url(#g-skin)" stroke="#a5733f" strokeWidth="0.9" />
    <path d="M3.8 41.4c0-7.6 6.2-12.8 13.6-12.8s13.6 5.2 13.6 12.8z" fill="url(#g-shirt-blue)" stroke="#124c82" strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M11 10.6a7.4 7.4 0 0112.4 2.2A7.4 7.4 0 0011 10.6z" fill="#ffffff" opacity="0.55" />
    <path d="M6.2 40c1-5.4 5.4-9 11.2-9.4-4.6 1.2-8.2 4.6-9.6 9.4z" fill="#ffffff" opacity="0.3" />
  </Svg>
);

export const IconGear = (p: TileProps) => (
  <Svg {...p}>
    {/* a small control panel: chassis, screen, two sliders */}
    <rect x="4.2" y="8.6" width="39.6" height="31" rx="3" fill="url(#g-case)" stroke="#6f6b5b" strokeWidth="1" />
    <rect x="7.6" y="11.8" width="32.8" height="9.4" rx="1.4" fill="url(#g-screen)" stroke="#123f72" strokeWidth="0.9" />
    <path d="M7.9 12.1h32.2L26 21H7.9z" fill="url(#g-gloss)" opacity="0.45" />
    <rect x="7.6" y="24.8" width="32.8" height="4.4" rx="2.2" fill="#b9b5a2" stroke="#7e7a6a" strokeWidth="0.8" />
    <rect x="25.4" y="22.6" width="6.6" height="8.8" rx="1.6" fill="url(#g-steel)" stroke="#5c646e" strokeWidth="0.9" />
    <rect x="7.6" y="32.4" width="32.8" height="4.4" rx="2.2" fill="#b9b5a2" stroke="#7e7a6a" strokeWidth="0.8" />
    <rect x="13" y="30.2" width="6.6" height="8.8" rx="1.6" fill="url(#g-steel)" stroke="#5c646e" strokeWidth="0.9" />
    <path d="M5.4 9.8h37v3c-11.6-1.4-25.4-1.4-37 0z" fill="#ffffff" opacity="0.45" />
  </Svg>
);

export const IconCmd = (p: TileProps) => (
  <Svg {...p}>
    <rect x="4.4" y="8.4" width="39.2" height="31.2" rx="2.2" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1" />
    <path d="M4.4 10.6a2.2 2.2 0 012.2-2.2h34.8a2.2 2.2 0 012.2 2.2v4.2H4.4z" fill="url(#g-screen)" stroke="#123f72" strokeWidth="0.9" />
    <path d="M5.2 9.4h37.6l-3 4.6H5.2z" fill="url(#g-gloss)" opacity="0.4" />
    <path d="M10.6 21.6l6.2 5.2-6.2 5.2M19.8 32h11.6" fill="none" stroke="#f0f0f0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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

/** The four-pane waving flag. */
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

/* Caption button glyphs. */
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
