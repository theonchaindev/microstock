"use client";

import { memo } from "react";
import type { Wallpaper } from "./system";

/**
 * Bliss, recreated.
 *
 * The photograph is Microsoft's, so this is drawn from its composition rather
 * than copied: the dome crests about a fifth in from the left and falls away
 * to the right, the sky runs from a deep blue overhead to near-white at the
 * horizon, cumulus sits high with cirrus streaked below it, and the grass goes
 * yellow-green along the sunlit crest into deep green in the foreground.
 */
function Bliss() {
  // Cumulus: each one a cluster of puffs with a slightly grey underside.
  const cumulus = [
    { x: 250, y: 172, s: 1.15, o: 0.95 },
    { x: 556, y: 120, s: 0.72, o: 0.8 },
    { x: 1006, y: 158, s: 1.0, o: 0.9 },
    { x: 1268, y: 210, s: 0.82, o: 0.78 },
    { x: 1512, y: 132, s: 0.6, o: 0.6 },
    { x: 740, y: 250, s: 0.5, o: 0.5 },
  ];
  const puffs = [
    [-132, 18, 84, 30],
    [-58, -14, 72, 44],
    [16, -4, 80, 38],
    [96, 14, 66, 26],
    [158, 24, 46, 17],
  ] as const;

  // Cirrus: long, thin, almost transparent streaks nearer the horizon.
  const cirrus = [
    { x: 420, y: 356, rx: 300, ry: 9, o: 0.4 },
    { x: 900, y: 332, rx: 380, ry: 7, o: 0.32 },
    { x: 1320, y: 378, rx: 260, ry: 8, o: 0.3 },
    { x: 180, y: 404, rx: 240, ry: 6, o: 0.26 },
    { x: 1080, y: 416, rx: 320, ry: 6, o: 0.22 },
  ];

  const hill = "M0 900V543C118 505 214 476 340 473c176-4 336 28 560 60 214 31 414 50 700 57V900z";

  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="bliss-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1358b8" />
          <stop offset="0.16" stopColor="#2c76cf" />
          <stop offset="0.36" stopColor="#5b9fdf" />
          <stop offset="0.54" stopColor="#8fc2ea" />
          <stop offset="0.68" stopColor="#c2ddf0" />
          <stop offset="0.78" stopColor="#e4eff6" />
        </linearGradient>

        <linearGradient id="bliss-grass" x1="0.15" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#b6dd5e" />
          <stop offset="0.1" stopColor="#8ecb45" />
          <stop offset="0.3" stopColor="#67b332" />
          <stop offset="0.62" stopColor="#469324" />
          <stop offset="0.86" stopColor="#2f741b" />
          <stop offset="1" stopColor="#245e16" />
        </linearGradient>

        {/* the thin band of light sitting right on the crest */}
        <linearGradient id="bliss-crest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8ef8f" stopOpacity="0.85" />
          <stop offset="1" stopColor="#d8ef8f" stopOpacity="0" />
        </linearGradient>

        <filter id="bliss-cumulus" x="-60%" y="-200%" width="220%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="bliss-cirrus" x="-30%" y="-400%" width="160%" height="900%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <radialGradient id="bliss-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c6e879" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#c6e879" stopOpacity="0.16" />
          <stop offset="1" stopColor="#c6e879" stopOpacity="0" />
        </radialGradient>
        <filter id="bliss-crestblur" x="-5%" y="-30%" width="110%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="bliss-edge" x="-5%" y="-10%" width="110%" height="130%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>

        <clipPath id="bliss-hill-clip">
          <path d={hill} />
        </clipPath>
      </defs>

      <rect width="1600" height="900" fill="url(#bliss-sky)" />

      <g filter="url(#bliss-cirrus)">
        {cirrus.map((c, i) => (
          <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="#ffffff" opacity={c.o} />
        ))}
      </g>

      <g filter="url(#bliss-cumulus)">
        {cumulus.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`} opacity={c.o}>
            {/* shaded underside first, then the lit tops over it */}
            <ellipse cx={0} cy={36} rx={188} ry={20} fill="#c3d6e6" opacity="0.85" />
            {puffs.map(([dx, dy, rx, ry], j) => (
              <ellipse key={j} cx={dx} cy={dy} rx={rx} ry={ry} fill="#ffffff" />
            ))}
            <ellipse cx={-40} cy={-26} rx={54} ry={26} fill="#ffffff" />
          </g>
        ))}
      </g>

      <path d={hill} fill="url(#bliss-grass)" filter="url(#bliss-edge)" />

      <g clipPath="url(#bliss-hill-clip)">
        {/* mown bands, fading out toward the crest */}
        {[600, 668, 736, 806, 878].map((y, i) => (
          <ellipse key={y} cx={760 - i * 40} cy={y} rx={1250} ry={17} fill="#1f5d14" opacity={0.05 + i * 0.022} />
        ))}
        {/* sun falling across the left shoulder */}
        <ellipse cx={330} cy={566} rx={620} ry={160} fill="url(#bliss-sun)" />
        {/* the crest highlight itself */}
        <path
          d="M0 543C118 505 214 476 340 473c176-4 336 28 560 60 214 31 414 50 700 57v46c-286-7-486-26-700-57-224-32-384-64-560-60-126 3-222 32-340 70z"
          fill="url(#bliss-crest)"
          filter="url(#bliss-crestblur)"
        />
      </g>
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
