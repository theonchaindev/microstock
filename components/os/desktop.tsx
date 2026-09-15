"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REGISTRY } from "@/components/apps/registry";
import { BootScreen } from "./boot";
import { DesktopContextMenu, type MenuPos } from "./context-menu";
import { DesktopIcons } from "./desktop-icons";
import { ActionCenter, WidgetsPanel } from "./flyouts";
import { StartMenu } from "./start";
import { SystemProvider, useSystem } from "./system";
import { usePersisted } from "@/lib/client-state";
import { Taskbar } from "./taskbar";
import { WallpaperLayer } from "./wallpaper";
import { WindowFrame } from "./window";

type Flyout = "start" | "search" | "widgets" | "center" | null;

function Shell() {
  const { wins, topId, open, settings } = useSystem();
  const [flyout, setFlyout] = useState<Flyout>(null);
  const [menu, setMenu] = useState<MenuPos | null>(null);
  const booted = useRef(false);

  // Land on the Terminal so the desktop is never empty on arrival.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
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
      <WallpaperLayer id={settings.wallpaper} />
      <DesktopIcons />

      <div data-window-layer className="absolute inset-0">
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

      {(flyout === "start" || flyout === "search") && (
        <StartMenu autoFocus={flyout === "search"} onClose={() => setFlyout(null)} />
      )}
      {flyout === "widgets" && <WidgetsPanel onClose={() => setFlyout(null)} />}
      {flyout === "center" && <ActionCenter onClose={() => setFlyout(null)} />}

      <Taskbar
        onStart={() => toggle("start")}
        startOpen={flyout === "start"}
        onSearch={() => toggle("search")}
        onWidgets={() => toggle("widgets")}
        widgetsOpen={flyout === "widgets"}
        onCenter={() => toggle("center")}
        centerOpen={flyout === "center"}
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
