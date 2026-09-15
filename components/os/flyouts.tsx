"use client";

import { useEffect, useMemo, useState } from "react";
import { clockTime, countdown, num, shortAddr, usd } from "@/lib/format";
import { recentPayouts, snapshot } from "@/lib/market";
import { useNow, useRafNow, useSystem } from "./system";
import { TASKBAR_H } from "./window";

/* ------------------------------------------------------------- tray panel */

/** Clicking the clock opens this — calendar plus a live protocol summary. */
export function TrayPanel({ onClose }: { onClose: () => void }) {
  const now = useNow(1000);
  const { open } = useSystem();
  const bucket = now ? Math.floor(now / 2000) * 2000 : null;
  const snap = useMemo(() => (bucket ? snapshot(bucket) : null), [bucket]);
  const feed = useMemo(() => (bucket ? recentPayouts(bucket, 5) : []), [bucket]);
  const d = useMemo(() => (now ? new Date(now) : null), [now]);

  const days = useMemo(() => {
    if (!d) return [];
    const offset = (new Date(d.getFullYear(), d.getMonth(), 1).getDay() + 6) % 7;
    const count = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [d]);

  if (!d || !snap || !now) return null;

  return (
    <div
      className="anim-menu absolute z-[950] w-[264px] p-2"
      style={{
        right: 2,
        bottom: TASKBAR_H + 2,
        background: "var(--face)",
        border: "1px solid var(--frame)",
        borderRadius: 4,
        boxShadow: "var(--shadow-menu)",
        fontFamily: "var(--font-ui)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sunken mb-2 p-2">
        <div className="mb-1.5 text-center text-[11px] font-bold">
          {d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </div>
        <div className="grid grid-cols-7 gap-[1px] text-center text-[10px]">
          {["M", "T", "W", "T", "F", "S", "S"].map((w, i) => (
            <span key={i} className="font-bold" style={{ color: "var(--pane-head-text)" }}>
              {w}
            </span>
          ))}
          {days.map((n, i) => {
            const today = n === d.getDate();
            return (
              <span
                key={i}
                className="tabular grid h-[17px] place-items-center"
                style={{
                  background: today ? "var(--select)" : "transparent",
                  color: today ? "var(--select-text)" : n ? "var(--text)" : "transparent",
                  fontWeight: today ? 700 : 400,
                }}
              >
                {n ?? ""}
              </span>
            );
          })}
        </div>
        <div className="tabular mt-1.5 text-center text-[11px]">{clockTime(d)}</div>
      </div>

      <div className="group-box p-2">
        <div className="mb-1 text-[11px] font-bold" style={{ color: "var(--pane-head-text)" }}>
          Microstock
        </div>
        <Row k="Paid out, all time" v={usd(snap.totalPaidOut, 0)} />
        <Row k="Holders" v={num(snap.holders)} />
        <Row k="Next epoch" v={countdown(snap.nextEpoch - now)} />
        <div className="mt-1.5 border-t pt-1.5" style={{ borderColor: "#e2e0d4" }}>
          {feed.map((p) => (
            <div key={p.id} className="anim-row flex items-center justify-between gap-2 text-[10.5px]">
              <span className="truncate font-mono" style={{ color: "var(--text-dim)" }}>
                {shortAddr(p.addr)}
              </span>
              <span className="tabular font-bold" style={{ color: "var(--good)" }}>
                +{usd(p.usd)}
              </span>
            </div>
          ))}
        </div>
        <button
          className="xp-btn mt-2 w-full"
          onClick={() => {
            open("payouts");
            onClose();
          }}
        >
          Open Payouts
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[11px] leading-[1.6]">
      <span style={{ color: "var(--text-dim)" }}>{k}</span>
      <span className="tabular font-bold">{v}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- balloon */

/**
 * The XP tray balloon, used to announce settled payouts. Shows a few seconds
 * after arrival and then every half-minute; dismissing it stops it for good.
 */
export function BalloonTip() {
  const now = useRafNow();
  const { open } = useSystem();
  const [muted, setMuted] = useState(false);
  const [shownAt, setShownAt] = useState<number | null>(null);

  useEffect(() => {
    if (muted) return;
    const first = setTimeout(() => setShownAt(Date.now()), 9_000);
    const loop = setInterval(() => setShownAt(Date.now()), 34_000);
    return () => {
      clearTimeout(first);
      clearInterval(loop);
    };
  }, [muted]);

  const visible = !muted && shownAt !== null && now !== null && now - shownAt < 7_000;
  const payout = useMemo(() => (shownAt ? recentPayouts(shownAt, 1)[0] : null), [shownAt]);

  if (!visible || !payout) return null;

  return (
    <div
      className="anim-menu absolute z-[940] w-[262px] p-2.5"
      style={{
        right: 8,
        bottom: TASKBAR_H + 12,
        background: "#ffffe1",
        border: "1px solid #8a8a6a",
        borderRadius: 5,
        boxShadow: "var(--shadow-menu)",
        fontFamily: "var(--font-ui)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* the balloon's little tail, pointing at the tray */}
      <span
        className="absolute h-3 w-3 rotate-45"
        style={{ right: 26, bottom: -7, background: "#ffffe1", borderRight: "1px solid #8a8a6a", borderBottom: "1px solid #8a8a6a" }}
      />
      <button
        onClick={() => setMuted(true)}
        aria-label="Dismiss"
        className="absolute right-1.5 top-1.5 text-[11px] font-bold"
        style={{ color: "#5c5c4a" }}
      >
        ✕
      </button>
      <button className="flex w-full items-start gap-2 text-left" onClick={() => open("payouts")}>
        <span
          className="mt-[1px] grid h-[18px] w-[18px] shrink-0 place-items-center text-[12px] font-bold"
          style={{ background: "linear-gradient(180deg,#63b3f5,#1d63c4)", color: "#fff", borderRadius: "50%", border: "1px solid #12498f" }}
        >
          i
        </span>
        <span>
          <span className="block text-[11px] font-bold">Payout settled</span>
          <span className="block text-[11px]" style={{ color: "#3a3a2c" }}>
            <b style={{ color: "var(--good)" }}>+{usd(payout.usd)}</b> paid to {shortAddr(payout.addr, 5, 5)}. Click to
            see the full ledger.
          </span>
        </span>
      </button>
    </div>
  );
}
