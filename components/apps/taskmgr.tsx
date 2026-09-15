"use client";

import { useMemo, useState } from "react";
import { AreaChart } from "@/components/ui/charts";
import { AppShell, Badge, Panel, Stat, Table } from "@/components/ui/kit";
import { useRafNow } from "@/components/os/system";
import { paidOutRange, snapshot } from "@/lib/market";
import { clockTime, compactUsd, num, usd } from "@/lib/format";

const PROCESSES = [
  { name: "fee-vault.service", desc: "Collects 1% of every trade", base: 12.4, mem: 186, critical: true },
  { name: "epoch-distributor", desc: "Settles holder payouts every 5 min", base: 24.8, mem: 412, critical: true },
  { name: "price-oracle", desc: "Jupiter + Pyth aggregate", base: 6.1, mem: 94 },
  { name: "holder-indexer", desc: "Tracks every wallet's share", base: 9.7, mem: 268 },
  { name: "ledger-api", desc: "Serves the public payout feed", base: 4.3, mem: 142 },
  { name: "desktop-shell.exe", desc: "The window you are reading", base: 3.2, mem: 88 },
  { name: "rugpull.exe", desc: "Not found", base: 0, mem: 0, dead: true },
];

const wobble = (seed: number, t: number) => {
  const x = Math.sin(seed * 12.9898 + Math.floor(t / 1200) * 4.233) * 43758.5453;
  return x - Math.floor(x);
};

export default function TaskManagerApp() {
  const now = useRafNow();
  const [tab, setTab] = useState<"processes" | "performance">("processes");

  const bucket = now ? Math.floor(now / 1200) * 1200 : null;
  const snap = useMemo(() => (bucket ? snapshot(bucket) : null), [bucket]);

  // Payout throughput over the last 60 seconds, one point per second.
  const throughput = useMemo(() => {
    if (!bucket) return [];
    const sec = Math.floor(bucket / 1000) * 1000;
    return Array.from({ length: 61 }, (_, i) => {
      const t = sec - (60 - i) * 1000;
      return { t, v: paidOutRange(t - 1000, t) };
    });
  }, [bucket]);

  if (!now || !snap) return <AppShell><div style={{ color: "var(--text-faint)" }}>Starting Task Manager…</div></AppShell>;

  const rows = PROCESSES.map((p, i) => ({
    ...p,
    cpu: p.dead ? 0 : p.base * (0.72 + wobble(i + 1, now) * 0.6),
    net: p.dead ? 0 : (p.base / 4) * (0.5 + wobble(i + 9, now) * 1.4),
  }));
  const totalCpu = rows.reduce((a, r) => a + r.cpu, 0);

  return (
    <AppShell className="space-y-2.5">
      {/* XP tab strip */}
      <div className="flex items-end gap-[2px] pl-1" style={{ marginBottom: -1 }}>
        {(["processes", "performance"] as const).map((t) => {
          const on = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 pb-1 pt-1.5 text-[11px] capitalize"
              style={{
                background: on ? "var(--content)" : "linear-gradient(180deg,#fbfaf4,#e8e6d9)",
                border: "1px solid #a0a0a0",
                borderBottom: on ? "1px solid var(--content)" : "1px solid #a0a0a0",
                borderRadius: "3px 3px 0 0",
                fontWeight: on ? 700 : 400,
                position: "relative",
                zIndex: on ? 2 : 1,
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {tab === "processes" ? (
        <Panel pad={false} className="overflow-hidden">
          <div className="scroll-xp max-h-[420px] overflow-auto">
            <Table head={["Name", "Status", "CPU", "Memory", "Network"]}>
              {rows.map((r) => (
                <tr key={r.name} style={{ borderBottom: "1px solid #e2e0d4", opacity: r.dead ? 0.45 : 1 }}>
                  <td className="px-3 py-2">
                    <div className="font-mono text-[11px]">{r.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>{r.desc}</div>
                  </td>
                  <td className="px-3 py-2">
                    {r.dead ? <Badge>Terminated</Badge> : r.critical ? <Badge tone="good">Critical</Badge> : <Badge tone="accent">Running</Badge>}
                  </td>
                  <td className="tabular px-3 py-2">
                    <Meter value={r.cpu} max={30} label={`${r.cpu.toFixed(1)}%`} />
                  </td>
                  <td className="tabular px-3 py-2" style={{ color: "var(--text-dim)" }}>{r.mem} MB</td>
                  <td className="tabular px-3 py-2" style={{ color: "var(--text-dim)" }}>{r.net.toFixed(1)} Mbps</td>
                </tr>
              ))}
            </Table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-2 text-[11px]" style={{ borderColor: "#e2e0d4", color: "var(--text-faint)" }}>
            <span className="tabular">{rows.filter((r) => !r.dead).length} processes</span>
            <span className="tabular">CPU {totalCpu.toFixed(1)}% · Memory 1,190 MB</span>
          </div>
        </Panel>
      ) : (
        <>
          <Panel title="Payout throughput" hint="USD distributed per second, last 60s">
            <AreaChart
              data={throughput}
              label="US dollars distributed to holders per second over the last sixty seconds"
              color="var(--series-3)"
              fmtValue={(v) => `$${v.toFixed(2)}`}
              fmtTime={(t) => clockTime(new Date(t))}
              height={200}
            />
          </Panel>
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Uptime" value={`${Math.floor((now - Date.UTC(2026, 4, 12, 15, 0, 0)) / 86_400_000)}d`} hint="since launch" />
            <Stat label="Epoch length" value="5m 00s" hint="fixed cadence" />
            <Stat label="Throughput" value={`${usd(snap.payoutRatePerSec, 3)}/s`} hint="to holders" />
            <Stat label="24h settled" value={compactUsd(snap.paidOut24h)} hint={`${num(snap.holders)} wallets`} />
          </div>
        </>
      )}
    </AppShell>
  );
}

function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ background: "var(--content-alt)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--series-1)" }} />
      </div>
      <span style={{ color: "var(--text-dim)" }}>{label}</span>
    </div>
  );
}
