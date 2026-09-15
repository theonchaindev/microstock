"use client";

import { useState } from "react";
import { AppShell, Badge, CopyChip, Panel } from "@/components/ui/kit";
import { IconExternal, IconGlobe, IconLock, IconRefresh } from "@/components/os/icons";
import { LINKS } from "@/lib/links";
import { TOKEN } from "@/lib/market";
import { shortAddr } from "@/lib/format";

export default function EdgeApp() {
  const [spin, setSpin] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* tab strip */}
      <div className="flex items-end gap-1 px-2 pt-2" style={{ background: "var(--surface-3)" }}>
        <div
          className="flex max-w-[220px] items-center gap-2 rounded-t-lg px-3 py-1.5 text-[12px]"
          style={{ background: "var(--surface-1)" }}
        >
          <IconGlobe size={14} />
          <span className="truncate">Microstock — Official links</span>
        </div>
        <span className="px-2 pb-1.5 text-[15px]" style={{ color: "var(--text-muted)" }}>+</span>
      </div>

      {/* address bar */}
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: "var(--divider)" }}>
        <button
          onClick={() => {
            setSpin(true);
            setTimeout(() => setSpin(false), 600);
          }}
          className="grid h-7 w-7 place-items-center rounded-md"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Reload"
        >
          <span style={{ display: "inline-block", animation: spin ? "spin .6s linear" : undefined }}>
            <IconRefresh size={14} />
          </span>
        </button>
        <div
          className="flex flex-1 items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px]"
          style={{ background: "var(--surface-3)", border: "1px solid var(--stroke)" }}
        >
          <IconLock size={12} />
          <span style={{ color: "var(--text-secondary)" }}>microstock.fun</span>
          <span style={{ color: "var(--text-muted)" }}>/links</span>
        </div>
      </div>

      <div className="scroll-fluent min-h-0 flex-1 overflow-auto">
        <AppShell className="space-y-4">
          <div>
            <h1 className="text-[20px] font-semibold">Official Microstock links</h1>
            <p className="mt-1 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
              Check the mint address before you buy anything. Impersonators are a certainty, not a risk.
            </p>
            <div className="mt-3">
              <CopyChip text={TOKEN.mint} display={`${TOKEN.symbol} mint · ${shortAddr(TOKEN.mint, 8, 8)}`} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {LINKS.map((l) => {
              const inner = (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold">{l.label}</span>
                    {l.url ? (
                      <span style={{ color: "var(--text-muted)" }}><IconExternal size={12} /></span>
                    ) : (
                      <Badge tone="warn">Not linked yet</Badge>
                    )}
                  </div>
                  <div className="mt-1 text-[12px]" style={{ color: "var(--text-secondary)" }}>{l.blurb}</div>
                  <div className="mt-2 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>{l.host}</div>
                </>
              );
              return l.url ? (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card block p-3.5 transition-[filter] hover:brightness-125"
                >
                  {inner}
                </a>
              ) : (
                <div key={l.id} className="card p-3.5 opacity-60">{inner}</div>
              );
            })}
          </div>

          <Panel title="How to buy" hint="60 seconds">
            <ol className="space-y-2 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
              {[
                "Fund a Solana wallet with SOL.",
                "Open Jupiter and paste the mint address above — verify it character for character.",
                "Swap. Set slippage to 2% if the route is thin.",
                "Do nothing else. Rewards start landing at the next 5-minute epoch.",
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="tabular grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
                    style={{ background: "var(--surface-3)", color: "var(--accent)" }}
                  >
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </AppShell>
      </div>
    </div>
  );
}
