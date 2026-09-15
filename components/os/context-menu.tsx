"use client";

import { useEffect, useState } from "react";
import { IconChevronRight } from "./icons";
import { useSystem, type Wallpaper } from "./system";

export type MenuPos = { x: number; y: number };

const WALLPAPER_ORDER: Wallpaper[] = ["bliss", "azul", "ticker", "classic"];

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
    { label: "Arrange Icons By", disabled: true, chevron: true },
    { label: "Refresh", run: () => location.reload() },
    { sep: true as const },
    { label: "Next Desktop Background", run: () => setSettings({ wallpaper: nextWallpaper(settings.wallpaper) }) },
    { label: "New Command Prompt", run: () => open("cmd") },
    { sep: true as const },
    { label: "Properties", run: () => open("settings"), bold: true },
  ];

  return (
    <div
      className="anim-menu absolute z-[960] w-[212px] py-[2px]"
      style={{
        left: Math.min(pos.x, typeof window !== "undefined" ? window.innerWidth - 224 : pos.x),
        top: Math.min(pos.y, typeof window !== "undefined" ? window.innerHeight - 220 : pos.y),
        background: "var(--face)",
        border: "1px solid var(--face-lo)",
        boxShadow: "var(--shadow-menu)",
        fontFamily: "var(--font-ui)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((it, i) =>
        "sep" in it ? (
          <div key={i} className="my-[3px] ml-7 mr-1 h-px" style={{ background: "var(--face-lo)" }} />
        ) : (
          <MenuItem
            key={i}
            {...it}
            onSelect={() => {
              it.run?.();
              onClose();
            }}
          />
        ),
      )}
    </div>
  );
}

function MenuItem({
  label,
  onSelect,
  disabled,
  chevron,
  bold,
}: {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  chevron?: boolean;
  bold?: boolean;
}) {
  const [hot, setHot] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={onSelect}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      className="flex w-full items-center gap-2 py-[3px] pl-7 pr-2 text-left text-[11px]"
      style={{
        background: hot && !disabled ? "var(--select)" : "transparent",
        color: disabled ? "var(--face-lo)" : hot ? "var(--select-text)" : "var(--text)",
        fontWeight: bold ? 700 : 400,
      }}
    >
      <span className="flex-1">{label}</span>
      {chevron && <IconChevronRight size={9} />}
    </button>
  );
}

function nextWallpaper(cur: Wallpaper) {
  return WALLPAPER_ORDER[(WALLPAPER_ORDER.indexOf(cur) + 1) % WALLPAPER_ORDER.length];
}
