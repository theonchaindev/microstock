"use client";

import { useEffect, useState } from "react";
import { WindowsLogo } from "./icons";

/** Brief power-on sequence. Shown once per tab, and skippable. */
export function BootScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setLeaving(true), 1500);
    const b = setTimeout(onDone, 1980);
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
      <div className="flex flex-col items-center gap-9">
        <div style={{ color: "#4cc2ff" }}>
          <WindowsLogo size={64} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-6 w-6 rounded-full"
            style={{
              border: "2px solid rgba(255,255,255,.14)",
              borderTopColor: "#4cc2ff",
              animation: "spin .85s linear infinite",
            }}
          />
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,.55)" }}>
            Starting Microstock
          </span>
        </div>
      </div>
    </div>
  );
}
