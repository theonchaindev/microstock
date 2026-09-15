"use client";

import { memo } from "react";
import type { Wallpaper } from "./system";

/**
 * Windows-11-style bloom: soft translucent ribbons fanned around a bright
 * core. Deliberately abstract — shapes stay wide and low-opacity so they read
 * as light rather than as petals.
 */
function Bloom() {
  const ribbons = Array.from({ length: 7 }, (_, i) => ({
    rot: (360 / 7) * i + 18,
    rx: 320 + ((i * 5) % 3) * 72,
    ry: 76 + ((i * 3) % 4) * 20,
    op: 0.24 + ((i * 2) % 3) * 0.07,
  }));
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="bloom-sky" cx="50%" cy="46%" r="76%">
          <stop offset="0" stopColor="#123f74" />
          <stop offset="0.5" stopColor="#0a2444" />
          <stop offset="1" stopColor="#040d1c" />
        </radialGradient>
        <linearGradient id="bloom-ribbon" x1="0" y1="0.1" x2="1" y2="0.9">
          <stop offset="0" stopColor="#a86bff" />
          <stop offset="0.42" stopColor="#3aa6ff" />
          <stop offset="1" stopColor="#36efd9" />
        </linearGradient>
        <radialGradient id="bloom-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#eaf7ff" stopOpacity="0.92" />
          <stop offset="0.3" stopColor="#6fc4ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4aa8ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bloom-vignette" cx="50%" cy="48%" r="62%">
          <stop offset="0.45" stopColor="#040d1c" stopOpacity="0" />
          <stop offset="1" stopColor="#030914" stopOpacity="0.9" />
        </radialGradient>
        <filter id="bloom-soft" x="-25%" y="-45%" width="150%" height="190%">
          <feGaussianBlur stdDeviation="17" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill="url(#bloom-sky)" />
      <g transform="translate(810 440)" filter="url(#bloom-soft)">
        {ribbons.map((r, i) => (
          <ellipse
            key={i}
            rx={r.rx}
            ry={r.ry}
            cx={r.rx * 0.5}
            fill="url(#bloom-ribbon)"
            opacity={r.op}
            transform={`rotate(${r.rot})`}
          />
        ))}
      </g>
      <circle cx="810" cy="440" r="250" fill="url(#bloom-core)" />
      {/* vignette keeps the bloom contained instead of hazing the whole screen */}
      <rect width="1600" height="900" fill="url(#bloom-vignette)" />
    </svg>
  );
}

function Aurora() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="au-bg" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#0a0f1e" />
          <stop offset="1" stopColor="#05070f" />
        </linearGradient>
        <linearGradient id="au-1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1fd6a4" stopOpacity="0" />
          <stop offset="0.45" stopColor="#1fd6a4" stopOpacity="0.72" />
          <stop offset="1" stopColor="#3b7bff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="au-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7b4dff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#7b4dff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ff6ba8" stopOpacity="0" />
        </linearGradient>
        <filter id="au-blur" x="-20%" y="-60%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="58" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill="url(#au-bg)" />
      <g filter="url(#au-blur)">
        <path d="M-100 380 C 300 210, 700 470, 1100 280 S 1700 300, 1750 240 L1750 520 C1300 620, 800 420, 300 560 Z" fill="url(#au-1)" />
        <path d="M-100 560 C 380 460, 640 700, 1080 540 S 1650 560, 1750 500 L1750 760 C1200 840, 700 640, -100 800 Z" fill="url(#au-2)" />
      </g>
    </svg>
  );
}

function Grid() {
  return (
    <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 0%, #10243c 0%, #070b12 55%, #04060a 100%)" }}>
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(76,194,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(76,194,255,.10) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(90% 70% at 50% 40%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(90% 70% at 50% 40%, #000 30%, transparent 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(76,194,255,.10), transparent)" }} />
    </div>
  );
}

function Ticker() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(160deg, #0b1220 0%, #060a12 60%, #03050a 100%)" }}>
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="font-mono font-bold leading-none tracking-tighter"
          style={{
            fontSize: "26vw",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(76,194,255,.16)",
          }}
        >
          $MSFT
        </span>
      </div>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 55%, rgba(76,194,255,.16), transparent 70%)" }}
      />
    </div>
  );
}

export const WALLPAPERS: { id: Wallpaper; label: string }[] = [
  { id: "bloom", label: "Bloom" },
  { id: "aurora", label: "Aurora" },
  { id: "grid", label: "Terminal Grid" },
  { id: "ticker", label: "Ticker" },
];

export const WallpaperLayer = memo(function WallpaperLayer({ id }: { id: Wallpaper }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {id === "bloom" && <Bloom />}
      {id === "aurora" && <Aurora />}
      {id === "grid" && <Grid />}
      {id === "ticker" && <Ticker />}
    </div>
  );
});
