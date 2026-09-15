# Microstock

A fully usable Windows XP desktop in the browser, built as the front end for
**$MSFT (Microstock)** — a Solana token that streams 1% of every trade straight
to holders.

Live: **https://microstock-zeta.vercel.app**

## What's in it

The whole site is a desktop. Windows drag by their Luna title bar, resize from
any edge, snap to the screen halves, minimise to the taskbar and stack by
z-order. Everything below is a real window, not a section on a page.

| App | What it does |
| --- | --- |
| **Microstock Terminal** | The headline: total paid out to holders (ticking live), price, market cap, holders, and a price chart with a chart/table toggle |
| **Payouts** | Live payout feed with filters and pause, daily distribution bars, epoch countdown |
| **My Wallet** | Connects an injected Solana wallet (Phantom / Solflare / Backpack), falls back to a labelled demo account. Shows your share, your per-hour/day/month stream, and an earnings model |
| **Charts** | Price, volume, and the supply donut |
| **Holders** | Searchable leaderboard with each wallet's earnings |
| **My Documents** | Explorer with the blue task pane — opens the docs (README, tokenomics, roadmap, audit, risk note) |
| **Notepad** | Reads those docs |
| **Microstock Browser** | Official links, mint address, and how to buy |
| **Task Manager** | Protocol processes and payout throughput, on XP tabs |
| **Command Prompt** | `help`, `price`, `stats`, `payouts`, `epoch`, `holders`, `supply`, `mint`, `open <app>`, `whoami`, `ver`, `cls` |
| **Control Panel** | Themes, Desktop, System, About |
| **Recycle Bin** | A joke, but a tidy one |

Shell: the XP boot sequence (once per tab), the two-column Start menu with the
user header and the green *All Programs* arrow, the tray balloon that pops up
when a payout settles, a clock flyout with a calendar and live protocol stats,
desktop icons, a right-click desktop menu, and a taskbar with the green Start
button, a `$MSFT` desk band and a system tray.

**Themes** are the four XP shipped with: Luna **Blue**, **Olive Green**,
**Silver**, and **Windows Classic** (square corners, grey bevels, the lot).
Wallpapers: Bliss, Azul, Ticker, Windows Classic blue. Both persist in
`localStorage`.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4.
No component library, no chart library, no webfonts, **no bitmap assets at all**
— the Luna gradients, the 3D bevels, the icons, the Bliss wallpaper and the SVG
charts are every one of them hand-drawn vector, so the whole thing ships as a
couple of small bundles. The type stack is Tahoma → Verdana with Trebuchet MS
on title bars, exactly as XP did it.

### On the artwork

Microsoft's icon files and the Bliss photograph are their copyrighted assets and
are not redistributed here. Everything visual is an original recreation drawn to
match the Luna language: three-quarter perspective, thick soft outlines in a
darker shade of the fill rather than black, a specular gloss up and to the left,
saturated gradients, and a soft drop shadow down and to the right. The wallpaper
is drawn from the photograph's composition — dome cresting a fifth in from the
left and falling away right, deep blue overhead grading to near-white at the
horizon, cumulus high with cirrus streaked below, yellow-green along the sunlit
crest into deep green in the foreground — not copied from it.

Every scheme is a set of CSS custom properties in `app/globals.css`; nothing
downstream hard-codes a colour, which is why swapping to Windows Classic
repaints the caption buttons, the bevels and the taskbar in one go.

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

Replace three functions and the UI needs no changes:

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
(`#2a78d6` blue, `#eb6834` orange, `#1baf7a` aqua) clear the all-pairs
colour-vision-deficiency and normal-vision separation thresholds against the
white content surface charts are drawn on. Two of them sit under 3:1 contrast
there, which obliges visible relief — hence the direct labels, the donut legend
with values, and the chart/table toggle. A fourth hue does not clear the gates,
which is why the supply donut folds its tail into a neutral "Other".

## Disclosure

Microstock is a memecoin with a fee-share mechanic. It is not affiliated with,
endorsed by, or connected to Microsoft Corporation — the name is a joke about
tickers and the desktop is a parody. Payouts track trading volume and can stop;
the token price can go to zero. Nothing in the interface is financial advice.
See `Risk.txt` in the app.
