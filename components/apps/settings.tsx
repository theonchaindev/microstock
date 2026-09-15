"use client";

import { useState } from "react";
import { AppShell, Badge, Btn, Panel } from "@/components/ui/kit";
import { IconCheck } from "@/components/os/icons";
import { useSystem, type Theme, type Wallpaper } from "@/components/os/system";
import { WALLPAPERS } from "@/components/os/wallpaper";
import { TOKEN } from "@/lib/market";
import { num } from "@/lib/format";

const ACCENTS = [
  { hex: "#4cc2ff", name: "Default blue" },
  { hex: "#5fd39b", name: "Vault green" },
  { hex: "#ff9a5c", name: "Candle orange" },
  { hex: "#c39bff", name: "Solana violet" },
  { hex: "#ff7a9c", name: "Liquidation pink" },
];

const PAGES = ["Personalisation", "System", "About"] as const;

export default function SettingsApp() {
  const { settings, setSettings } = useSystem();
  const [page, setPage] = useState<(typeof PAGES)[number]>("Personalisation");

  return (
    <div className="flex h-full min-h-0">
      <nav className="w-[178px] shrink-0 border-r p-2" style={{ borderColor: "var(--divider)" }}>
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className="mb-0.5 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[12.5px] transition-colors"
            style={{
              background: page === p ? "var(--surface-3)" : "transparent",
              color: page === p ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            {page === p && <span className="h-3.5 w-[3px] rounded-full" style={{ background: "var(--accent)" }} />}
            <span style={{ marginLeft: page === p ? 0 : 7 }}>{p}</span>
          </button>
        ))}
      </nav>

      <div className="scroll-fluent min-h-0 flex-1 overflow-auto">
        <AppShell className="space-y-4">
          {page === "Personalisation" && (
            <>
              <Panel title="Background">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {WALLPAPERS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSettings({ wallpaper: w.id as Wallpaper })}
                      className="group relative overflow-hidden rounded-lg text-left"
                      style={{
                        border: `2px solid ${settings.wallpaper === w.id ? "var(--accent)" : "var(--stroke)"}`,
                        aspectRatio: "16/10",
                      }}
                    >
                      <Thumb id={w.id} />
                      <span className="absolute inset-x-0 bottom-0 px-2 py-1 text-[11px]" style={{ background: "rgba(0,0,0,.55)", color: "#fff" }}>
                        {w.label}
                      </span>
                      {settings.wallpaper === w.id && (
                        <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                          <IconCheck size={12} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Colour mode">
                <div className="flex gap-2">
                  {(["dark", "light"] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSettings({ theme: t })}
                      className="flex-1 rounded-lg px-4 py-3 text-left text-[12.5px] transition-colors"
                      style={{
                        background: settings.theme === t ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "var(--surface-3)",
                        border: `1px solid ${settings.theme === t ? "var(--accent)" : "var(--stroke)"}`,
                      }}
                    >
                      <div className="font-medium capitalize">{t}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {t === "dark" ? "Easier on the eyes at 4am" : "For people with normal sleep"}
                      </div>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Accent colour">
                <div className="flex flex-wrap gap-2.5">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.hex}
                      onClick={() => setSettings({ accent: a.hex })}
                      title={a.name}
                      aria-label={a.name}
                      className="grid h-9 w-9 place-items-center rounded-md transition-transform hover:scale-105"
                      style={{ background: a.hex, outline: settings.accent === a.hex ? "2px solid var(--text-primary)" : "none", outlineOffset: 2 }}
                    >
                      {settings.accent === a.hex && <span style={{ color: "#00243b" }}><IconCheck size={14} /></span>}
                    </button>
                  ))}
                </div>
              </Panel>
            </>
          )}

          {page === "System" && (
            <>
              <Panel title="Display">
                <Row k="Resolution" v="Whatever your browser says" />
                <Row k="Scale" v="100% (recommended)" />
                <Row k="Graphics" v="Software-rendered SVG" />
              </Panel>
              <Panel title="Storage">
                <Row k="Local storage" v="Desktop personalisation only" />
                <Row k="Session storage" v="Wallet connection state" />
                <Row k="Cookies" v="None" />
                <p className="mt-3 text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                  Nothing you do here is sent anywhere. There is no analytics script and no account.
                </p>
              </Panel>
              <Panel title="Reset">
                <p className="mb-3 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
                  Restore the default wallpaper, theme and accent colour.
                </p>
                <Btn onClick={() => setSettings({ theme: "dark", wallpaper: "bloom", accent: "#4cc2ff" })}>Reset desktop</Btn>
              </Panel>
            </>
          )}

          {page === "About" && (
            <>
              <Panel title="Microstock Desktop">
                <Row k="Edition" v="Microstock 11 Pro" />
                <Row k="Version" v="11.0.26100.1742" />
                <Row k="Chain" v={TOKEN.chain} />
                <Row k="Token" v={`$${TOKEN.symbol} · ${num(TOKEN.supply)} supply`} />
                <Row k="Fee to holders" v={`${TOKEN.feeBps / 100}% of every trade`} />
                <Row k="Epoch" v="5 minutes" />
              </Panel>
              <Panel title="Disclosure">
                <div className="mb-2"><Badge tone="warn">Read this</Badge></div>
                <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Microstock is a memecoin with a fee-share mechanic, not a security, a fund, or a yield product.
                  Payouts move with trading volume and can stop. The token price can go to zero. Nothing in this
                  interface is financial advice. It is not affiliated with, endorsed by, or connected to Microsoft
                  Corporation in any way — the name is a joke about tickers.
                </p>
              </Panel>
            </>
          )}
        </AppShell>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2 text-[12.5px] last:border-0" style={{ borderColor: "var(--divider)" }}>
      <span style={{ color: "var(--text-secondary)" }}>{k}</span>
      <span className="tabular text-right font-medium">{v}</span>
    </div>
  );
}

function Thumb({ id }: { id: string }) {
  const bg: Record<string, string> = {
    bloom: "radial-gradient(70% 90% at 50% 50%, #3aa0ff 0%, #12407a 45%, #05142b 100%)",
    aurora: "linear-gradient(120deg, #05070f 0%, #1fd6a4 45%, #7b4dff 75%, #05070f 100%)",
    grid: "linear-gradient(180deg, #10243c, #04060a)",
    ticker: "linear-gradient(160deg, #0b1220, #03050a)",
  };
  return <span className="absolute inset-0" style={{ background: bg[id] }} />;
}
