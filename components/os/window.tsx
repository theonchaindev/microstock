"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APPS } from "@/lib/apps";
import { CaptionClose, CaptionMax, CaptionMin, CaptionRestore } from "./icons";
import { useSystem, type Rect, type Win } from "./system";

export const TASKBAR_H = 30;

type Snap = "none" | "left" | "right" | "max";

function snapRect(kind: Snap, vw: number, vh: number): Rect {
  const h = vh - TASKBAR_H;
  if (kind === "left") return { x: 0, y: 0, w: Math.round(vw / 2), h };
  if (kind === "right") return { x: Math.round(vw / 2), y: 0, w: Math.ceil(vw / 2), h };
  return { x: 0, y: 0, w: vw, h };
}

const HANDLES = [
  ["n", "top-0 left-3 right-3 h-1.5 cursor-ns-resize"],
  ["s", "bottom-0 left-3 right-3 h-1.5 cursor-ns-resize"],
  ["w", "left-0 top-3 bottom-3 w-1.5 cursor-ew-resize"],
  ["e", "right-0 top-3 bottom-3 w-1.5 cursor-ew-resize"],
  ["nw", "left-0 top-0 h-3 w-3 cursor-nwse-resize"],
  ["ne", "right-0 top-0 h-3 w-3 cursor-nesw-resize"],
  ["sw", "left-0 bottom-0 h-3 w-3 cursor-nesw-resize"],
  ["se", "right-0 bottom-0 h-3 w-3 cursor-nwse-resize"],
] as const;

