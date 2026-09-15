# Microstock

A fully usable Windows 11 desktop in the browser, built as the front end for
**$MSFT (Microstock)** — a Solana token that streams 1% of every trade straight
to holders.

Live: _(set after first deploy)_

## What's in it

The whole site is a desktop. Windows drag, resize from any edge, snap to the
screen halves, minimise to the taskbar and stack by z-order. Everything below is
a real window, not a section on a page.

| App | What it does |
| --- | --- |
| **Microstock Terminal** | The headline: total paid out to holders (ticking live), price, market cap, holders, and a price chart with a chart/table toggle |
| **Payouts** | Live payout feed with filters and pause, daily distribution bars, epoch countdown |
| **Wallet** | Connects an injected Solana wallet (Phantom / Solflare / Backpack), falls back to a labelled demo account. Shows your share, your per-hour/day/month stream, and an earnings model |
| **Charts** | Price, volume, and the supply donut |
| **Holders** | Searchable leaderboard with each wallet's earnings |
| **File Explorer** | Opens the docs — README, tokenomics, roadmap, audit summary, risk note |
| **Notepad** | Reads those docs |
| **Microstock Edge** | Official links, mint address, and how to buy |
| **Task Manager** | Protocol processes and payout throughput |
| **Command Prompt** | `help`, `price`, `stats`, `payouts`, `epoch`, `holders`, `supply`, `mint`, `open <app>`, `whoami`, `ver`, `cls` |
| **Settings** | Wallpaper, light/dark, accent colour — persisted in `localStorage` |
| **Recycle Bin** | A joke, but a tidy one |

Shell features: boot sequence (once per tab), Start menu with search across apps
and documents, widgets board, notification centre with calendar, desktop icons,
right-click desktop menu, and a taskbar that trims itself down at phone widths.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4.
No component library, no chart library — the Fluent surfaces and the SVG charts
are hand-built so the whole thing ships as a couple of small bundles.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## The data

Market data lives in [`lib/market.ts`](lib/market.ts) and is a **deterministic
simulation**, not live chain data. Every figure is a pure function of wall-clock
time, so the terminal, the payout feed, the taskbar ticker and the command
prompt always agree with each other without a shared server.

It is also internally consistent: 24h volume × the 1% fee equals what the payout
counter adds over the same window, and `totalPaidOut` is the closed-form integral
of a wobbling rate, so the counter can only ever go up.

### Going live

Replace two functions and the UI needs no changes:

- `snapshot(now)` — price, market cap, volume, liquidity, holder count
- `series(range, now)` / `volumeSeries(...)` — the chart data
- `recentPayouts(now)` / `totalPaidOut(now)` — the ledger

Point them at Helius (holders, transfers), Jupiter or Birdeye (price, volume),
and your distributor program's payout log. Everything else reads through those.

Token metadata — mint address, supply, fee, launch date — is at the top of
`lib/market.ts`. Outbound links are in [`lib/links.ts`](lib/links.ts); the ones
set to `null` render as "not linked yet" rather than as dead links, so fill in X
and Telegram before launch.

## Colour

Chart colours are validated, not eyeballed. The three categorical series
(`#3987e5` blue, `#d95926` orange, `#199e70` aqua) clear the all-pairs
colour-vision-deficiency and normal-vision separation thresholds against the
`#202020` chart surface. A fourth hue does not, which is why the supply donut
folds its tail into a neutral "Other".

## Disclosure

Microstock is a memecoin with a fee-share mechanic. It is not affiliated with,
endorsed by, or connected to Microsoft Corporation — the name is a joke about
tickers. Payouts track trading volume and can stop; the token price can go to
zero. Nothing in the interface is financial advice. See `Risk.txt` in the app.
