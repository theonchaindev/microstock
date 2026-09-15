"use client";

import { memo } from "react";
import type { Wallpaper } from "./system";

/** The supplied Microstock desktop photograph. */
function Photo() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "url(/microstock-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#4f8f36",
      }}
    />
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
  { id: "microstock", label: "Microstock" },
  { id: "azul", label: "Azul" },
  { id: "ticker", label: "Ticker" },
  { id: "classic", label: "Windows Classic" },
];

export const WallpaperLayer = memo(function WallpaperLayer({ id }: { id: Wallpaper }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {id === "microstock" && <Photo />}
      {id === "azul" && <Azul />}
      {id === "ticker" && <Ticker />}
      {id === "classic" && <ClassicBlue />}
    </div>
  );
});
