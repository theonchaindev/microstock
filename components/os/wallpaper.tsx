"use client";

import { memo } from "react";
import type { Wallpaper } from "./system";

/** Bliss: the green hill and the big blue sky. */
function Bliss() {
  // Each cloud is a little cluster of puffs so it reads as cumulus, not fog.
  const clouds = [
    { x: 300, y: 210, s: 1.0, o: 0.92 },
    { x: 700, y: 140, s: 0.7, o: 0.7 },
    { x: 1080, y: 205, s: 1.15, o: 0.85 },
    { x: 1460, y: 150, s: 0.65, o: 0.6 },
    { x: 560, y: 320, s: 0.55, o: 0.45 },
    { x: 1260, y: 345, s: 0.7, o: 0.4 },
  ];
  const puffs = [
    [-120, 16, 92, 34],
    [-40, -10, 74, 46],
    [38, 6, 84, 38],
    [118, 20, 70, 28],
  ] as const;

  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="bliss-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1150b4" />
          <stop offset="0.3" stopColor="#3d84d6" />
          <stop offset="0.55" stopColor="#7fb8e8" />
          <stop offset="0.72" stopColor="#c9e3f6" />
        </linearGradient>
        <linearGradient id="bliss-hill" x1="0.1" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#a5d95c" />
          <stop offset="0.22" stopColor="#74bd3c" />
          <stop offset="0.6" stopColor="#4d9427" />
          <stop offset="1" stopColor="#2c6416" />
        </linearGradient>
        <linearGradient id="bliss-ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bce473" />
          <stop offset="1" stopColor="#7cbb44" />
        </linearGradient>
        <filter id="bliss-cloud" x="-60%" y="-160%" width="220%" height="420%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <filter id="bliss-edge" x="-5%" y="-10%" width="110%" height="130%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill="url(#bliss-sky)" />

      <g filter="url(#bliss-cloud)">
        {clouds.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`} opacity={c.o}>
            {puffs.map(([dx, dy, rx, ry], j) => (
              <ellipse key={j} cx={dx} cy={dy} rx={rx} ry={ry} fill="#ffffff" />
            ))}
            <ellipse cx={-10} cy={34} rx={175} ry={20} fill="#ffffff" opacity="0.7" />
          </g>
        ))}
      </g>

      {/* far ridge, caught by the sun */}
      <path d="M0 900V646c180-86 430-150 720-138 300 12 500 74 880 56v336z" fill="url(#bliss-ridge)" filter="url(#bliss-edge)" />

      {/* the hill itself: crest a third in, falling away to the right */}
      <path
        d="M0 900V690c150-112 360-186 612-184 268 2 456 84 988 56v338z"
        fill="url(#bliss-hill)"
        filter="url(#bliss-edge)"
      />

      {/* soft highlight along the crest */}
      <path
        d="M78 688c142-96 332-156 560-156-224 22-408 78-560 156z"
        fill="#d2f099"
        opacity="0.5"
        filter="url(#bliss-edge)"
      />
    </svg>
  );
}

/** Azul: XP's blue satin abstract. */
function Azul() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="azul-bg" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#0b3d8c" />
          <stop offset="0.55" stopColor="#1563c4" />
          <stop offset="1" stopColor="#062a63" />
        </linearGradient>
        <linearGradient id="azul-band" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#bcdcff" stopOpacity="0.65" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="azul-soft" x="-20%" y="-60%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#azul-bg)" />
      <g filter="url(#azul-soft)">
        <path d="M-100 420C260 250 700 520 1100 330s500-120 700-180v300C1500 560 1050 700 700 640 380 586 140 700-100 760z" fill="url(#azul-band)" />
        <path d="M-100 660C300 560 620 780 1000 690s520-40 700-90v260H-100z" fill="url(#azul-band)" opacity="0.6" />
      </g>
    </svg>
  );
}

/** The flat Windows Classic desktop blue. */
function ClassicBlue() {
  return <div className="absolute inset-0" style={{ background: "#3a6ea5" }} />;
}

/** On-brand: an oversized ticker etched into a dark field. */
function Ticker() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(170deg,#0d2b56 0%,#071a36 60%,#04101f 100%)" }}>
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="font-bold leading-none tracking-tighter"
          style={{
            fontFamily: "var(--font-title)",
            fontSize: "24vw",
            color: "transparent",
            WebkitTextStroke: "2px rgba(140,190,255,.2)",
          }}
        >
          $MSFT
        </span>
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 52%, rgba(90,160,255,.22), transparent 72%)" }} />
    </div>
  );
}

export const WALLPAPERS: { id: Wallpaper; label: string }[] = [
  { id: "bliss", label: "Bliss" },
  { id: "azul", label: "Azul" },
  { id: "ticker", label: "Ticker" },
  { id: "classic", label: "Windows Classic" },
];

export const WallpaperLayer = memo(function WallpaperLayer({ id }: { id: Wallpaper }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {id === "bliss" && <Bliss />}
      {id === "azul" && <Azul />}
      {id === "ticker" && <Ticker />}
      {id === "classic" && <ClassicBlue />}
    </div>
  );
});
