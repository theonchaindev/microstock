/**
 * Deterministic market simulation for $MSFT.
 *
 * Everything here is a pure function of wall-clock time, so the terminal, the
 * payout feed and the taskbar tray all agree without a shared server. Swap
 * `snapshot()` / `series()` for real Helius + Jupiter calls and the UI is
 * unchanged — see README "Going live".
 */

export const TOKEN = {
  name: "Microstock",
  symbol: "MSFT",
  chain: "Solana",
  mint: "MSFTvJ8hQ2kp7nDxYc3RgWm5Ludv9AeTs1XbqPr4Zn6K",
  supply: 1_000_000_000,
  feeBps: 100, // 1% of every trade is streamed to holders
  decimals: 6,
  launch: Date.UTC(2026, 4, 12, 15, 0, 0), // 12 May 2026
} as const;

/** Distributions land every 5 minutes. */
export const EPOCH_MS = 5 * 60 * 1000;

/* ---------------------------------------------------------------- rng --- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth value-noise in [-1, 1] — gives the price a believable wobble. */
function noise(x: number, seed: number) {
  const i = Math.floor(x);
  const f = x - i;
  const r = (n: number) => mulberry32(n * 374761393 + seed * 668265263)() * 2 - 1;
  const a = r(i);
  const b = r(i + 1);
  const s = f * f * (3 - 2 * f);
  return a + (b - a) * s;
}

function fbm(x: number, seed: number) {
  return noise(x, seed) * 0.6 + noise(x * 2.3, seed + 7) * 0.26 + noise(x * 5.1, seed + 19) * 0.14;
}

/* -------------------------------------------------------------- price --- */

const BASE_PRICE = 0.00412;

/** Price at an absolute timestamp. Deterministic, continuous, trending up. */
export function priceAt(t: number) {
  const days = (t - TOKEN.launch) / 86_400_000;
  const trend = Math.log1p(Math.max(0, days) / 26) * 0.63; // slow organic growth
  const swing = fbm(days * 1.7, 11) * 0.22 + fbm(days * 9, 23) * 0.07;
  return BASE_PRICE * (1 + trend + swing);
}

export type Point = { t: number; v: number };
export type RangeKey = "1H" | "24H" | "7D" | "30D" | "ALL";

const RANGE_MS: Record<RangeKey, number> = {
  "1H": 3_600_000,
  "24H": 86_400_000,
  "7D": 7 * 86_400_000,
  "30D": 30 * 86_400_000,
  ALL: 0,
};

export function rangeSpan(range: RangeKey, now: number) {
  return RANGE_MS[range] || Math.max(86_400_000, now - TOKEN.launch);
}

/** Price series for a range, quantised so it only redraws when it should. */
export function series(range: RangeKey, now: number, points = 96): Point[] {
  const span = rangeSpan(range, now);
  const step = span / points;
  const end = Math.floor(now / step) * step; // quantise → stable between ticks
  return Array.from({ length: points + 1 }, (_, i) => {
    const t = end - span + i * step;
    return { t, v: priceAt(t) };
  });
}

/** Per-bucket volume for the same window (used by the volume sub-chart). */
export function volumeSeries(range: RangeKey, now: number, points = 96): Point[] {
  const span = rangeSpan(range, now);
  const step = span / points;
  const end = Math.floor(now / step) * step;
  const scale = (step / 3_600_000) * 71_000; // ~$71k/hour — 1% of this is the payout rate
  return Array.from({ length: points }, (_, i) => {
    const t = end - span + i * step;
    const r = mulberry32(Math.floor(t / step) * 2654435761)();
    return { t, v: scale * (0.45 + r * 1.35) };
  });
}

/* ------------------------------------------------------------- payouts --- */

const PAYOUT_RATE_PER_SEC = 0.1974; // USD/sec streamed to holders, long-run average
const PAYOUT_BASE = 986_000;

/**
 * Closed-form integral of a wobbling payout rate.
 *
 * Writing the total as `s + Σ aᵢ·Pᵢ·sin(s/Pᵢ)` means the instantaneous rate is
 * `1 + Σ aᵢ·cos(s/Pᵢ)`, so as long as Σ aᵢ < 1 the total can only ever go up —
 * which is what a cumulative payout counter has to do. The three periods give
 * intraday, hourly and multi-day variation in what each day earns.
 */
const WAVES: [amp: number, periodSec: number, phase: number][] = [
  [0.35, 190_080, 0.7],  // 2.2 days
  [0.3, 21_600, 0],      // 6 hours
  [0.2, 2_820, 1.3],     // 47 minutes
];

/** Total USD distributed to holders since launch — strictly increasing. */
export function totalPaidOut(t: number) {
  const s = Math.max(0, (t - TOKEN.launch) / 1000);
  const wobble = WAVES.reduce((a, [amp, period, phase]) => a + amp * period * Math.sin(s / period + phase), 0);
  return PAYOUT_BASE + PAYOUT_RATE_PER_SEC * (s + wobble);
}

