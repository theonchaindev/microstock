"use client";

import { IconCheck, IconCopy } from "@/components/os/icons";
import { useCopy } from "@/components/os/system";

export function AppShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="text-[13px] font-semibold tracking-[0.01em]">{children}</h2>
      {hint && <span className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>{hint}</span>}
    </div>
  );
}

export function Panel({
  children,
  className = "",
  title,
  hint,
  pad = true,
}: {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  hint?: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <section className={`card ${pad ? "p-4" : ""} ${className}`}>
      {title && <SectionTitle hint={hint}>{title}</SectionTitle>}
      {children}
    </section>
  );
}

/** Hero number — the page's single most important figure. */
export function Hero({
  value,
  label,
  sub,
  accent = "var(--good)",
}: {
  value: string;
  label: string;
  sub?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.09em]" style={{ color: "var(--text-muted)" }}>
        <LiveDot color={accent} />
        {label}
      </div>
      <div
        className="tabular font-semibold leading-none"
        style={{ fontSize: "clamp(34px, 5.2vw, 54px)", letterSpacing: "-0.025em", color: accent }}
      >
        {value}
      </div>
      {sub && <div className="mt-2 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>{sub}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
}) {
  return (
    <div className="card p-3.5">
      <div className="text-[11px] uppercase tracking-[0.07em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="tabular mt-1.5 text-[19px] font-semibold leading-none">{value}</div>
      {delta !== undefined && (
        <div className="tabular mt-1.5 text-[12px] font-medium" style={{ color: delta >= 0 ? "var(--good)" : "var(--bad)" }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}% <span style={{ color: "var(--text-muted)" }}>24h</span>
        </div>
      )}
      {hint && <div className="mt-1.5 text-[11.5px]" style={{ color: "var(--text-muted)" }}>{hint}</div>}
    </div>
  );
}

export function LiveDot({ color = "var(--good)" }: { color?: string }) {
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: color, animation: "pulse-dot 1.8s ease-in-out infinite" }} />
    </span>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-md p-0.5" style={{ background: "var(--surface-3)", border: "1px solid var(--stroke)" }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors"
            style={{
              background: on ? "var(--accent)" : "transparent",
              color: on ? "var(--on-accent)" : "var(--text-secondary)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "standard",
  disabled,
  full,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "accent" | "standard" | "subtle";
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit";
}) {
  const style: React.CSSProperties =
    variant === "accent"
      ? { background: "var(--accent)", color: "var(--on-accent)", border: "1px solid transparent" }
      : variant === "subtle"
        ? { background: "transparent", color: "var(--text-secondary)", border: "1px solid transparent" }
        : { background: "var(--surface-3)", color: "var(--text-primary)", border: "1px solid var(--stroke-strong)" };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3.5 py-[7px] text-[13px] font-medium transition-[filter,opacity] hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-40 ${full ? "w-full" : ""}`}
      style={style}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "accent" }) {
  const map = {
    neutral: { bg: "var(--surface-3)", fg: "var(--text-secondary)" },
    good: { bg: "color-mix(in srgb, var(--good) 18%, transparent)", fg: "var(--good)" },
    warn: { bg: "color-mix(in srgb, var(--warn) 20%, transparent)", fg: "var(--warn)" },
    accent: { bg: "color-mix(in srgb, var(--accent) 20%, transparent)", fg: "var(--accent)" },
  }[tone];
  return (
    <span className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.06em]" style={{ background: map.bg, color: map.fg }}>
      {children}
    </span>
  );
}

export function CopyChip({ text, display }: { text: string; display?: string }) {
  const { copied, copy } = useCopy();
  const on = copied === text;
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-[11.5px] transition-colors hover:brightness-125"
      style={{ background: "var(--surface-3)", border: "1px solid var(--stroke)", color: "var(--text-secondary)" }}
      title="Copy to clipboard"
    >
      <span className="truncate">{display ?? text}</span>
      <span style={{ color: on ? "var(--good)" : "var(--text-muted)" }}>{on ? <IconCheck size={13} /> : <IconCopy size={13} />}</span>
    </button>
  );
}

export function Skeleton({ h = 16, w = "100%" }: { h?: number; w?: number | string }) {
  return <div className="rounded" style={{ height: h, width: w, background: "var(--surface-3)" }} />;
}

/** Column-aligned data table used by Payouts / Holders. */
export function Table({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-[12.5px]">
      <thead>
        <tr>
          {head.map((h, i) => (
            <th
              key={i}
              className="sticky top-0 z-[1] px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.07em]"
              style={{ color: "var(--text-muted)", background: "var(--surface-1)", borderBottom: "1px solid var(--divider)" }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
