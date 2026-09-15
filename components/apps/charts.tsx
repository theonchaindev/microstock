"use client";

import { useMemo, useState } from "react";
import { AreaChart, BarChart, Donut } from "@/components/ui/charts";
import { AppShell, Panel, Segmented, Stat } from "@/components/ui/kit";
import { useRafNow } from "@/components/os/system";
import { ALLOCATION, TOKEN, series, snapshot, volumeSeries, type RangeKey } from "@/lib/market";
import { clockTime, compact, compactUsd, pct } from "@/lib/format";

const RANGES = [
  { value: "24H" as const, label: "24H" },
  { value: "7D" as const, label: "7D" },
  { value: "30D" as const, label: "30D" },
  { value: "ALL" as const, label: "All" },
];

const SLOT_COLOR = ["var(--series-other)", "var(--series-1)", "var(--series-2)", "var(--series-3)"];

export default function ChartsApp() {
  const now = useRafNow();
  const [range, setRange] = useState<RangeKey>("7D");
  const bucket = now ? Math.floor(now / 15_000) * 15_000 : null;

  const price = useMemo(() => (bucket ? series(range, bucket, 110) : []), [bucket, range]);
  const vol = useMemo(() => (bucket ? volumeSeries(range, bucket, 44) : []), [bucket, range]);
  const snap = useMemo(() => (bucket ? snapshot(bucket) : null), [bucket]);

  if (!snap) return <AppShell><div style={{ color: "var(--text-muted)" }}>Loading charts…</div></AppShell>;

  const fmtTime = (t: number) =>
    range === "24H" ? clockTime(new Date(t)) : new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <AppShell className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-[15px] font-semibold">${TOKEN.symbol} market</h1>
        <Segmented value={range} onChange={setRange} options={RANGES} />
      </div>

      <Panel
        title="Price"
        hint={
          <span className="tabular" style={{ color: snap.change24h >= 0 ? "var(--good)" : "var(--bad)" }}>
            ${snap.price.toFixed(6)} · {pct(snap.change24h)}
          </span>
        }
      >
        <AreaChart
          data={price}
          label={`${TOKEN.symbol} price in US dollars`}
          color="var(--series-1)"
          fmtValue={(v) => `$${v.toFixed(5)}`}
          fmtTime={fmtTime}
          height={230}
        />
      </Panel>

      <Panel title="Volume" hint="per bucket, USD">
        <BarChart
          data={vol}
          label="Trading volume in US dollars per time bucket"
          color="var(--series-2)"
          fmtValue={(v) => compactUsd(v)}
          fmtTime={fmtTime}
          height={170}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Panel title="Supply breakdown" hint={`${compact(TOKEN.supply)} total`}>
          <Donut
            centerValue={compact(TOKEN.supply)}
            centerLabel={`$${TOKEN.symbol}`}
            slices={ALLOCATION.map((a) => ({ label: a.label, value: a.value, color: SLOT_COLOR[a.slot] }))}
          />
        </Panel>
        <div className="grid grid-cols-2 gap-3 self-start">
          <Stat label="Market cap" value={compactUsd(snap.marketCap)} />
          <Stat label="Liquidity" value={compactUsd(snap.liquidity)} hint="LP burned" />
          <Stat label="Volume / cap" value={`${((snap.volume24h / snap.marketCap) * 100).toFixed(1)}%`} hint="24h turnover" />
          <Stat label="Fees → holders" value={`${TOKEN.feeBps / 100}%`} hint="of every trade" />
        </div>
      </div>
    </AppShell>
  );
}
