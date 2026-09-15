import { TOKEN } from "./market";

/**
 * Outbound links. `url: null` renders as "not linked yet" rather than a dead
 * link — fill these in before launch.
 */
export type Link = { id: string; label: string; host: string; url: string | null; blurb: string };

export const LINKS: Link[] = [
  { id: "dexscreener", label: "DexScreener", host: "dexscreener.com", url: `https://dexscreener.com/solana/${TOKEN.mint}`, blurb: "Chart, liquidity and trade history" },
  { id: "solscan", label: "Solscan", host: "solscan.io", url: `https://solscan.io/token/${TOKEN.mint}`, blurb: "The token account on-chain" },
  { id: "jupiter", label: "Jupiter", host: "jup.ag", url: `https://jup.ag/swap/SOL-${TOKEN.mint}`, blurb: "Swap SOL for $MSFT" },
  { id: "birdeye", label: "Birdeye", host: "birdeye.so", url: `https://birdeye.so/token/${TOKEN.mint}?chain=solana`, blurb: "Holder analytics" },
  { id: "x", label: "X / Twitter", host: "x.com", url: null, blurb: "Announcements" },
  { id: "telegram", label: "Telegram", host: "t.me", url: null, blurb: "Community chat" },
];
