"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APPS } from "@/lib/apps";
import { IconClose, IconMax, IconMin, IconRestore } from "./icons";
import { useSystem, type Rect, type Win } from "./system";

export const TASKBAR_H = 48;

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
      // Un-maximise on drag, keeping the grab point under the cursor.
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
      setRect(win.id, { x, y: Math.min(y, vh - TASKBAR_H - 40) });
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
        y: Math.min(Math.max(0, win.y), vh - TASKBAR_H - 44),
      });
    };
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [setRect, win]);

  if (win.minimized) return null;

  const geom = win.maximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${TASKBAR_H}px)` }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <>
      {snapHint !== "none" && <SnapPreview kind={snapHint} />}
      <section
        className="anim-win absolute flex flex-col overflow-hidden"
        style={{
          ...geom,
          zIndex: win.z,
          borderRadius: win.maximized ? 0 : "var(--radius-win)",
          border: `1px solid ${active ? "var(--stroke-strong)" : "var(--stroke)"}`,
          boxShadow: active ? "var(--shadow-window)" : "0 14px 30px rgba(0,0,0,.34)",
          background: "var(--mica)",
          backdropFilter: "blur(48px) saturate(160%)",
          WebkitBackdropFilter: "blur(48px) saturate(160%)",
        }}
        onPointerDown={() => focus(win.id)}
        aria-label={win.title}
      >
        {/* title bar */}
        <header
          className="flex h-8 shrink-0 items-center justify-between pl-3 select-none"
          style={{ touchAction: "none", opacity: active ? 1 : 0.68 }}
          onPointerDown={onTitlePointerDown}
          onPointerMove={onTitlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={() => toggleMax(win.id)}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid h-4 w-4 place-items-center">{icon}</span>
            <span className="truncate text-[12px]" style={{ color: "var(--text-secondary)" }}>
              {win.title}
            </span>
          </div>
          <div data-caption className="flex h-8 items-stretch">
            <CaptionButton label="Minimize" onClick={() => minimize(win.id)}>
              <IconMin />
            </CaptionButton>
            <CaptionButton label={win.maximized ? "Restore" : "Maximize"} onClick={() => toggleMax(win.id)}>
              {win.maximized ? <IconRestore /> : <IconMax />}
            </CaptionButton>
            <CaptionButton label="Close" danger onClick={() => close(win.id)}>
              <IconClose />
            </CaptionButton>
          </div>
        </header>

        {/* body */}
        <div
          className="scroll-fluent min-h-0 flex-1 overflow-auto"
          style={{
            background: "var(--surface-1)",
            borderTop: "1px solid var(--divider)",
          }}
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
      className="grid w-[46px] place-items-center transition-colors"
      style={{ color: "var(--text-secondary)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? "#c42b1c" : "var(--stroke)";
        e.currentTarget.style.color = danger ? "#fff" : "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {children}
    </button>
  );
}

function SnapPreview({ kind }: { kind: Snap }) {
  // Only ever rendered mid-drag, so the browser geometry is available here.
  const box = snapRect(kind, window.innerWidth, window.innerHeight);
  return (
    <div
      className="pointer-events-none absolute rounded-lg transition-all duration-150"
      style={{
        left: box.x + 8,
        top: box.y + 8,
        width: box.w - 16,
        height: box.h - 16,
        zIndex: 5,
        background: "rgba(255,255,255,.10)",
        border: "1px solid rgba(255,255,255,.28)",
        backdropFilter: "blur(6px)",
      }}
    />
  );
}
