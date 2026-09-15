"use client";

import { useState } from "react";
import { AppShell, Badge, CopyChip, Panel } from "@/components/ui/kit";
import { IconBack, IconChevronDown, IconExternal, IconGlobe, IconLock, IconRefresh } from "@/components/os/icons";
import { LINKS } from "@/lib/links";
import { TOKEN } from "@/lib/market";
import { shortAddr } from "@/lib/format";

const MENUS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

export default function BrowserApp() {
  const [spin, setSpin] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ background: "var(--face)" }}>
      {/* menu bar */}
      <div className="flex shrink-0 items-center gap-0.5 px-1 py-[2px]">
        {MENUS.map((m) => (
          <span
            key={m}
            className="cursor-default px-2 py-[2px] text-[11px]"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--select)";
              e.currentTarget.style.color = "var(--select-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text)";
            }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* toolbar */}
      <div className="flex shrink-0 items-center gap-1 border-y px-1.5 py-1" style={{ borderColor: "#e2e0d4" }}>
        <ToolBtn icon={<IconBack size={14} />} label="Back" />
        <ToolBtn icon={<span style={{ transform: "scaleX(-1)", display: "inline-flex" }}><IconBack size={14} /></span>} label="Forward" dim />
        <span className="mx-1 h-4 w-px" style={{ background: "#cfccbd" }} />
        <button
          onClick={() => {
            setSpin(true);
            setTimeout(() => setSpin(false), 600);
          }}
          className="flex items-center gap-1 rounded-[3px] px-1.5 py-1 text-[11px]"
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ display: "inline-block", animation: spin ? "spin .6s linear" : undefined }}>
            <IconRefresh size={13} />
          </span>
          Refresh
        </button>
        <ToolBtn icon={<IconGlobe size={14} />} label="Home" />
      </div>

      {/* address bar */}
      <div className="flex shrink-0 items-center gap-1.5 px-1.5 py-1" style={{ borderBottom: "1px solid #e2e0d4" }}>
        <span className="text-[11px]" style={{ color: "var(--text-dim)" }}>Address</span>
        <div className="xp-input flex flex-1 items-center gap-1.5 py-[2px]">
          <IconGlobe size={13} />
          <span className="flex-1 truncate">http://microstock.fun/links</span>
          <IconChevronDown size={11} />
        </div>
        <button className="xp-btn" style={{ minWidth: 42 }}>Go</button>
      </div>

      {/* page */}
      <div className="scroll-xp min-h-0 flex-1 overflow-auto" style={{ background: "var(--content)" }}>
        <AppShell className="space-y-2.5">
          <div>
            <h1 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-title)" }}>
              Official Microstock links
            </h1>
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-dim)" }}>
              Check the mint address before you buy anything. Impersonators are a certainty, not a risk.
            </p>
            <div className="mt-2">
              <CopyChip text={TOKEN.mint} display={`${TOKEN.symbol} mint · ${shortAddr(TOKEN.mint, 8, 8)}`} />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {LINKS.map((l) => {
              const inner = (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold" style={{ color: l.url ? "var(--link)" : "var(--text-dim)" }}>
                      {l.label}
                    </span>
                    {l.url ? (
                      <span style={{ color: "var(--text-faint)" }}><IconExternal size={11} /></span>
                    ) : (
                      <Badge tone="warn">Not linked yet</Badge>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px]" style={{ color: "var(--text-dim)" }}>{l.blurb}</div>
                  <div className="mt-1 font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>{l.host}</div>
                </>
              );
              return l.url ? (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group-box block p-2 hover:brightness-[.98]"
                >
                  {inner}
                </a>
              ) : (
                <div key={l.id} className="group-box p-2 opacity-70">{inner}</div>
              );
            })}
          </div>

          <Panel title="How to buy" hint="60 seconds">
            <ol className="space-y-1.5 text-[11px]" style={{ color: "var(--text-dim)" }}>
              {[
                "Fund a Solana wallet with SOL.",
                "Open Jupiter and paste the mint address above — verify it character for character.",
                "Swap. Set slippage to 2% if the route is thin.",
                "Do nothing else. Rewards start landing at the next 5-minute epoch.",
              ].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="tabular grid h-4 w-4 shrink-0 place-items-center text-[10px] font-bold"
                    style={{ background: "var(--pane-head)", color: "var(--pane-head-text)", border: "1px solid #c3d6ef", borderRadius: 2 }}
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

      {/* status bar */}
      <div className="flex shrink-0 items-center gap-2 px-2 py-[3px] text-[11px]" style={{ borderTop: "1px solid #e2e0d4", color: "var(--text-dim)" }}>
        <span className="flex-1">Done</span>
        <span className="flex items-center gap-1">
          <IconLock size={11} /> Internet
        </span>
      </div>
    </div>
  );
}

function ToolBtn({ icon, label, dim }: { icon: React.ReactNode; label: string; dim?: boolean }) {
  return (
    <span
      className="flex cursor-default items-center gap-1 rounded-[3px] px-1.5 py-1 text-[11px]"
      style={{ color: dim ? "var(--face-lo)" : "var(--text)" }}
      onMouseEnter={(e) => !dim && (e.currentTarget.style.background = "var(--hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}
      {label}
    </span>
  );
}
