"use client";

import { useEffect, useState } from "react";
import { WindowsFlag } from "./icons";

/**
 * The XP power-on sequence: black screen, logo, and the three blue blocks
 * chasing across a sunken well. Shown once per tab, and skippable.
 */
export function BootScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setLeaving(true), 1800);
    const b = setTimeout(onDone, 2350);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[2000] grid place-items-center transition-opacity duration-500"
      style={{ background: "#000", opacity: leaving ? 0 : 1 }}
      onClick={onDone}
    >
      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center gap-3">
          <WindowsFlag size={54} />
          <div className="leading-none" style={{ fontFamily: "var(--font-title)" }}>
            <div className="text-[13px] font-bold tracking-wide" style={{ color: "#d8d8d8" }}>
              Microstock
            </div>
            <div className="text-[34px] font-bold" style={{ color: "#fff" }}>
              XP
            </div>
          </div>
        </div>

        <div
          className="relative h-[15px] w-[190px] overflow-hidden"
          style={{ border: "1px solid #4a4a4a", borderRadius: 3, background: "#0a0a0a" }}
        >
          <div
            className="absolute top-[2px] flex h-[9px] gap-[3px]"
            style={{ animation: "xp-boot 2.1s cubic-bezier(.4,0,.6,1) infinite" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-full w-[13px]"
                style={{ background: "linear-gradient(180deg,#8ac8ff,#1d6fd6)", borderRadius: 1 }}
              />
            ))}
          </div>
        </div>

        <span className="text-[11px]" style={{ color: "#8a8a8a" }}>
          Starting Microstock&hellip;
        </span>
      </div>
    </div>
  );
}