export function WindowFrame({
  win,
  active,
  icon,
  children,
}: {
  win: Win;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const { focus, close, minimize, toggleMax, setRect } = useSystem();
  const meta = APPS[win.appId];
  const [snapHint, setSnapHint] = useState<Snap>("none");
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ dir: string; sx: number; sy: number; start: Rect } | null>(null);

  const vp = () => ({ vw: window.innerWidth, vh: window.innerHeight });

  /* --------------------------------------------------------------- drag */
  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-caption]")) return;
      focus(win.id);
      const { vw } = vp();
      let ox = win.x;
      let oy = win.y;
      if (win.maximized) {
        const r = win.restore ?? { x: 100, y: 80, w: meta.w, h: meta.h };
        const ratio = e.clientX / vw;
        ox = Math.round(e.clientX - r.w * ratio);
        oy = 0;
        setRect(win.id, { ...r, x: ox, y: oy });
        toggleMax(win.id);
      }
      drag.current = { dx: e.clientX - ox, dy: e.clientY - oy };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [focus, meta.w, meta.h, setRect, toggleMax, win],
  );

  const onTitlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current) return;
      const { vw, vh } = vp();
      const x = e.clientX - drag.current.dx;
      const y = Math.max(0, e.clientY - drag.current.dy);
      setRect(win.id, { x, y: Math.min(y, vh - TASKBAR_H - 32) });
      setSnapHint(e.clientY < 8 ? "max" : e.clientX < 8 ? "left" : e.clientX > vw - 8 ? "right" : "none");
    },
    [setRect, win.id],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current) return;
      drag.current = null;
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      if (snapHint !== "none") {
        const { vw, vh } = vp();
        setRect(win.id, { restore: { x: win.x, y: win.y, w: win.w, h: win.h }, ...snapRect(snapHint, vw, vh) } as Partial<Rect>);
        setSnapHint("none");
      }
    },
    [setRect, snapHint, win],
  );

  /* ------------------------------------------------------------- resize */
  const startResize = (dir: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    focus(win.id);
    resize.current = { dir, sx: e.clientX, sy: e.clientY, start: { x: win.x, y: win.y, w: win.w, h: win.h } };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: React.PointerEvent) => {
    const r = resize.current;
    if (!r) return;
    const dx = e.clientX - r.sx;
    const dy = e.clientY - r.sy;
    const minW = meta.minW ?? 380;
    const minH = meta.minH ?? 280;
    const next = { ...r.start };
    if (r.dir.includes("e")) next.w = Math.max(minW, r.start.w + dx);
    if (r.dir.includes("s")) next.h = Math.max(minH, r.start.h + dy);
    if (r.dir.includes("w")) {
      next.w = Math.max(minW, r.start.w - dx);
      next.x = r.start.x + (r.start.w - next.w);
    }
    if (r.dir.includes("n")) {
      next.h = Math.max(minH, r.start.h - dy);
      next.y = r.start.y + (r.start.h - next.h);
    }
    setRect(win.id, next);
  };

  const endResize = (e: React.PointerEvent) => {
    resize.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  /* Keep windows on-screen when the viewport shrinks. */
  useEffect(() => {
    const on = () => {
      const { vw, vh } = vp();
      if (win.maximized) return;
      const w = Math.min(win.w, vw - 16);
      const h = Math.min(win.h, vh - TASKBAR_H - 16);
      setRect(win.id, {
        w,
        h,
        x: Math.min(Math.max(-w + 120, win.x), vw - 120),
        y: Math.min(Math.max(0, win.y), vh - TASKBAR_H - 32),
      });
    };
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [setRect, win]);

  if (win.minimized) return null;

  const geom = win.maximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_H}px)` }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  const radius = win.maximized ? "0" : "var(--radius-title) var(--radius-title) 0 0";

  return (
    <>
      {snapHint !== "none" && <SnapPreview kind={snapHint} />}
      <section
        className="anim-win pointer-events-auto absolute flex flex-col"
        style={{
          ...geom,
          zIndex: win.z,
          borderRadius: radius,
          background: active ? "var(--frame)" : "var(--frame-inactive)",
          padding: win.maximized ? 0 : `0 var(--frame-w) var(--frame-w)`,
          boxShadow: "var(--shadow-win)",
        }}
        onPointerDown={() => focus(win.id)}
        aria-label={win.title}
      >
        {/* ---- title bar ---- */}
        <header
          className="flex shrink-0 items-center gap-1.5 pl-1 pr-1"
          style={{
            height: 28,
            background: active ? "var(--title-active)" : "var(--title-inactive)",
            borderRadius: win.maximized ? 0 : "var(--radius-title) var(--radius-title) 0 0",
            touchAction: "none",
          }}
          onPointerDown={onTitlePointerDown}
          onPointerMove={onTitlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={() => toggleMax(win.id)}
        >
          <span className="grid h-4 w-4 shrink-0 place-items-center">{icon}</span>
          <span
            className="title-text truncate text-[12px]"
            style={{ color: active ? "var(--title-text)" : "var(--title-text-inactive)" }}
          >
            {win.title}
          </span>
          <span className="ml-auto flex items-center gap-[2px]" data-caption>
            <CaptionButton label="Minimize" onClick={() => minimize(win.id)}>
              <CaptionMin />
            </CaptionButton>
            <CaptionButton label={win.maximized ? "Restore" : "Maximize"} onClick={() => toggleMax(win.id)}>
              {win.maximized ? <CaptionRestore /> : <CaptionMax />}
            </CaptionButton>
            <CaptionButton label="Close" danger onClick={() => close(win.id)}>
              <CaptionClose />
            </CaptionButton>
          </span>
        </header>

        {/* ---- body ---- */}
        <div
          className="scroll-xp min-h-0 flex-1 overflow-auto"
          style={{ background: "var(--face)", color: "var(--text)" }}
        >
          {children}
        </div>

        {!win.maximized &&
          HANDLES.map(([dir, cls]) => (
            <div
              key={dir}
              className={`absolute ${cls}`}
              style={{ touchAction: "none" }}
              onPointerDown={startResize(dir)}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
            />
          ))}
      </section>
    </>
  );
}

/** XP caption button: a small glossy square, red for close. */
function CaptionButton({
  children,
  onClick,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`caption-btn ${danger ? "caption-btn--close" : ""}`}
    >
      {children}
    </button>
  );
}

function SnapPreview({ kind }: { kind: Snap }) {
  const box = snapRect(kind, window.innerWidth, window.innerHeight);
  return (
    <div
      className="pointer-events-none absolute transition-all duration-150"
      style={{
        left: box.x + 6,
        top: box.y + 6,
        width: box.w - 12,
        height: box.h - 12,
        zIndex: 5,
        background: "rgba(255,255,255,.22)",
        border: "2px solid rgba(255,255,255,.75)",
      }}
    />
  );
}
