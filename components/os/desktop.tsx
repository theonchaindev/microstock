"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REGISTRY } from "@/components/apps/registry";
import { usePersisted } from "@/lib/client-state";
import { BootScreen } from "./boot";
import { DesktopContextMenu, type MenuPos } from "./context-menu";
import { DesktopIcons } from "./desktop-icons";
import { BalloonTip, TrayPanel } from "./flyouts";
import { IconDefs } from "./icons";
import { StartMenu } from "./start";
import { SystemProvider, useSystem } from "./system";
import { Taskbar } from "./taskbar";
import { WallpaperLayer } from "./wallpaper";
import { WindowFrame } from "./window";

type Flyout = "start" | "tray" | null;

function Shell() {
  const { wins, topId, open, settings } = useSystem();
  const [flyout, setFlyout] = useState<Flyout>(null);
  const [menu, setMenu] = useState<MenuPos | null>(null);
  const launched = useRef(false);

  // Land on the Terminal so the desktop is never empty on arrival.
  useEffect(() => {
    if (launched.current) return;
    launched.current = true;
    open("terminal");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFlyout(null);
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = useCallback((f: Exclude<Flyout, null>) => setFlyout((cur) => (cur === f ? null : f)), []);

  return (
    <div
      className="relative h-dvh w-screen overflow-hidden"
      onPointerDown={() => {
        setFlyout(null);
        setMenu(null);
      }}
      onContextMenu={(e) => {
        // Only the desktop background gets the shell menu; windows keep theirs.
        if ((e.target as HTMLElement).closest("[data-window-layer]")) return;
        e.preventDefault();
        setFlyout(null);
        setMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      <IconDefs />
      <WallpaperLayer id={settings.wallpaper} />
      <DesktopIcons />

      {/*
        The layer spans the desktop so windows can sit anywhere, so it must not
        swallow clicks aimed at the icons underneath — each frame opts back in.
      */}
      <div data-window-layer className="pointer-events-none absolute inset-0">
        {wins.map((w) => {
          const { Component, Icon } = REGISTRY[w.appId];
          return (
            <WindowFrame key={w.id} win={w} active={w.id === topId} icon={<Icon size={16} />}>
              <Component payload={w.payload} />
            </WindowFrame>
          );
        })}
      </div>

      {menu && <DesktopContextMenu pos={menu} onClose={() => setMenu(null)} />}
      {flyout === "start" && <StartMenu autoFocus onClose={() => setFlyout(null)} />}
      {flyout === "tray" && <TrayPanel onClose={() => setFlyout(null)} />}
      {flyout === null && <BalloonTip />}

      <Taskbar
        onStart={() => toggle("start")}
        startOpen={flyout === "start"}
        onTray={() => toggle("tray")}
        trayOpen={flyout === "tray"}
      />
    </div>
  );
}

export function Desktop() {
  // Boot once per tab — a reload inside the same session goes straight in.
  const [booted, setBooted] = usePersisted<boolean>("session", "microstock.booted", false);

  return (
    <SystemProvider>
      <Shell />
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
    </SystemProvider>
  );
}
