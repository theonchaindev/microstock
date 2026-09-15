"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { APPS, type AppId } from "@/lib/apps";
import { useClock, useFrameClock, usePersisted } from "@/lib/client-state";

/* ------------------------------------------------------------------ state */

export type Rect = { x: number; y: number; w: number; h: number };

export type Win = Rect & {
  id: string;
  appId: AppId;
  title: string;
  z: number;
  minimized: boolean;
  maximized: boolean;
  restore?: Rect;
  payload?: string;
};

export type Wallpaper = "microstock" | "azul" | "ticker" | "classic";
/** The four schemes XP shipped with. */
export type Theme = "blue" | "olive" | "silver" | "classic";

type Settings = { theme: Theme; wallpaper: Wallpaper };

type State = { wins: Win[]; z: number; seq: number };

export const DEFAULT_SETTINGS: Settings = { theme: "blue", wallpaper: "microstock" };

type Action =
  | { type: "open"; appId: AppId; payload?: string; title?: string }
  | { type: "close"; id: string }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "toggleMax"; id: string; bounds: Rect }
  | { type: "setRect"; id: string; rect: Partial<Rect> }
  | { type: "restore"; id: string };

/** Cascade new windows so they never land exactly on top of each other. */
function placement(app: (typeof APPS)[AppId], count: number, vw: number, vh: number): Rect {
  const maxW = Math.max(320, vw - 48);
  const maxH = Math.max(280, vh - 86);
  const w = Math.min(app.w, maxW);
  const h = Math.min(app.h, maxH);
  const off = (count % 6) * 28;
  return {
    w,
    h,
    x: Math.max(12, Math.round((vw - w) / 2 - 90 + off)),
    y: Math.max(8, Math.round((vh - h - 38) / 2 - 24 + off)),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open": {
      const meta = APPS[action.appId];
      const existing = state.wins.find((w) => w.appId === action.appId && !action.payload);
      if (existing) {
        return {
          ...state,
          z: state.z + 1,
          wins: state.wins.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, z: state.z + 1 } : w,
          ),
        };
      }
      const vw = typeof window === "undefined" ? 1440 : window.innerWidth;
      const vh = typeof window === "undefined" ? 900 : window.innerHeight;
      const rect = placement(meta, state.wins.length, vw, vh);
      const mobile = vw < 760;
      const win: Win = {
        id: `${action.appId}-${state.seq}`,
        appId: action.appId,
        title: action.title ?? meta.title,
        ...rect,
        z: state.z + 1,
        minimized: false,
        maximized: mobile,
        restore: mobile ? rect : undefined,
        payload: action.payload,
      };
      return { ...state, seq: state.seq + 1, z: state.z + 1, wins: [...state.wins, win] };
    }
    case "close":
      return { ...state, wins: state.wins.filter((w) => w.id !== action.id) };
    case "focus":
      return {
        ...state,
        z: state.z + 1,
        wins: state.wins.map((w) => (w.id === action.id ? { ...w, z: state.z + 1, minimized: false } : w)),
      };
    case "minimize":
      return { ...state, wins: state.wins.map((w) => (w.id === action.id ? { ...w, minimized: true } : w)) };
    case "restore":
      return {
        ...state,
        z: state.z + 1,
        wins: state.wins.map((w) => (w.id === action.id ? { ...w, minimized: false, z: state.z + 1 } : w)),
      };
    case "toggleMax":
      return {
        ...state,
        wins: state.wins.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized) {
            const r = w.restore ?? { x: 80, y: 60, w: 900, h: 600 };
            return { ...w, maximized: false, ...r };
          }
          return { ...w, maximized: true, restore: { x: w.x, y: w.y, w: w.w, h: w.h } };
        }),
      };
    case "setRect":
      return {
        ...state,
        wins: state.wins.map((w) => (w.id === action.id ? { ...w, ...action.rect } : w)),
      };
    default:
      return state;
  }
}

/* ---------------------------------------------------------------- context */

type Ctx = {
  wins: Win[];
  settings: Settings;
  open: (appId: AppId, payload?: string, title?: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string) => void;
  setRect: (id: string, rect: Partial<Rect>) => void;
  taskbarClick: (appId: AppId) => void;
  setSettings: (patch: Partial<Settings>) => void;
  topId: string | null;
};

const SystemContext = createContext<Ctx | null>(null);

const STORE_KEY = "microstock.settings.v3";

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { wins: [], z: 10, seq: 1 });
  const [settings, writeSettings] = usePersisted<Settings>("local", STORE_KEY, DEFAULT_SETTINGS);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  const topId = useMemo(() => {
    const vis = state.wins.filter((w) => !w.minimized);
    if (!vis.length) return null;
    return vis.reduce((a, b) => (a.z > b.z ? a : b)).id;
  }, [state.wins]);

  const value = useMemo<Ctx>(
    () => ({
      wins: state.wins,
      settings,
      topId,
      open: (appId, payload, title) => dispatch({ type: "open", appId, payload, title }),
      close: (id) => dispatch({ type: "close", id }),
      focus: (id) => dispatch({ type: "focus", id }),
      minimize: (id) => dispatch({ type: "minimize", id }),
      toggleMax: (id) =>
        dispatch({ type: "toggleMax", id, bounds: { x: 0, y: 0, w: 0, h: 0 } }),
      setRect: (id, rect) => dispatch({ type: "setRect", id, rect }),
      setSettings: (patch) => writeSettings({ ...settings, ...patch }),
      taskbarClick: (appId) => {
        const open = state.wins.filter((w) => w.appId === appId);
        if (!open.length) return dispatch({ type: "open", appId });
        const front = open.reduce((a, b) => (a.z > b.z ? a : b));
        if (!front.minimized && front.id === topId) dispatch({ type: "minimize", id: front.id });
        else dispatch({ type: "focus", id: front.id });
      },
    }),
    [settings, state.wins, topId, writeSettings],
  );

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used inside <SystemProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ hooks */

/** Shared wall clock. Null until the browser takes over, so SSR stays stable. */
export const useNow = useClock;

/** Frame-rate clock, for the counters that need to feel live. */
export const useRafNow = () => useFrameClock();

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (text: string, key = text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked */
    }
  }, []);
  return { copied, copy };
}
