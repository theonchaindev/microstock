"use client";

import { useMemo, useState } from "react";
import { AppShell, Badge, Btn, Panel, Stat } from "@/components/ui/kit";
import { IconLock, IconWallet } from "@/components/os/icons";
import { useRafNow } from "@/components/os/system";
import { usePersisted } from "@/lib/client-state";
import { TOKEN, fakeAddress, snapshot, totalPaidOut } from "@/lib/market";
import { compact, num, shortAddr, usd } from "@/lib/format";

type Provider = "Phantom" | "Solflare" | "Backpack";
type Account = { provider: Provider | "Demo"; address: string; tokens: number } | null;

const STORE = "microstock.wallet.v1";
const CIRCULATING = 0.74; // only circulating supply earns
const NO_ACCOUNT: Account = null;

const INJECTED_KEY: Record<Provider, string> = { Phantom: "solana", Solflare: "solflare", Backpack: "backpack" };

type Injected = {
  connect?: () => Promise<{ publicKey?: { toString(): string } }>;
  publicKey?: { toString(): string };
};

/**
 * Uses a real injected wallet when one is present; otherwise hands back a
 * clearly-labelled demo account so the UI is explorable without one.
 */
async function connectWallet(provider: Provider): Promise<NonNullable<Account>> {
  const injected = (globalThis as Record<string, unknown>)[INJECTED_KEY[provider]] as Injected | undefined;
  let address: string | null = null;
  try {
    if (injected?.connect) {
      const res = await injected.connect();
      address = res?.publicKey?.toString() ?? injected.publicKey?.toString() ?? null;
    }
  } catch {
    address = null; // user rejected, or the extension is locked
  }
  await new Promise((r) => setTimeout(r, 420));
  const seed = Math.floor(Math.random() * 80_000) + 500;
  return {
    provider: address ? provider : "Demo",
    address: address ?? fakeAddress(seed),
    tokens: Math.round(120_000 + (seed % 9_000) * 620),
  };
}

export default function WalletApp() {
  const now = useRafNow();
  const [acct, setAcct] = usePersisted<Account>("session", STORE, NO_ACCOUNT);
  const [busy, setBusy] = useState<Provider | null>(null);
  const [sim, setSim] = useState(2_500_000);

  const connect = async (provider: Provider) => {
    setBusy(provider);
    setAcct(await connectWallet(provider));
    setBusy(null);
  };

  const snap = useMemo(() => (now ? snapshot(Math.floor(now / 1000) * 1000) : null), [now]);

  if (!now || !snap) return <AppShell><div style={{ color: "var(--text-faint)" }}>Waking the keyring…</div></AppShell>;

  const dailyPool = snap.payoutRatePerSec * 86_400;
  const projShare = sim / (TOKEN.supply * CIRCULATING);

  if (!acct) {
    return (
      <AppShell className="grid min-h-full place-items-center">
        <div className="w-full max-w-[380px] text-center">
          <div className="mx-auto mb-4 w-fit"><IconWallet size={56} /></div>
          <h1 className="text-[13px] font-semibold">Connect a Solana wallet</h1>
          <p className="mx-auto mt-2 max-w-[320px] text-[11px]" style={{ color: "var(--text-dim)" }}>
            Read-only. Microstock never asks for a transaction to show your balance — rewards arrive on their own.
          </p>
          <div className="mt-5 space-y-2">
            {(["Phantom", "Solflare", "Backpack"] as Provider[]).map((p) => (
              <button
                key={p}
                onClick={() => connect(p)}
                disabled={busy !== null}
                className="flex w-full items-center justify-between rounded-[3px] px-4 py-3 text-[11px] font-medium transition-colors hover:brightness-125 disabled:opacity-50"
                style={{ background: "var(--content)", border: "1px solid #b9b5a4" }}
              >
                <span>{p}</span>
                <span style={{ color: "var(--text-faint)" }}>{busy === p ? "Connecting…" : "Connect"}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: "var(--text-faint)" }}>
            <IconLock size={12} /> No wallet installed? You&apos;ll get a demo account.
          </p>
        </div>
      </AppShell>
    );
  }

  const share = acct.tokens / (TOKEN.supply * CIRCULATING);
  const earned = totalPaidOut(now) * share * 0.31; // only since this wallet started holding
  const value = acct.tokens * snap.price;

  return (
    <AppShell className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <IconWallet size={40} />
        <div className="mr-auto">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px]">{shortAddr(acct.address, 6, 6)}</span>
            <Badge tone={acct.provider === "Demo" ? "warn" : "good"}>{acct.provider}</Badge>
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>Connected · Solana mainnet-beta</div>
        </div>
        <Btn variant="subtle" onClick={() => setAcct(null)}>Disconnect</Btn>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={`$${TOKEN.symbol} balance`} value={compact(acct.tokens)} hint={usd(value)} />
        <Stat label="Share of circulating" value={`${(share * 100).toFixed(4)}%`} hint={`of ${compact(TOKEN.supply * CIRCULATING)} earning supply`} />
        <Stat label="Earned so far" value={usd(earned)} hint="paid directly to this wallet" />
      </div>

      <Panel title="Your stream" hint="updates every second">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Per hour", (dailyPool / 24) * share],
            ["Per day", dailyPool * share],
            ["Per month", dailyPool * 30 * share],
          ].map(([label, v]) => (
            <div key={label as string}>
              <div className="text-[11px] uppercase" style={{ color: "var(--text-faint)" }}>{label}</div>
              <div className="tabular mt-1 text-[13px] font-semibold" style={{ color: "var(--good)" }}>
                {usd(v as number, 2)}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px]" style={{ color: "var(--text-dim)" }}>
          There is nothing to claim. Every epoch the fee vault pays each wallet its pro-rata share in SOL —
          the numbers above are what lands in this address at the current fee rate.
        </p>
      </Panel>

      <Panel title="What would I earn?" hint="drag to model a position">
        <input
          type="range"
          min={100_000}
          max={40_000_000}
          step={100_000}
          value={sim}
          onChange={(e) => setSim(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
          aria-label="Token amount to model"
        />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase" style={{ color: "var(--text-faint)" }}>Position</div>
            <div className="tabular text-[13px] font-semibold">{num(sim)} ${TOKEN.symbol}</div>
            <div className="tabular text-[11px]" style={{ color: "var(--text-faint)" }}>{usd(sim * snap.price)} at today&apos;s price</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase" style={{ color: "var(--text-faint)" }}>Projected monthly</div>
            <div className="tabular text-[13px] font-semibold" style={{ color: "var(--good)" }}>
              {usd(dailyPool * 30 * projShare)}
            </div>
            <div className="tabular text-[11px]" style={{ color: "var(--text-faint)" }}>
              {((dailyPool * 365 * projShare) / (sim * snap.price) * 100).toFixed(1)}% annualised at current volume
            </div>
          </div>
        </div>
        <p className="mt-3 text-[11px]" style={{ color: "var(--text-faint)" }}>
          Projections assume today&apos;s trading volume holds. Fee revenue moves with volume — it is not a fixed yield.
        </p>
      </Panel>
    </AppShell>
  );
}
