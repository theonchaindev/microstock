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
      className="absolute left-2 top-2 grid gap-1"
      style={{ gridTemplateColumns: "repeat(auto-fill, 88px)", gridAutoFlow: "column", gridTemplateRows: "repeat(auto-fill, 94px)", maxHeight: "calc(100% - 64px)" }}
    >
      {DESKTOP_APPS.map((a) => {
        const on = sel === a.id;
        return (
          <button
            key={a.id}
            onClick={() => setSel(a.id)}
            onDoubleClick={() => open(a.id)}
            onKeyDown={(e) => e.key === "Enter" && open(a.id)}
            title={`${a.title} — ${a.blurb}`}
            className="flex h-[94px] w-[88px] flex-col items-center justify-start gap-1.5 rounded px-1 pt-2 text-center transition-colors"
            style={{
              background: on ? "rgba(255,255,255,.14)" : "transparent",
              outline: on ? "1px solid rgba(255,255,255,.28)" : "none",
            }}
          >
            <AppIcon id={a.id} size={38} />
            <span
              className="line-clamp-2 text-[11.5px] leading-tight text-white"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,.85)" }}
            >
              {a.short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
