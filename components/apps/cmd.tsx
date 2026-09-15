"use client";

import { useEffect, useRef, useState } from "react";
import { useSystem } from "@/components/os/system";
import { APPS, type AppId } from "@/lib/apps";
import { TOKEN, snapshot, topHolders } from "@/lib/market";
import { compact, compactUsd, countdown, num, pct, shortAddr, usd } from "@/lib/format";

type Line = { text: string; tone?: "dim" | "good" | "bad" | "accent" };

const BANNER: Line[] = [
  { text: "Microstock [Version 11.0.26100.1742]", tone: "dim" },
  { text: "(c) Microstock Labs. Fees belong to holders.", tone: "dim" },
  { text: "" },
  { text: "Type 'help' for a list of commands.", tone: "dim" },
  { text: "" },
];

export default function CmdApp() {
  const { open } = useSystem();
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const push = (...l: Line[]) => setLines((prev) => [...prev, ...l]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    push({ text: `C:\\Microstock> ${cmd}` });
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    const now = Date.now();
    const snap = snapshot(now);

    switch (name) {
      case "help":
        push(
          { text: "" },
          { text: "  price      Current price and 24h change" },
          { text: "  stats      Market cap, volume, liquidity, holders" },
          { text: "  payouts    Total distributed to holders" },
          { text: "  epoch      Time until the next distribution" },
          { text: "  holders    Top 5 wallets" },
          { text: "  supply     Token supply and allocation" },
          { text: "  mint       Contract address" },
          { text: "  open <app> Launch a window (terminal, payouts, wallet, charts…)" },
          { text: "  whoami     You" },
          { text: "  ver        Version" },
          { text: "  cls        Clear the screen" },
          { text: "" },
        );
        break;
      case "price":
        push(
          { text: `$${TOKEN.symbol}  $${snap.price.toFixed(6)}`, tone: "accent" },
          { text: `24h     ${pct(snap.change24h)}`, tone: snap.change24h >= 0 ? "good" : "bad" },
          { text: "" },
        );
        break;
      case "stats":
        push(
          { text: `Market cap   ${compactUsd(snap.marketCap)}` },
          { text: `24h volume   ${compactUsd(snap.volume24h)}` },
          { text: `Liquidity    ${compactUsd(snap.liquidity)}  (LP burned)` },
          { text: `Holders      ${num(snap.holders)}` },
          { text: "" },
        );
        break;
      case "payouts":
        push(
          { text: `Total paid to holders   ${usd(snap.totalPaidOut)}`, tone: "good" },
          { text: `Last 24 hours           ${usd(snap.paidOut24h)}` },
          { text: `Rate                    ${usd(snap.payoutRatePerSec, 4)}/sec` },
          { text: "" },
        );
        break;
      case "epoch":
        push({ text: `Next distribution in ${countdown(snap.nextEpoch - now)}`, tone: "accent" }, { text: "" });
        break;
      case "holders":
        push({ text: "" });
        topHolders(now, 5).forEach((h) =>
          push({ text: `  #${h.rank}  ${shortAddr(h.addr, 8, 8)}  ${compact(h.tokens).padStart(8)}  ${usd(h.earned, 0)}` }),
        );
        push({ text: "" });
        break;
      case "supply":
        push(
          { text: `Total supply   ${num(TOKEN.supply)} $${TOKEN.symbol}` },
          { text: "Circulating    74%" },
          { text: "Rewards vault  12%" },
          { text: "Liquidity       9%  (burned)" },
          { text: "Other           5%" },
          { text: "" },
        );
        break;
      case "mint":
        push({ text: TOKEN.mint, tone: "accent" }, { text: "Verify this character for character before buying.", tone: "dim" }, { text: "" });
        break;
      case "open": {
        const target = args[0] as AppId;
        if (target && target in APPS) {
          open(target);
          push({ text: `Launching ${APPS[target].title}…`, tone: "dim" }, { text: "" });
        } else {
          push({ text: `Unknown app '${args[0] ?? ""}'. Try: ${Object.keys(APPS).join(", ")}`, tone: "bad" }, { text: "" });
        }
        break;
      }
      case "whoami":
        push({ text: "holder", tone: "accent" }, { text: "Privileges: being paid every five minutes.", tone: "dim" }, { text: "" });
        break;
      case "ver":
        push({ text: "Microstock Desktop 11.0 — Solana edition" }, { text: "" });
        break;
      case "cls":
      case "clear":
        setLines([]);
        break;
      case "exit":
        push({ text: "Use the X in the corner. This is a browser.", tone: "dim" }, { text: "" });
        break;
      case "wen":
      case "moon":
        push({ text: "Already paying. Check 'payouts'.", tone: "good" }, { text: "" });
        break;
      case "rug":
        push({ text: "'rug' is not recognized as an internal or external command.", tone: "bad" }, { text: "LP is burned and the mint authority is revoked.", tone: "dim" }, { text: "" });
        break;
      default:
        push({ text: `'${name}' is not recognized as an internal or external command.`, tone: "bad" }, { text: "" });
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(history.length - 1, hIdx + 1);
      if (i >= 0) {
        setHIdx(i);
        setInput(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(i);
      setInput(i >= 0 ? history[i] : "");
    }
  };

  // The console keeps its own palette: theme ink would vanish on black.
  const tone = (t?: Line["tone"]) =>
    t === "dim" ? "#9a9a9a" : t === "good" ? "#5ce65c" : t === "bad" ? "#ff7b6b" : t === "accent" ? "#6fc3ff" : "#e8e8e8";

  return (
    <div
      className="scroll-xp h-full min-h-full cursor-text overflow-auto p-3 font-mono text-[12px] leading-[1.5]"
      style={{ background: "#000000", color: "#e8e8e8" }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap select-text" style={{ color: tone(l.tone) }}>
          {l.text || "\u00a0"}
        </div>
      ))}
      <div className="flex items-center">
        <span style={{ color: "#e8e8e8" }}>C:\Microstock&gt;&nbsp;</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          className="flex-1 bg-transparent font-mono text-[12px] outline-none"
          style={{ color: "#e8e8e8" }}
          aria-label="Command input"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
