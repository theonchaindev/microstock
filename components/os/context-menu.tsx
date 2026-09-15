"use client";

import { useEffect } from "react";
import { IconChevronRight, IconGear, IconRefresh, IconTerminalApp } from "./icons";
import { useSystem } from "./system";

export type MenuPos = { x: number; y: number };

export function DesktopContextMenu({ pos, onClose }: { pos: MenuPos; onClose: () => void }) {
  const { open, settings, setSettings } = useSystem();

  useEffect(() => {
    const on = () => onClose();
    window.addEventListener("click", on);
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("click", on);
      window.removeEventListener("resize", on);
    };
  }, [onClose]);

  const items = [
    { label: "Open Terminal", icon: <IconTerminalApp size={15} />, run: () => open("terminal") },
    { label: "Refresh", icon: <IconRefresh size={14} />, run: () => location.reload() },
    { sep: true as const },
    {
      label: `Switch to ${settings.theme === "dark" ? "light" : "dark"} mode`,
      run: () => setSettings({ theme: settings.theme === "dark" ? "light" : "dark" }),
    },
    { label: "Next wallpaper", run: () => setSettings({ wallpaper: nextWallpaper(settings.wallpaper) }) },
    { sep: true as const },
    { label: "Personalise", icon: <IconGear size={14} />, run: () => open("settings"), chevron: true },
  ];

  return (
    <div
      className="anim-flyout acrylic absolute z-[960] w-[236px] rounded-lg p-1.5"
      style={{
        left: Math.min(pos.x, typeof window !== "undefined" ? window.innerWidth - 248 : pos.x),
        top: Math.min(pos.y, typeof window !== "undefined" ? window.innerHeight - 280 : pos.y),
        border: "1px solid var(--stroke-strong)",
        boxShadow: "var(--shadow-flyout)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((it, i) =>
        "sep" in it ? (
          <div key={i} className="my-1.5 h-px" style={{ background: "var(--divider)" }} />
        ) : (
          <button
            key={i}
            onClick={() => {
              it.run();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-[12.5px] transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--stroke)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span className="grid w-4 place-items-center" style={{ color: "var(--text-secondary)" }}>{it.icon}</span>
            <span className="flex-1">{it.label}</span>
            {it.chevron && <IconChevronRight size={11} />}
          </button>
        ),
      )}
    </div>
  );
}

function nextWallpaper(cur: string) {
  const order = ["bloom", "aurora", "grid", "ticker"] as const;
  return order[(order.indexOf(cur as (typeof order)[number]) + 1) % order.length];
}
