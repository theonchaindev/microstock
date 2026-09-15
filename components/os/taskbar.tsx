"use client";

import { useMemo } from "react";
import { APPS, PINNED_APPS, type AppId } from "@/lib/apps";
import { AppIcon } from "@/components/apps/registry";
import { clockDate, clockTime, pct } from "@/lib/format";
import { snapshot } from "@/lib/market";
import {
  IconBattery,
  IconBell,
  IconChevronUp,
  IconSearch,
  IconTaskView,
  IconVolume,
  IconWidgets,
  IconWifi,
  WindowsLogo,
} from "./icons";
import { useNow, useSystem } from "./system";
import { TASKBAR_H } from "./window";

export function Taskbar({
  onStart,
  startOpen,
  onWidgets,
  widgetsOpen,
  onCenter,
  centerOpen,
  onSearch,
}: {
  onStart: () => void;
  startOpen: boolean;
  onWidgets: () => void;
  widgetsOpen: boolean;
  onCenter: () => void;
  centerOpen: boolean;
  onSearch: () => void;
}) {
  const { wins, taskbarClick, topId } = useSystem();
  const now = useNow(1000);
  const snap = useMemo(() => (now ? snapshot(Math.floor(now / 5000) * 5000) : null), [now]);

  // Pinned apps first, then anything else that's open.
  const running = Array.from(new Set(wins.map((w) => w.appId)));
  const bar: AppId[] = [...PINNED_APPS.map((a) => a.id), ...running.filter((id) => !PINNED_APPS.some((p) => p.id === id))];

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[900] flex items-center px-2"
      style={{
        height: TASKBAR_H,
        background: "var(--taskbar)",
        backdropFilter: "blur(42px) saturate(160%)",
        WebkitBackdropFilter: "blur(42px) saturate(160%)",
        borderTop: "1px solid var(--stroke)",
      }}
    >
      {/* left: the ticker sits where Windows puts the weather */}
      <button
        onClick={onWidgets}
        className="hidden items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors sm:flex"
        style={{ background: widgetsOpen ? "var(--stroke)" : "transparent" }}
        aria-label="Open widgets"
      >
        <span className="grid h-7 w-7 place-items-center rounded-md" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
          <span className="text-[11px] font-bold">M</span>
        </span>
        <span className="text-left leading-tight">
          <span className="tabular block text-[12px] font-semibold">{snap ? `$${snap.price.toFixed(6)}` : "—"}</span>
          <span className="tabular block text-[10.5px]" style={{ color: snap && snap.change24h >= 0 ? "var(--good)" : "var(--bad)" }}>
            {snap ? pct(snap.change24h, 1) : ""} MSFT
          </span>
        </span>
      </button>

      {/* centre cluster — trimmed down to fit a phone */}
      <div className="absolute left-1/2 flex max-w-[calc(100vw-140px)] -translate-x-1/2 items-center gap-1 overflow-hidden">
        <TaskButton label="Start" active={startOpen} onClick={onStart}>
          <WindowsLogo size={19} style={{ color: "var(--accent)" }} />
        </TaskButton>
        <TaskButton label="Search" onClick={onSearch}>
          <IconSearch size={17} />
        </TaskButton>
        <TaskButton label="Widgets" active={widgetsOpen} onClick={onWidgets} className="sm:hidden">
          <IconWidgets size={16} />
        </TaskButton>
        <TaskButton label="Task view" onClick={onStart} className="hidden sm:grid">
          <IconTaskView size={17} />
        </TaskButton>

        <span className="mx-1 hidden h-6 w-px sm:block" style={{ background: "var(--stroke)" }} />

        {bar.map((id) => {
          const open = wins.filter((w) => w.appId === id);
          const active = open.some((w) => w.id === topId);
          return (
            <button
              key={id}
              onClick={() => taskbarClick(id)}
              title={APPS[id].title}
              aria-label={APPS[id].title}
              // On small screens only what's actually running stays pinned.
              className={`relative h-10 w-10 place-items-center rounded-md transition-colors ${open.length ? "grid" : "hidden sm:grid"}`}
              style={{ background: active ? "var(--stroke)" : "transparent" }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.background = "var(--divider)")}
              onMouseLeave={(e) => !active && (e.currentTarget.style.background = "transparent")}
            >
              <AppIcon id={id} size={24} />
              {open.length > 0 && (
                <span
                  className="absolute bottom-0.5 h-[3px] rounded-full transition-all"
                  style={{ width: active ? 16 : 6, background: "var(--accent)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* right: system tray */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onCenter}
          className="hidden items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors md:flex"
          style={{ background: centerOpen ? "var(--stroke)" : "transparent", color: "var(--text-secondary)" }}
          aria-label="Network, sound and battery"
        >
          <IconChevronUp size={13} />
          <IconWifi size={15} />
          <IconVolume size={15} />
          <IconBattery size={15} />
        </button>
        <button
          onClick={onCenter}
          className="rounded-md px-2.5 py-1 text-right transition-colors"
          style={{ background: centerOpen ? "var(--stroke)" : "transparent" }}
          aria-label="Notifications and calendar"
        >
          <span className="tabular block text-[12px] leading-tight">{now ? clockTime(new Date(now)) : "--:--"}</span>
          <span className="tabular hidden text-[11px] leading-tight sm:block" style={{ color: "var(--text-secondary)" }}>
            {now ? clockDate(new Date(now)) : ""}
          </span>
        </button>
        <span className="hidden h-9 w-7 place-items-center sm:grid" style={{ color: "var(--text-secondary)" }}>
          <IconBell size={14} />
        </span>
      </div>
    </div>
  );
}

function TaskButton({
  children,
  onClick,
  label,
  active,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-md transition-colors ${className}`}
      style={{ background: active ? "var(--stroke)" : "transparent", color: "var(--text-primary)" }}
      onMouseEnter={(e) => !active && (e.currentTarget.style.background = "var(--divider)")}
      onMouseLeave={(e) => !active && (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}
