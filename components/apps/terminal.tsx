"use client";

import { useMemo, useState } from "react";
import { AreaChart } from "@/components/ui/charts";
import { AppShell, Badge, Btn, CopyChip, Hero, Panel, Segmented, Stat, Table } from "@/components/ui/kit";
import { IconTerminalApp } from "@/components/os/icons";
import { useRafNow, useSystem } from "@/components/os/system";
import { TOKEN, recentPayouts, series, snapshot, type RangeKey } from "@/lib/market";
import { ago, clockTime, compact, compactUsd, countdown, num, pct, shortAddr, usd } from "@/lib/format";

const RANGES = [
  { value: "1H" as const, label: "1H" },
  { value: "24H" as const, label: "24H" },
  { value: "7D" as const, label: "7D" },
  { value: "30D" as const, label: "30D" },
  { value: "ALL" as const, label: "All" },
];

const axisPrice = (v: number) => `$${v.toFixed(5)}`;

export default function TerminalApp() {
  const now = useRafNow();
  const [range, setRange] = useState<RangeKey>("24H");
  const [view, setView] = useState<"chart" | "table">("chart");
  const { open } = useSystem();

  // Quantise the clock for the series so the path doesn't redraw every frame.
  const bucket = now ? Math.floor(now / 15_000) * 15_000 : null;
  const data = useMemo(() => (bucket ? series(range, bucket) : []), [bucket, range]);
  const snap = useMemo(() => (bucket ? snapshot(bucket) : null), [bucket]);
  const feed = useMemo(() => (bucket ? recentPayouts(bucket, 6) : []), [bucket]);

  if (!now || !snap) return <AppShell><div style={{ color: "var(--text-muted)" }}>Connecting to cluster…</div></AppShell>;

  const fmtTime = (t: number) =>
    range === "1H" || range === "24H"
      ? clockTime(new Date(t))
      : new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <AppShell className="space-y-4">
      {/* identity strip */}
      <div className="flex flex-wrap items-center gap-3">
        <IconTerminalApp size={38} />
        <div className="mr-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-[16px] font-semibold leading-tight">Microstock</h1>
            <Badge tone="accent">${TOKEN.symbol}</Badge>
            <Badge>{TOKEN.chain}</Badge>
          </div>
          <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            1% of every trade is streamed straight to holders · settled every 5 minutes
          </div>
        </div>
        <CopyChip text={TOKEN.mint} display={shortAddr(TOKEN.mint, 6, 6)} />
      </div>

      {/* hero + stats */}
      <div className="grid gap-4 lg:grid-cols-[minmax(280px,1fr)_minmax(320px,1.15fr)]">
        <Panel className="flex flex-col justify-between gap-4">
          <Hero
            label="Total paid out to holders"
            value={usd(snap.totalPaidOut)}
            accent="var(--good)"
            sub={
              <>
                <span className="tabular font-semibold" style={{ color: "var(--text-primary)" }}>
                  {usd(snap.paidOut24h)}
                </span>{" "}
                in the last 24 hours · about{" "}
                <span className="tabular">{usd(snap.payoutRatePerSec * 3600, 0)}</span> an hour
              </>
            }
          />
          <div className="flex flex-wrap items-center gap-2">
            <Btn variant="accent" onClick={() => open("wallet")}>Check my share</Btn>
            <Btn onClick={() => open("payouts")}>View every payout</Btn>
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <Stat label="Price" value={`$${snap.price.toFixed(6)}`} delta={snap.change24h} />
          <Stat label="Market cap" value={compactUsd(snap.marketCap)} hint={`${compact(TOKEN.supply)} supply`} />
          <Stat label="24h volume" value={compactUsd(snap.volume24h)} hint={`${compactUsd(snap.liquidity)} liquidity`} />
          <Stat label="Holders" value={num(snap.holders)} hint="unique wallets earning" />
        </div>
      </div>

      {/* price */}
      <Panel
        title={`${TOKEN.symbol}/USD`}
        hint={
          <span className="tabular" style={{ color: snap.change24h >= 0 ? "var(--good)" : "var(--bad)" }}>
            {pct(snap.change24h)} today
          </span>
        }
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Segmented value={range} onChange={setRange} options={RANGES} />
          <div className="ml-auto">
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "chart" as const, label: "Chart" },
                { value: "table" as const, label: "Table" },
              ]}
            />
          </div>
        </div>

        {view === "chart" ? (
          <AreaChart
            data={data}
            label={`${TOKEN.symbol} price in US dollars over the selected range`}
            color={snap.change24h >= 0 ? "var(--series-3)" : "var(--series-2)"}
            fmtValue={axisPrice}
            fmtTime={fmtTime}
            height={228}
          />
        ) : (
          <div className="scroll-fluent max-h-[228px] overflow-auto">
            <Table head={["Time", "Price"]}>
              {data
                .slice()
                .reverse()
                .map((d) => (
                  <tr key={d.t} style={{ borderBottom: "1px solid var(--divider)" }}>
                    <td className="px-3 py-1.5" style={{ color: "var(--text-secondary)" }}>
                      {new Date(d.t).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="tabular px-3 py-1.5">${d.v.toFixed(6)}</td>
                  </tr>
                ))}
            </Table>
          </div>
        )}
      </Panel>

      {/* strip of three */}
      <div className="grid gap-3 md:grid-cols-3">
        <Panel title="Next distribution">
          <div className="tabular text-[30px] font-semibold leading-none" style={{ color: "var(--accent)" }}>
            {countdown(snap.nextEpoch - now)}
          </div>
          <div className="mt-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
            Rewards accrue per block and settle on a 5-minute epoch. No claiming window, no lockup.
          </div>
        </Panel>

        <Panel title="Fee split">
          <ul className="space-y-2 text-[12.5px]">
            {[
              ["Holders", "100% of the 1% fee", "var(--good)"],
              ["Team", "0%", "var(--text-muted)"],
              ["Marketing", "0% — funded by treasury", "var(--text-muted)"],
            ].map(([k, v, c]) => (
              <li key={k} className="flex items-center justify-between gap-3">
                <span style={{ color: "var(--text-secondary)" }}>{k}</span>
                <span className="tabular font-medium" style={{ color: c }}>{v}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Latest payouts" hint={<button className="hover:underline" onClick={() => open("payouts")}>Open</button>}>
          <ul className="space-y-1.5">
            {feed.map((p) => (
              <li key={p.id} className="anim-row flex items-center justify-between gap-3 text-[12px]">
                <span className="font-mono" style={{ color: "var(--text-muted)" }}>{shortAddr(p.addr)}</span>
                <span className="tabular font-medium" style={{ color: "var(--good)" }}>+{usd(p.usd)}</span>
                <span className="tabular w-14 text-right" style={{ color: "var(--text-muted)" }}>{ago(now - p.t)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
