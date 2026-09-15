"use client";

import { useMemo } from "react";
import { APPS } from "@/lib/apps";
import { AppIcon } from "@/components/apps/registry";
import { clockDate, clockTime, pct } from "@/lib/format";
import { snapshot } from "@/lib/market";
import { IconNetwork, IconShield, IconVolume, WindowsFlag } from "./icons";
import { useNow, useSystem } from "./system";
import { TASKBAR_H } from "./window";

/** The dotted vertical grip XP puts before every taskbar band. */
function Gripper() {
  return (
    <span
      className="mx-1 h-[18px] w-[3px] shrink-0 self-center"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,.55) 50%, transparent 50%), linear-gradient(180deg, rgba(0,0,0,.28) 50%, transparent 50%)",
        backgroundSize: "1px 4px, 1px 4px",
        backgroundPosition: "0 0, 1px 1px",
        backgroundRepeat: "repeat-y",
      }}
    />
  );
}

export function Taskbar({
  onStart,
  startOpen,
  onTray,
  trayOpen,
}: {
  onStart: () => void;
  startOpen: boolean;
  onTray: () => void;
  trayOpen: boolean;
}) {
  const { wins, taskbarClick, topId, open } = useSystem();
  const now = useNow(1000);
  const snap = useMemo(() => (now ? snapshot(Math.floor(now / 5000) * 5000) : null), [now]);

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[900] flex items-stretch"
      style={{
        height: TASKBAR_H,
        background: "var(--taskbar)",
        borderTop: "1px solid var(--taskbar-top)",
        fontFamily: "var(--font-ui)",
      }}
    >
      {/* ---- Start ---- */}
      <button
        onClick={onStart}
        aria-label="Start"
        className="relative flex shrink-0 items-center gap-1.5 pl-2 pr-5"
        style={{
          background: "var(--start)",
          borderRadius: "0 12px 12px 0",
          boxShadow: startOpen
            ? "inset 0 2px 6px rgba(0,0,0,.45)"
            : "inset 0 1px 0 var(--start-hi), 2px 0 5px rgba(0,0,0,.3)",
          marginRight: 2,
        }}
      >
        <WindowsFlag size={20} />
        <span
          className="text-[15px] font-bold italic"
          style={{ fontFamily: "var(--font-title)", color: "#fff", textShadow: "1px 1px 1px rgba(0,0,0,.5)" }}
        >
          start
        </span>
      </button>

      {/* ---- $MSFT desk band ---- */}
      {snap && (
        <>
          <Gripper />
          <button
            onClick={() => open("terminal")}
            title="Microstock Terminal"
            className="hidden shrink-0 items-center gap-2 px-1.5 sm:flex"
            style={{ color: "#fff", textShadow: "1px 1px 1px rgba(0,0,0,.45)" }}
          >
            <span className="tabular text-[11px] font-bold">$MSFT {snap.price.toFixed(6)}</span>
            <span
              className="tabular rounded-sm px-1 text-[10px] font-bold"
              style={{
                background: snap.change24h >= 0 ? "#1f7a2e" : "#a32316",
                border: "1px solid rgba(255,255,255,.45)",
              }}
            >
              {pct(snap.change24h, 1)}
            </span>
          </button>
        </>
      )}

      <Gripper />

      {/* ---- task buttons ---- */}
      <div className="flex min-w-0 flex-1 items-center gap-[3px] overflow-hidden py-[3px]">
        {wins.map((w) => {
          const activeWin = w.id === topId && !w.minimized;
          return (
            <button
              key={w.id}
              onClick={() => taskbarClick(w.appId)}
              title={w.title}
              aria-label={w.title}
              className="flex h-full min-w-0 shrink items-center gap-1.5 px-1.5 sm:basis-[160px]"
              style={{
                background: activeWin ? "var(--taskbtn-active)" : "var(--taskbtn)",
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,.22)",
                boxShadow: activeWin
                  ? "inset 1px 1px 3px rgba(0,0,0,.45)"
                  : "inset 0 1px 0 rgba(255,255,255,.35)",
                color: "#fff",
                textShadow: "1px 1px 1px rgba(0,0,0,.4)",
                maxWidth: 170,
              }}
            >
              <span className="grid h-4 w-4 shrink-0 place-items-center">
                <AppIcon id={w.appId} size={16} />
              </span>
              <span className="hidden truncate text-[11px] sm:block">{APPS[w.appId].short}</span>
            </button>
          );
        })}
      </div>

      {/* ---- system tray ---- */}
      <div
        className="flex shrink-0 items-center gap-1.5 pl-2 pr-2"
        style={{
          background: "var(--tray)",
          borderLeft: "1px solid var(--tray-edge)",
          boxShadow: "inset 1px 0 0 rgba(0,0,0,.25)",
        }}
      >
        <span className="hidden items-center gap-1.5 sm:flex" style={{ color: "#eaf6ff" }}>
          <IconShield size={13} />
          <IconNetwork size={13} />
          <IconVolume size={13} />
        </span>
        <button
          onClick={onTray}
          title={now ? clockDate(new Date(now)) : undefined}
          aria-label="Notifications and date"
          className="tabular px-1 text-[11px]"
          style={{
            color: "#fff",
            textShadow: "1px 1px 1px rgba(0,0,0,.4)",
            background: trayOpen ? "rgba(0,0,0,.18)" : "transparent",
            borderRadius: 2,
          }}
        >
          {now ? clockTime(new Date(now)) : "--:--"}
        </button>
      </div>
    </div>
  );
}
