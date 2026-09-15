"use client";

import { useMemo, useState } from "react";
import { AppShell, Badge, Panel, Stat, Table } from "@/components/ui/kit";
import { useRafNow } from "@/components/os/system";
import { TOKEN, snapshot, topHolders } from "@/lib/market";
import { compact, num, shortAddr, usd } from "@/lib/format";

export default function HoldersApp() {
  const now = useRafNow();
  const [q, setQ] = useState("");
  const bucket = now ? Math.floor(now / 5000) * 5000 : null;

  const snap = useMemo(() => (bucket ? snapshot(bucket) : null), [bucket]);
  const rows = useMemo(() => (bucket ? topHolders(bucket, 25) : []), [bucket]);

  if (!snap) return <AppShell><div style={{ color: "var(--text-muted)" }}>Indexing holders…</div></AppShell>;

  const filtered = rows.filter((h) => !q || h.addr.toLowerCase().includes(q.toLowerCase()));
  const top10 = rows.slice(0, 10).reduce((a, h) => a + h.tokens, 0) / TOKEN.supply;

  return (
    <AppShell className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Holders" value={num(snap.holders)} hint="unique wallets" />
        <Stat label="Top 10 concentration" value={`${(top10 * 100).toFixed(1)}%`} hint="treasury + LP included" />
        <Stat label="Median payout, all time" value={usd(snap.totalPaidOut / snap.holders / 3.1)} hint="per wallet" />
      </div>

      <Panel pad={false} className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--divider)" }}>
          <h2 className="mr-auto text-[13px] font-semibold">Leaderboard</h2>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search address…"
            className="w-52 rounded-md px-3 py-1.5 text-[12px] outline-none placeholder:opacity-60"
            style={{ background: "var(--surface-3)", border: "1px solid var(--stroke)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="scroll-fluent max-h-[420px] overflow-auto">
          <Table head={["#", "Wallet", "Balance", "Supply", "Earned"]}>
            {filtered.map((h) => (
              <tr key={h.rank} style={{ borderBottom: "1px solid var(--divider)" }}>
                <td className="tabular px-3 py-2" style={{ color: "var(--text-muted)" }}>{h.rank}</td>
                <td className="px-3 py-2">
                  <span className="font-mono text-[11.5px]" style={{ color: "var(--text-secondary)" }}>{shortAddr(h.addr, 6, 6)}</span>
                  {h.label && <span className="ml-2"><Badge>{h.label}</Badge></span>}
                </td>
                <td className="tabular px-3 py-2">{compact(h.tokens)}</td>
                <td className="tabular px-3 py-2" style={{ color: "var(--text-secondary)" }}>
                  {((h.tokens / TOKEN.supply) * 100).toFixed(2)}%
                </td>
                <td className="tabular px-3 py-2 font-semibold" style={{ color: "var(--good)" }}>{usd(h.earned, 0)}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center" style={{ color: "var(--text-muted)" }}>
                  No wallet in the top 25 matches “{q}”.
                </td>
              </tr>
            )}
          </Table>
        </div>
      </Panel>
    </AppShell>
  );
}
