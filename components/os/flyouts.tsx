"use client";

import { useMemo } from "react";
import { Sparkline } from "@/components/ui/charts";
import { LiveDot } from "@/components/ui/kit";
import { clockTime, compactUsd, countdown, num, pct, shortAddr, usd } from "@/lib/format";
import { recentPayouts, series, snapshot } from "@/lib/market";
import { AppIcon } from "@/components/apps/registry";
import { useNow, useRafNow, useSystem } from "./system";
import { TASKBAR_H } from "./window";

const HEADLINES = [
  { tag: "Protocol", text: "Epoch distributor has settled every scheduled payout since launch" },
  { tag: "Liquidity", text: "LP tokens burned at launch — the pool cannot be pulled" },
  { tag: "Supply", text: "Mint authority revoked. 1,000,000,000 is final" },
  { tag: "Docs", text: "Read Risk.txt before you size a position" },
];

export function WidgetsPanel({ onClose }: { onClose: () => void }) {
  const now = useRafNow();
  const { open } = useSystem();
  const bucket = now ? Math.floor(now / 5000) * 5000 : null;
  const snap = useMemo(() => (bucket ? snapshot(bucket) : null), [bucket]);
  const spark = useMemo(() => (bucket ? series("24H", bucket, 40) : []), [bucket]);

  return (
    <aside
      className="anim-flyout acrylic absolute left-2 z-[950] w-[min(370px,calc(100vw-16px))] overflow-hidden rounded-lg"
      style={{ bottom: TASKBAR_H + 8, maxHeight: "min(78vh, 760px)", border: "1px solid var(--stroke-strong)", boxShadow: "var(--shadow-flyout)" }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="scroll-fluent max-h-[inherit] space-y-3 overflow-auto p-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
            <LiveDot /> Paid out to holders
          </div>
          <div className="tabular mt-2 text-[30px] font-semibold leading-none" style={{ color: "var(--good)" }}>
            {snap ? usd(snap.totalPaidOut) : "—"}
          </div>
          <div className="mt-2 text-[12px]" style={{ color: "var(--text-secondary)" }}>
            {snap ? `${usd(snap.paidOut24h, 0)} in the last 24 hours` : ""}
          </div>
          <button
            onClick={() => {
              open("payouts");
              onClose();
            }}
            className="mt-3 w-full rounded-md py-2 text-[12.5px] font-medium"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Open Payouts
          </button>
        </div>

        <div className="card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>$MSFT</div>
              <div className="tabular mt-1 text-[20px] font-semibold">{snap ? `$${snap.price.toFixed(6)}` : "—"}</div>
              <div className="tabular text-[12px]" style={{ color: snap && snap.change24h >= 0 ? "var(--good)" : "var(--bad)" }}>
                {snap ? `${pct(snap.change24h)} today` : ""}
              </div>
            </div>
            {spark.length > 0 && (
              <Sparkline data={spark} color={snap && snap.change24h >= 0 ? "var(--series-3)" : "var(--series-2)"} w={120} h={44} />
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-[11.5px]">
            <Mini k="Market cap" v={snap ? compactUsd(snap.marketCap) : "—"} />
            <Mini k="Holders" v={snap ? num(snap.holders) : "—"} />
          </div>
        </div>

        <div className="card p-4">
          <div className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>Next distribution</div>
          <div className="tabular mt-1 text-[26px] font-semibold" style={{ color: "var(--accent)" }}>
            {snap && now ? countdown(snap.nextEpoch - now) : "--:--"}
          </div>
        </div>

        <div className="card p-4">
          <div className="mb-2 text-[12.5px] font-semibold">Headlines</div>
          <ul className="space-y-2.5">
            {HEADLINES.map((h) => (
              <li key={h.text} className="text-[12px]">
                <span className="mr-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase" style={{ background: "var(--surface-3)", color: "var(--accent)" }}>
                  {h.tag}
                </span>
                <span style={{ color: "var(--text-secondary)" }}>{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div style={{ color: "var(--text-muted)" }}>{k}</div>
      <div className="tabular font-medium">{v}</div>
    </div>
  );
}

export function ActionCenter({ onClose }: { onClose: () => void }) {
  const now = useNow(1000);
  const { open } = useSystem();
  const bucket = now ? Math.floor(now / 2000) * 2000 : null;
  const feed = useMemo(() => (bucket ? recentPayouts(bucket, 7) : []), [bucket]);
  const d = useMemo(() => (now ? new Date(now) : null), [now]);

  const days = useMemo(() => {
    if (!d) return [];
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // Monday-first
    const count = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [d]);

  return (
    <aside
      className="anim-flyout acrylic absolute right-2 z-[950] w-[min(370px,calc(100vw-16px))] overflow-hidden rounded-lg"
      style={{ bottom: TASKBAR_H + 8, border: "1px solid var(--stroke-strong)", boxShadow: "var(--shadow-flyout)" }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="scroll-fluent max-h-[min(72vh,640px)] overflow-auto p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[12.5px] font-semibold">Notifications</span>
          <button onClick={onClose} className="text-[11.5px] hover:underline" style={{ color: "var(--text-muted)" }}>
            Clear all
          </button>
        </div>

        <ul className="space-y-2">
          {feed.map((p) => (
            <li key={p.id} className="card anim-row flex items-start gap-3 p-3">
              <AppIcon id="payouts" size={26} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12.5px] font-medium">Payout settled</span>
                  <span className="tabular text-[10.5px]" style={{ color: "var(--text-muted)" }}>{clockTime(new Date(p.t))}</span>
                </div>
                <div className="mt-0.5 text-[11.5px]" style={{ color: "var(--text-secondary)" }}>
                  <span className="tabular font-semibold" style={{ color: "var(--good)" }}>+{usd(p.usd)}</span> to{" "}
                  <span className="font-mono">{shortAddr(p.addr)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            open("payouts");
            onClose();
          }}
          className="mt-2 w-full rounded-md py-2 text-[12px] font-medium transition-colors"
          style={{ background: "var(--surface-2)", border: "1px solid var(--stroke)" }}
        >
          See the full ledger
        </button>

        {d && (
          <div className="card mt-3 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12.5px] font-semibold">
                {d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </span>
              <span className="tabular text-[11.5px]" style={{ color: "var(--text-muted)" }}>{clockTime(d)}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10.5px]">
              {["M", "T", "W", "T", "F", "S", "S"].map((w, i) => (
                <span key={i} style={{ color: "var(--text-muted)" }}>{w}</span>
              ))}
              {days.map((n, i) => {
                const today = n === d.getDate();
                return (
                  <span
                    key={i}
                    className="tabular grid h-6 place-items-center rounded-full text-[11px]"
                    style={{
                      background: today ? "var(--accent)" : "transparent",
                      color: today ? "var(--on-accent)" : n ? "var(--text-secondary)" : "transparent",
                      fontWeight: today ? 600 : 400,
                    }}
                  >
                    {n ?? ""}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