export function paidOutRange(fromT: number, toT: number) {
  return totalPaidOut(toT) - totalPaidOut(fromT);
}

/** Daily payout totals for the last `days` days, oldest first. */
export function dailyPayouts(now: number, days = 14): Point[] {
  const day = 86_400_000;
  const end = Math.floor(now / day) * day;
  return Array.from({ length: days }, (_, i) => {
    const t = end - (days - 1 - i) * day;
    return { t, v: paidOutRange(t, Math.min(now, t + day)) };
  });
}

export function nextEpochAt(now: number) {
  return Math.ceil(now / EPOCH_MS) * EPOCH_MS;
}

/* -------------------------------------------------------------- wallets --- */

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function fakeAddress(seed: number) {
  const r = mulberry32(seed * 2246822519 + 104729);
  let s = "";
  for (let i = 0; i < 44; i++) s += B58[Math.floor(r() * B58.length)];
  return s;
}

export type Payout = { id: string; addr: string; usd: number; tokens: number; t: number };

/**
 * The payout ledger is a deterministic function of time: payout #n lands at a
 * fixed timestamp, so every client sees an identical feed.
 */
const PAYOUT_INTERVAL = 4_200; // one on-chain distribution every ~4.2s

export function payoutIndexAt(t: number) {
  return Math.floor((t - TOKEN.launch) / PAYOUT_INTERVAL);
}

export function payoutAt(index: number): Payout {
  const r = mulberry32(index * 1103515245 + 12345);
  const t = TOKEN.launch + index * PAYOUT_INTERVAL;
  const roll = r();
  // Long tail: most payouts are small, a few whales land big ones.
  const usd = roll > 0.985 ? 220 + r() * 2400 : roll > 0.88 ? 28 + r() * 180 : 0.9 + r() * 26;
  const p = priceAt(t);
  return {
    id: `px-${index}`,
    addr: fakeAddress(Math.floor(r() * 90_000) + 1),
    usd,
    tokens: usd / p,
    t,
  };
}

/** The `count` most recent payouts at time `now`, newest first. */
export function recentPayouts(now: number, count = 40): Payout[] {
  const head = payoutIndexAt(now);
  return Array.from({ length: count }, (_, i) => payoutAt(head - i)).filter((p) => p.t <= now);
}

/* ------------------------------------------------------------- holders --- */

export function holderCount(t: number) {
  const days = Math.max(0, (t - TOKEN.launch) / 86_400_000);
  return Math.round(4200 + days * 108 + fbm(days / 3, 41) * 400);
}

export type Holder = { rank: number; addr: string; tokens: number; earned: number; label?: string };

const LABELS: Record<number, string> = {
  1: "Treasury · locked",
  2: "Liquidity pool",
  3: "Rewards vault",
};

export function topHolders(now: number, count = 12): Holder[] {
  const total = totalPaidOut(now);
  return Array.from({ length: count }, (_, i) => {
    const rank = i + 1;
    const r = mulberry32(rank * 97 + 13);
    // Zipf-ish distribution of supply across the top holders.
    const share = (0.062 / Math.pow(rank, 0.78)) * (0.85 + r() * 0.3);
    return {
      rank,
      addr: fakeAddress(rank * 31 + 5),
      tokens: TOKEN.supply * share,
      earned: total * share * 0.72,
      label: LABELS[rank],
    };
  });
}

/* ------------------------------------------------------------ snapshot --- */

export type Snapshot = ReturnType<typeof snapshot>;

export function snapshot(now: number) {
  const p = priceAt(now);
  const p24 = priceAt(now - 86_400_000);
  const vol24 = volumeSeries("24H", now, 24).reduce((a, b) => a + b.v, 0);
  const paid = totalPaidOut(now);
  return {
    now,
    price: p,
    change24h: ((p - p24) / p24) * 100,
    marketCap: p * TOKEN.supply,
    volume24h: vol24,
    liquidity: p * TOKEN.supply * 0.083,
    holders: holderCount(now),
    totalPaidOut: paid,
    paidOut24h: paidOutRange(now - 86_400_000, now),
    payoutRatePerSec: PAYOUT_RATE_PER_SEC,
    nextEpoch: nextEpochAt(now),
    solPrice: 214.6 + fbm(now / 7_200_000, 91) * 9,
  };
}

/** Treasury / supply split — 3 named slices + "Other" (palette is 3-safe). */
export const ALLOCATION = [
  { label: "Circulating", value: 74, slot: 1 },
  { label: "Rewards vault", value: 12, slot: 2 },
  { label: "Liquidity (burned LP)", value: 9, slot: 3 },
  { label: "Other", value: 5, slot: 0 },
] as const;
