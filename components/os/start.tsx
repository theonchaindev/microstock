"use client";

import { useMemo, useRef, useState } from "react";
import { APP_LIST, APPS, PINNED_APPS, type AppId } from "@/lib/apps";
import { DOCS } from "@/lib/docs";
import { AppIcon } from "@/components/apps/registry";
import { IconChevronRight, IconFolder, IconNotepad, IconPower, IconSearch } from "./icons";
import { useSystem } from "./system";
import { TASKBAR_H } from "./window";

/** Right-hand column: XP's "places", pointed at this desktop's equivalents. */
const PLACES: { id: AppId; label: string; bold?: boolean }[] = [
  { id: "explorer", label: "My Documents", bold: true },
  { id: "terminal", label: "My Computer", bold: true },
  { id: "charts", label: "My Charts" },
  { id: "settings", label: "Control Panel" },
  { id: "holders", label: "Holders" },
  { id: "recycle", label: "Recycle Bin" },
];

const RECENT: AppId[] = ["charts", "holders", "taskmgr", "cmd", "edge"];

export function StartMenu({ onClose, autoFocus }: { onClose: () => void; autoFocus?: boolean }) {
  const { open } = useSystem();
  const [q, setQ] = useState("");
  const [allPrograms, setAllPrograms] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    return {
      apps: APP_LIST.filter((a) => a.title.toLowerCase().includes(s) || a.blurb.toLowerCase().includes(s)),
      docs: DOCS.filter((d) => d.name.toLowerCase().includes(s) || d.body.toLowerCase().includes(s)).slice(0, 5),
    };
  }, [q]);

  const launch = (fn: () => void) => {
    fn();
    onClose();
  };

  const leftApps = allPrograms ? APP_LIST : PINNED_APPS;

  return (
    <div
      className="anim-menu absolute z-[950] flex flex-col overflow-hidden"
      style={{
        left: 2,
        bottom: TASKBAR_H - 1,
        width: "min(400px, calc(100vw - 8px))",
        border: "1px solid var(--frame)",
        borderRadius: "8px 8px 0 0",
        boxShadow: "var(--shadow-menu)",
        fontFamily: "var(--font-ui)",
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ---- header ---- */}
      <div
        className="flex shrink-0 items-center gap-2.5 px-2.5 py-2"
        style={{ background: "var(--title-active)", borderRadius: "7px 7px 0 0" }}
      >
        <UserTile />
        <span className="title-text text-[15px]" style={{ color: "#fff" }}>
          holder
        </span>
      </div>

      {/* ---- two columns ---- */}
      <div className="flex min-h-0 flex-1" style={{ borderTop: "2px solid #f5b400" }}>
        {/* left */}
        <div className="scroll-xp flex min-h-0 flex-1 flex-col overflow-auto" style={{ background: "#fff", maxHeight: "min(62vh, 420px)" }}>
          <div className="flex-1 p-1.5">
            {results ? (
              <>
                <ColHead>Programs</ColHead>
                {results.apps.map((a) => (
                  <Item key={a.id} icon={<AppIcon id={a.id} size={24} />} label={a.title} onClick={() => launch(() => open(a.id))} />
                ))}
                {results.docs.length > 0 && <ColHead>Documents</ColHead>}
                {results.docs.map((d) => (
                  <Item
                    key={d.id}
                    icon={<IconNotepad size={24} />}
                    label={d.name}
                    onClick={() => launch(() => open("notepad", d.id, `${d.name} - Notepad`))}
                  />
                ))}
                {!results.apps.length && !results.docs.length && (
                  <p className="px-2 py-4 text-[11px]" style={{ color: "var(--text-dim)" }}>
                    No programs or documents match &ldquo;{q}&rdquo;.
                  </p>
                )}
              </>
            ) : (
              <>
                {leftApps.slice(0, allPrograms ? 99 : 3).map((a) => (
                  <Item key={a.id} icon={<AppIcon id={a.id} size={24} />} label={a.title} bold onClick={() => launch(() => open(a.id))} />
                ))}
                {!allPrograms && (
                  <>
                    <Sep />
                    {RECENT.map((id) => (
                      <Item key={id} icon={<AppIcon id={id} size={24} />} label={APPS[id].title} onClick={() => launch(() => open(id))} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* search + All Programs pinned to the bottom of the column */}
          <div className="sticky bottom-0 shrink-0 border-t bg-white p-1.5" style={{ borderColor: "#d8d8c8" }}>
            <div className="mb-1 flex items-center gap-1.5 px-1">
              <span style={{ color: "var(--text-dim)" }}>
                <IconSearch size={13} />
              </span>
              <input
                ref={inputRef}
                autoFocus={autoFocus}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search programs and documents"
                className="xp-input w-full"
                style={{ fontSize: 11 }}
              />
            </div>
            <button
              onClick={() => setAllPrograms((v) => !v)}
              className="flex w-full items-center gap-1.5 px-1.5 py-1 text-[11px] font-bold"
              style={{ color: "var(--text)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--select)";
                e.currentTarget.style.color = "var(--select-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text)";
              }}
            >
              <span className="flex-1 text-left">{allPrograms ? "Pinned programs" : "All Programs"}</span>
              <span
                className="grid h-4 w-4 place-items-center"
                style={{ background: "#3c9e2c", color: "#fff", borderRadius: 2 }}
              >
                <IconChevronRight size={10} />
              </span>
            </button>
          </div>
        </div>

        {/* right */}
        <div className="w-[164px] shrink-0 p-1.5" style={{ background: "linear-gradient(180deg,#d8e8fb 0%,#c6dcf6 100%)", borderLeft: "1px solid #a3c1e6" }}>
          {PLACES.map((pl) => (
            <Item
              key={pl.label}
              icon={<AppIcon id={pl.id} size={20} />}
              label={pl.label}
              bold={pl.bold}
              compact
              onClick={() => launch(() => open(pl.id))}
            />
          ))}
          <Sep tint="#aac6e8" />
          <Item
            icon={<IconFolder size={20} />}
            label="Help and Support"
            compact
            onClick={() => launch(() => open("notepad", "readme", "README.txt - Notepad"))}
          />
        </div>
      </div>

      {/* ---- footer ---- */}
      <div
        className="flex shrink-0 items-center justify-end gap-4 px-3 py-1.5"
        style={{ background: "var(--title-active)" }}
      >
        <FooterBtn label="Log Off" onClick={() => launch(() => open("wallet"))} color="#f0a800" />
        <FooterBtn label="Turn Off Computer" onClick={() => launch(() => open("settings"))} color="#d64a2e" />
      </div>
    </div>
  );
}

function UserTile() {
  return (
    <span
      className="grid h-10 w-10 place-items-center"
      style={{
        borderRadius: 4,
        border: "2px solid #fff",
        background: "linear-gradient(135deg,#7bb7f5 0%,#2a6fd6 60%,#154a9e 100%)",
        boxShadow: "0 1px 3px rgba(0,0,0,.4)",
      }}
    >
      <span className="text-[19px] font-bold" style={{ color: "#fff", textShadow: "1px 1px 1px rgba(0,0,0,.4)" }}>
        $
      </span>
    </span>
  );
}

function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pb-0.5 pt-2 text-[11px] font-bold" style={{ color: "var(--pane-head-text)" }}>
      {children}
    </div>
  );
}

function Sep({ tint = "#d8d8c8" }: { tint?: string }) {
  return <div className="mx-2 my-1.5 h-px" style={{ background: tint }} />;
}

function Item({
  icon,
  label,
  onClick,
  bold,
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  bold?: boolean;
  compact?: boolean;
}) {
  const [hot, setHot] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      className={`flex w-full items-center gap-2 rounded-[2px] px-1.5 text-left ${compact ? "py-[3px]" : "py-1"}`}
      style={{
        background: hot ? "var(--select)" : "transparent",
        color: hot ? "var(--select-text)" : "var(--text)",
      }}
    >
      <span className="grid shrink-0 place-items-center" style={{ width: compact ? 20 : 24, height: compact ? 20 : 24 }}>
        {icon}
      </span>
      <span className={`truncate text-[11px] ${bold ? "font-bold" : ""}`}>{label}</span>
    </button>
  );
}

function FooterBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  const [hot, setHot] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      className="flex items-center gap-1.5 rounded-[2px] px-1.5 py-0.5 text-[11px]"
      style={{ color: "#fff", textShadow: "1px 1px 1px rgba(0,0,0,.4)", background: hot ? "rgba(255,255,255,.18)" : "transparent" }}
    >
      <span
        className="grid h-4 w-4 place-items-center"
        style={{ background: color, borderRadius: 3, border: "1px solid rgba(255,255,255,.7)" }}
      >
        <IconPower size={10} />
      </span>
      {label}
    </button>
  );
}
