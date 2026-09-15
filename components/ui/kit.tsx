"use client";

import { IconCheck, IconCopy } from "@/components/os/icons";
import { useCopy } from "@/components/os/system";

export function AppShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-3 ${className}`}>{children}</div>;
}

/** The blue bold caption XP puts above a group of controls. */
export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <h2 className="text-[11px] font-bold" style={{ color: "var(--pane-head-text)" }}>
        {children}
      </h2>
      {hint && <span className="text-[11px]" style={{ color: "var(--text-dim)" }}>{hint}</span>}
    </div>
  );
}

/** White panel with a tinted caption strip — the XP task-pane block. */
export function Panel({
  children,
  className = "",
  bodyClass = "",
  title,
  hint,
  pad = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Applied to the inner body — use it when the panel's content must flex. */
  bodyClass?: string;
  title?: React.ReactNode;
  hint?: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <section className={`group-box overflow-hidden ${className}`}>
      {title && (
        <div
          className="flex items-baseline justify-between gap-3 px-2.5 py-1.5"
          style={{ background: "var(--pane-head)", borderBottom: "1px solid #e0ddd1" }}
        >
          <h2 className="text-[11px] font-bold" style={{ color: "var(--pane-head-text)" }}>{title}</h2>
          {hint && <span className="text-[11px]" style={{ color: "var(--text-dim)" }}>{hint}</span>}
        </div>
      )}
      <div className={`${pad ? "p-2.5" : ""} ${bodyClass}`}>{children}</div>
    </section>
  );
}

/** The single most important figure on the page. */
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
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.04em]" style={{ color: "var(--pane-head-text)" }}>
        <LiveDot />
        {label}
      </div>
      <div
        className="tabular font-bold leading-none"
        style={{ fontSize: "clamp(30px, 4.6vw, 46px)", letterSpacing: "-0.02em", color: accent, fontFamily: "var(--font-title)" }}
      >
        {value}
      </div>
      {sub && <div className="mt-1.5 text-[11px]" style={{ color: "var(--text-dim)" }}>{sub}</div>}
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
    <div className="group-box p-2">
      <div className="text-[11px]" style={{ color: "var(--text-dim)" }}>{label}</div>
      <div className="tabular mt-0.5 text-[17px] font-bold leading-none" style={{ fontFamily: "var(--font-title)" }}>
        {value}
      </div>
      {delta !== undefined && (
        <div className="tabular mt-1 text-[11px] font-bold" style={{ color: delta >= 0 ? "var(--good)" : "var(--bad)" }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}% <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>24h</span>
        </div>
      )}
      {hint && <div className="mt-1 text-[11px]" style={{ color: "var(--text-faint)" }}>{hint}</div>}
    </div>
  );
}

export function LiveDot({ color = "var(--good)" }: { color?: string }) {
  return (
    <span
      className="inline-block h-[7px] w-[7px] rounded-full"
      style={{ background: color, animation: "pulse-dot 1.8s ease-in-out infinite" }}
    />
  );
}

/** A row of bevelled toggles — the active one sits pressed in. */
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
    <div className="inline-flex">
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="px-2.5 py-[3px] text-[11px]"
            style={{
              minWidth: 40,
              fontWeight: on ? 700 : 400,
              background: on
                ? "linear-gradient(180deg,#dfe9f7 0%,#c5d8f0 100%)"
                : "linear-gradient(180deg,#ffffff 0%,#eeede1 100%)",
              border: "1px solid #7f9db9",
              borderLeftWidth: i === 0 ? 1 : 0,
              borderRadius: i === 0 ? "3px 0 0 3px" : i === options.length - 1 ? "0 3px 3px 0" : 0,
              boxShadow: on ? "inset 1px 1px 3px rgba(0,0,0,.22)" : "inset 0 1px 0 rgba(255,255,255,.8)",
              color: "var(--text)",
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
  if (variant === "subtle") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-2 py-[3px] text-[11px] underline-offset-2 hover:underline disabled:opacity-40 ${full ? "w-full" : ""}`}
        style={{ color: "var(--link)" }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`xp-btn ${variant === "accent" ? "xp-btn-primary" : ""} ${full ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "accent" }) {
  const map = {
    neutral: { bg: "#efeee4", fg: "var(--text-dim)", bd: "#cfcbbb" },
    good: { bg: "#e3f4e6", fg: "var(--good)", bd: "#a9d6b2" },
    warn: { bg: "#fdf2da", fg: "var(--warn)", bd: "#e5cd94" },
    accent: { bg: "#e2edfc", fg: "var(--pane-head-text)", bd: "#abc8ea" },
  }[tone];
  return (
    <span
      className="rounded-[2px] px-1.5 py-[1px] text-[10px] font-bold uppercase"
      style={{ background: map.bg, color: map.fg, border: `1px solid ${map.bd}` }}
    >
      {children}
    </span>
  );
}

export function CopyChip({ text, display }: { text: string; display?: string }) {
  const { copied, copy } = useCopy();
  const on = copied === text;
  return (
    <button type="button" onClick={() => copy(text)} className="xp-btn inline-flex items-center gap-1.5" title="Copy to clipboard">
      <span className="truncate font-mono text-[11px]">{display ?? text}</span>
      <span style={{ color: on ? "var(--good)" : "var(--text-dim)" }}>{on ? <IconCheck size={12} /> : <IconCopy size={12} />}</span>
    </button>
  );
}

/** XP list view: bevelled grey column headers over a white well. */
export function Table({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-[11px]">
      <thead>
        <tr>
          {head.map((h, i) => (
            <th
              key={i}
              className="sticky top-0 z-[1] px-2 py-[3px] text-left text-[11px] font-normal"
              style={{
                background: "linear-gradient(180deg,#ffffff 0%,#f0efe6 55%,#e4e2d5 100%)",
                borderRight: "1px solid #d2cfc0",
                borderBottom: "1px solid #b9b5a4",
                color: "var(--text)",
              }}
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

/** Zebra-striped list row, XP style. */
export function Tr({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <tr style={{ background: i % 2 ? "var(--content-alt)" : "var(--content)" }} className="anim-row">
      {children}
    </tr>
  );
}

/** The blue gradient sidebar XP puts down the left of an Explorer window. */
export function TaskPane({ children, width = 172 }: { children: React.ReactNode; width?: number }) {
  return (
    <nav className="shrink-0 p-2" style={{ width, background: "var(--sidebar)" }}>
      {children}
    </nav>
  );
}

/** A collapsible white block inside the task pane. */
export function TaskBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-2 overflow-hidden" style={{ borderRadius: 4, background: "#fff" }}>
      <div className="px-2 py-1 text-[11px] font-bold" style={{ background: "var(--pane-head)", color: "var(--pane-head-text)" }}>
        {title}
      </div>
      <div className="p-2">{children}</div>
    </section>
  );
}
