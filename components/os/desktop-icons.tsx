"use client";

import { useState } from "react";
import { DESKTOP_APPS } from "@/lib/apps";
import { AppIcon } from "@/components/apps/registry";
import { useSystem } from "./system";

export function DesktopIcons() {
  const { open } = useSystem();
  const [sel, setSel] = useState<string | null>(null);

  return (
    <div
      className="absolute left-1 top-1 grid gap-0"
      style={{
        gridTemplateColumns: "repeat(auto-fill, 76px)",
        gridAutoFlow: "column",
        gridTemplateRows: "repeat(auto-fill, 78px)",
        maxHeight: "calc(100% - 46px)",
      }}
    >
      {DESKTOP_APPS.map((a) => {
        const on = sel === a.id;
        return (
          <button
            key={a.id}
            onClick={() => setSel(a.id)}
            onDoubleClick={() => open(a.id)}
            onKeyDown={(e) => e.key === "Enter" && open(a.id)}
            title={`${a.title} - ${a.blurb}`}
            className="flex h-[78px] w-[76px] flex-col items-center gap-1 px-1 pt-1.5 text-center"
          >
            <span
              className="grid h-8 w-8 place-items-center"
              style={{ filter: on ? "drop-shadow(0 0 0 #316ac5) brightness(.82) saturate(1.4)" : "none" }}
            >
              <AppIcon id={a.id} size={32} />
            </span>
            <span
              className="line-clamp-2 px-0.5 text-[11px] leading-[1.2]"
              style={{
                color: "#fff",
                background: on ? "#316ac5" : "transparent",
                textShadow: on ? "none" : "1px 1px 2px rgba(0,0,0,.9)",
                outline: on ? "1px dotted rgba(255,255,255,.7)" : "none",
              }}
            >
              {a.short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
