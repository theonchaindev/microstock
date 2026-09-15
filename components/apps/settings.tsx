"use client";

import { useState } from "react";
import { Badge, Btn, Panel } from "@/components/ui/kit";
import { IconCheck } from "@/components/os/icons";
import { DEFAULT_SETTINGS, useSystem, type Theme, type Wallpaper } from "@/components/os/system";
import { WALLPAPERS } from "@/components/os/wallpaper";
import { TOKEN } from "@/lib/market";
import { num } from "@/lib/format";

const SCHEMES: { id: Theme; label: string; swatch: string }[] = [
  { id: "blue", label: "Windows XP style (Blue)", swatch: "linear-gradient(180deg,#3d95ff,#0054e3)" },
  { id: "olive", label: "Windows XP style (Olive Green)", swatch: "linear-gradient(180deg,#a4bd6b,#7c9a3f)" },
  { id: "silver", label: "Windows XP style (Silver)", swatch: "linear-gradient(180deg,#d3d3e0,#9d9db0)" },
  { id: "classic", label: "Windows Classic style", swatch: "linear-gradient(90deg,#0a246a,#a6caf0)" },
];

const TABS = ["Themes", "Desktop", "System", "About"] as const;
type Tab = (typeof TABS)[number];

export default function ControlPanelApp() {
  const { settings, setSettings } = useSystem();
  const [tab, setTab] = useState<Tab>("Themes");

  return (
    <div className="flex h-full min-h-0 flex-col p-2.5">
      {/* XP tab strip */}
      <div className="flex items-end gap-[2px] pl-1" style={{ marginBottom: -1 }}>
        {TABS.map((t) => {
          const on = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 pb-1 pt-1.5 text-[11px]"
              style={{
                background: on ? "var(--content)" : "linear-gradient(180deg,#fbfaf4,#e8e6d9)",
                border: "1px solid #a0a0a0",
                borderBottom: on ? "1px solid var(--content)" : "1px solid #a0a0a0",
                borderRadius: "3px 3px 0 0",
                fontWeight: on ? 700 : 400,
                position: "relative",
                zIndex: on ? 2 : 1,
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div
        className="scroll-xp min-h-0 flex-1 overflow-auto p-3"
        style={{ background: "var(--content)", border: "1px solid #a0a0a0", borderRadius: "0 3px 3px 3px" }}
      >
        {tab === "Themes" && (
          <>
            <p className="mb-3 text-[11px]" style={{ color: "var(--text-dim)" }}>
              A theme is a background plus a set of sounds, icons, and other elements to help you personalise your
              computer with one click.
            </p>
            <div className="space-y-1.5">
              {SCHEMES.map((s) => {
                const on = settings.theme === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSettings({ theme: s.id })}
                    className="flex w-full items-center gap-3 p-2 text-left"
                    style={{
                      border: `1px solid ${on ? "var(--select)" : "#dcd9cc"}`,
                      background: on ? "var(--hover)" : "var(--content)",
                      borderRadius: 3,
                    }}
                  >
                    <span className="h-7 w-14 shrink-0" style={{ background: s.swatch, border: "1px solid #8a8a8a", borderRadius: 2 }} />
                    <span className="flex-1 text-[11px]" style={{ fontWeight: on ? 700 : 400 }}>{s.label}</span>
                    {on && <span style={{ color: "var(--select)" }}><IconCheck size={14} /></span>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {tab === "Desktop" && (
          <>
            <p className="mb-3 text-[11px]" style={{ color: "var(--text-dim)" }}>
              Choose a background for your desktop.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {WALLPAPERS.map((w) => {
                const on = settings.wallpaper === w.id;
                return (
                  <button key={w.id} onClick={() => setSettings({ wallpaper: w.id as Wallpaper })} className="text-left">
                    <span
                      className="relative block"
                      style={{
                        aspectRatio: "4/3",
                        background: THUMB[w.id],
                        border: `2px solid ${on ? "var(--select)" : "#9a9a9a"}`,
                        borderRadius: 2,
                      }}
                    />
                    <span className="mt-1 block text-[11px]" style={{ fontWeight: on ? 700 : 400 }}>
                      {w.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <Btn onClick={() => setSettings(DEFAULT_SETTINGS)}>Restore Defaults</Btn>
            </div>
          </>
        )}

        {tab === "System" && (
          <div className="space-y-3">
            <Panel title="Display">
              <Row k="Resolution" v="Whatever your browser says" />
              <Row k="Colour quality" v="Highest (32 bit)" />
              <Row k="Graphics" v="Software-rendered SVG" />
            </Panel>
            <Panel title="Storage">
              <Row k="Local storage" v="Desktop personalisation only" />
              <Row k="Session storage" v="Wallet connection state" />
              <Row k="Cookies" v="None" />
              <p className="mt-2 text-[11px]" style={{ color: "var(--text-dim)" }}>
                Nothing you do here is sent anywhere. There is no analytics script and no account.
              </p>
            </Panel>
          </div>
        )}

        {tab === "About" && (
          <div className="space-y-3">
            <Panel title="Microstock XP">
              <Row k="Edition" v="Microstock XP Professional" />
              <Row k="Version" v="2002 (Build 2600)" />
              <Row k="Chain" v={TOKEN.chain} />
              <Row k="Token" v={`$${TOKEN.symbol} · ${num(TOKEN.supply)} supply`} />
              <Row k="Fee to holders" v={`${TOKEN.feeBps / 100}% of every trade`} />
              <Row k="Epoch" v="5 minutes" />
            </Panel>
            <Panel title="Disclosure">
              <div className="mb-1.5"><Badge tone="warn">Read this</Badge></div>
              <p className="text-[11px] leading-[1.7]" style={{ color: "var(--text-dim)" }}>
                Microstock is a memecoin with a fee-share mechanic, not a security, a fund, or a yield product. Payouts
                move with trading volume and can stop. The token price can go to zero. Nothing in this interface is
                financial advice. It is not affiliated with, endorsed by, or connected to Microsoft Corporation — the
                name is a joke about tickers, and the desktop is a parody.
              </p>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}

const THUMB: Record<string, string> = {
  microstock: "url(/microstock-bg.jpg) center/cover no-repeat",
  azul: "linear-gradient(150deg,#0b3d8c,#1563c4 55%,#062a63)",
  ticker: "linear-gradient(170deg,#0d2b56,#04101f)",
  classic: "#3a6ea5",
};

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-1 text-[11px] last:border-0" style={{ borderColor: "#eceade" }}>
      <span style={{ color: "var(--text-dim)" }}>{k}</span>
      <span className="tabular text-right font-bold">{v}</span>
    </div>
  );
}

export { ControlPanelApp as SettingsApp };
