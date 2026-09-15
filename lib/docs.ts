export type Doc = { id: string; name: string; kind: "txt" | "md" | "pdf" | "csv"; size: string; modified: string; body: string };

export const DOCS: Doc[] = [
  {
    id: "readme",
    name: "README.txt",
    kind: "txt",
    size: "3 KB",
    modified: "12/05/2026 15:02",
    body: `MICROSTOCK ($MSFT) — README
===========================

Microstock is a Solana token with one job: take a cut of its own trading
volume and hand it to the people holding it.

  * 1% of every buy and every sell goes to the fee vault.
  * Every 5 minutes the vault empties, pro-rata, into holder wallets.
  * There is no claim button. There is no staking contract. There is no
    lockup. If the token is in your wallet, you are being paid.

The desktop you are looking at is the front end. Every window reads the
same on-chain state: the terminal, the payout feed, the task manager and
the command prompt will always agree with each other.

WHY A DESKTOP
-------------
Because a dashboard pretending to be an operating system is more honest
about what this is than a landing page with a rocket emoji. Open the
windows. Move them around. Snap them to the edges. It all works.

GETTING STARTED
---------------
  1. Open Wallet and connect (or use the demo account).
  2. Open Terminal to watch the total paid-out counter move.
  3. Open Payouts for the raw ledger.
  4. Open Command Prompt and type 'help' if you like doing things the
     hard way.

Nothing here asks you to sign a transaction.`,
  },
  {
    id: "tokenomics",
    name: "Tokenomics.md",
    kind: "md",
    size: "2 KB",
    modified: "12/05/2026 15:04",
    body: `# Tokenomics

**Supply** 1,000,000,000 $MSFT — fixed, mint authority revoked.

| Bucket                | Share | Notes                                  |
|-----------------------|-------|----------------------------------------|
| Circulating           | 74%   | Free float. Earns fees.                |
| Rewards vault         | 12%   | Buffers epochs with thin volume.       |
| Liquidity             |  9%   | LP tokens burned at launch.            |
| Other                 |  5%   | CEX / market-making reserve, disclosed.|

## The fee

Every trade pays 1%. That 1% is not split with a team wallet, a marketing
wallet, or a "development fund". It goes to one place: the fee vault.

    trade volume x 0.01 -> fee vault -> holders (pro-rata, every 5 min)

Team allocation is 0%. The treasury holds the "Other" bucket and its
address is published in Explorer > Documents > Audit.

## What moves your payout

1. **Volume.** More trading, more fees. This is the whole model.
2. **Your share of the free float.** 0.1% of circulating supply earns
   0.1% of every distribution.
3. **Nothing else.** No emissions schedule, no APY that has to be
   defended, no dilution.

Fee revenue is variable. A quiet week pays less. Anyone quoting you a
fixed APY on a fee-share token is guessing.`,
  },
  {
    id: "roadmap",
    name: "Roadmap.txt",
    kind: "txt",
    size: "1 KB",
    modified: "01/09/2026 09:20",
    body: `ROADMAP
=======

SHIPPED
  [x] Token deployed, mint authority revoked
  [x] LP burned
  [x] Fee vault + 5-minute epoch distributor live
  [x] Microstock Desktop (this thing)
  [x] Public payout ledger

IN PROGRESS
  [ ] Wallet-level payout history export (CSV)
  [ ] Mobile desktop shell — yes, really
  [ ] Third-party distributor audit, published in full

CONSIDERING
  [ ] Holder-voted treasury deployment
  [ ] Second fee stream from LP position

NOT DOING
  [ ] Staking. You already earn by holding.
  [ ] A separate governance token.
  [ ] Anything that requires you to lock your tokens up.`,
  },
  {
    id: "audit",
    name: "Audit-summary.txt",
    kind: "txt",
    size: "4 KB",
    modified: "22/06/2026 11:41",
    body: `DISTRIBUTOR AUDIT — SUMMARY
===========================

Scope: fee vault program, epoch distributor, and the pro-rata accounting
that decides who gets what.

FINDINGS
  Critical  0
  High      0
  Medium    1  - resolved
  Low       3  - 2 resolved, 1 accepted

MEDIUM (resolved)
  Rounding in the pro-rata split could strand dust in the vault across
  many epochs. Fixed: remainder now rolls into the following epoch
  instead of being truncated.

LOW (accepted)
  Epoch length is an admin parameter. Changing it does not affect who is
  owed what, only how often it settles. Left mutable deliberately so the
  cadence can be tuned to Solana fee conditions.

NOT IN SCOPE
  Price. Volume. Whether this is a good idea. An audit tells you the
  code does what it says; it does not tell you what to buy.`,
  },
  {
    id: "risk",
    name: "Risk.txt",
    kind: "txt",
    size: "2 KB",
    modified: "12/05/2026 15:06",
    body: `PLAIN-ENGLISH RISK NOTE
=======================

This is a memecoin with a fee-share mechanic. Read that sentence again.

  * Payouts track trading volume. Volume can go to zero. So can the
    payouts.
  * The token price can go to zero independently of the payouts.
  * "Annualised" figures anywhere in this interface are arithmetic on
    today's volume, not a promise, a forecast, or a yield.
  * Nothing here is financial advice and nobody involved is your
    adviser.
  * Only put in money you are genuinely relaxed about losing entirely.

The mechanics are transparent on purpose so you can judge them. That
transparency is not the same thing as safety.`,
  },
];

export const DOC_BY_ID = Object.fromEntries(DOCS.map((d) => [d.id, d]));
