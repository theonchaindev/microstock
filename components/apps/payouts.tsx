"use client";

import { useMemo, useState } from "react";
import { BarChart } from "@/components/ui/charts";
import { AppShell, Badge, Btn, Hero, Panel, Segmented, Stat, Table } from "@/components/ui/kit";
import { useRafNow } from "@/components/os/system";
import { dailyPayouts, paidOutRange, payoutIndexAt, recentPayouts, snapshot, type Payout } from "@/lib/market";
import { ago, compactUsd, countdown, num, shortAddr, usd } from "@/lib/format";

const FILTERS = [
  { value: "all" as const, label: "All" },
  { value: "25" as const, label: "$25+" },
  { value: "200" as const, label: "Whales" },
];

export default function PayoutsApp() {
  const now = useRafNow();
  const [filter, setFilter] = useState<"all" | "25" | "200">("all");
  // Pausing snapshots the feed; resuming drops back to the live one.
  const [frozen, setFrozen] = useState<Payout[] | null>(null);
  const paused = frozen !== null;

  const bucket = now ? Math.floor(now / 1000) * 1000 : null;
  const snap = useMemo(() => (bucket ? snapshot(bucket) : null), [bucket]);
  const days = useMemo(() => (bucket ? dailyPayouts(bucket, 14) : []), [bucket]);
  const live = useMemo(() => (bucket ? recentPayouts(bucket, 60) : []), [bucket]);

  if (!now || !snap) return <AppShell><div style={{ color: "var(--text-faint)" }}>Reading the ledger…</div></AppShell>;

  const rows = (frozen ?? live).filter((p) =>
    filter === "all" ? true : p.usd >= Number(filter),
  );
  const biggest = live.reduce((a, b) => (a.usd > b.usd ? a : b), live[0]);
  const week = paidOutRange(now - 7 * 86_400_000, now);

  return (
    <AppShell className="space-y-2.5">
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <Panel className="flex flex-col" bodyClass="flex flex-1 flex-col justify-between gap-3">
          <Hero
            label="Paid out to holders, all time"
            value={usd(snap.totalPaidOut)}
            sub={
              <>
                Streaming at <span className="tabular font-semibold" style={{ color: "var(--text)" }}>{usd(snap.payoutRatePerSec, 4)}</span> every
                second. Next epoch settles in <span className="tabular font-semibold" style={{ color: "var(--accent)" }}>{countdown(snap.nextEpoch - now)}</span>.
              </>
            }
          />
          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Last 24h" value={usd(snap.paidOut24h, 0)} />
            <MiniStat label="Last 7d" value={compactUsd(week)} />
            <MiniStat label="Per holder avg" value={usd(snap.totalPaidOut / snap.holders, 2)} />
          </div>
        </Panel>

        <Panel title="Daily distributions" hint="last 14 days">
          <BarChart
            data={days}
            label="Total USD distributed to holders each day for the last 14 days"
            color="var(--series-3)"
            fmtValue={(v) => compactUsd(v)}
            fmtTime={(t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            height={196}
          />
        </Panel>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Wallet payouts sent" value={num(payoutIndexAt(now))} hint="individual transfers since launch" />
        <Stat label="Biggest recent payout" value={usd(biggest?.usd ?? 0)} hint={biggest ? shortAddr(biggest.addr, 6, 6) : "—"} />
        <Stat label="Holders earning" value={num(snap.holders)} hint="every wallet, automatically" />
      </div>

      <Panel
        pad={false}
        className="overflow-hidden"
      >
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3" style={{ borderColor: "#e2e0d4" }}>
          <h2 className="mr-auto flex items-center gap-2 text-[11px] font-semibold">
            Live payout feed
            <Badge tone={paused ? "warn" : "good"}>{paused ? "Paused" : "Live"}</Badge>
          </h2>
          <Segmented value={filter} onChange={setFilter} options={FILTERS} />
          <Btn variant="subtle" onClick={() => setFrozen(paused ? null : live)}>
            {paused ? "Resume" : "Pause"}
          </Btn>
        </div>
        <div className="scroll-xp max-h-[320px] overflow-auto">
          <Table head={["Wallet", "Amount", "Tokens", "Settled"]}>
            {rows.map((p) => (
              <tr key={p.id} className="anim-row" style={{ borderBottom: "1px solid #e2e0d4" }}>
                <td className="px-3 py-2 font-mono text-[11px]" style={{ color: "var(--text-dim)" }}>
                  {shortAddr(p.addr, 6, 6)}
                </td>
                <td className="tabular px-3 py-2 font-semibold" style={{ color: "var(--good)" }}>
                  +{usd(p.usd)}
                </td>
                <td className="tabular px-3 py-2" style={{ color: "var(--text-dim)" }}>
                  {num(p.tokens, 0)}
                </td>
                <td className="tabular px-3 py-2" style={{ color: "var(--text-faint)" }}>
                  {ago(now - p.t)}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center" style={{ color: "var(--text-faint)" }}>
                  No payouts match this filter yet.
                </td>
              </tr>
            )}
          </Table>
        </div>
      </Panel>
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[3px] p-2.5" style={{ background: "var(--content-alt)" }}>
      <div className="text-[10px] uppercase" style={{ color: "var(--text-faint)" }}>{label}</div>
      <div className="tabular mt-1 text-[13px] font-semibold">{value}</div>
    </div>
  );
}
