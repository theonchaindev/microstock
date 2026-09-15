"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { APP_LIST, PINNED_APPS } from "@/lib/apps";
import { DOCS } from "@/lib/docs";
import { AppIcon } from "@/components/apps/registry";
import { IconChevronRight, IconNotepad, IconPower, IconSearch } from "./icons";
import { useSystem } from "./system";
import { TASKBAR_H } from "./window";

export function StartMenu({ onClose, autoFocus }: { onClose: () => void; autoFocus?: boolean }) {
  const { open } = useSystem();
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const apps = useMemo(() => {
    const pool = all || q ? APP_LIST : PINNED_APPS;
    if (!q) return pool;
    const s = q.toLowerCase();
    return pool.filter((a) => a.title.toLowerCase().includes(s) || a.blurb.toLowerCase().includes(s));
  }, [all, q]);

  const docs = useMemo(() => {
    if (!q) return DOCS.slice(0, 4);
    const s = q.toLowerCase();
    return DOCS.filter((d) => d.name.toLowerCase().includes(s) || d.body.toLowerCase().includes(s)).slice(0, 4);
  }, [q]);

  const launch = (fn: () => void) => {
    fn();
    onClose();
  };

  return (
    <div
      className="anim-flyout acrylic absolute left-1/2 z-[950] w-[min(640px,calc(100vw-16px))] -translate-x-1/2 overflow-hidden rounded-lg"
      style={{ bottom: TASKBAR_H + 8, border: "1px solid var(--stroke-strong)", boxShadow: "var(--shadow-flyout)" }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5 pb-3">
        <div
          className="flex items-center gap-2.5 rounded-full px-4 py-2.5"
          style={{ background: "var(--surface-2)", border: "1px solid var(--stroke-strong)" }}
        >
          <span style={{ color: "var(--text-muted)" }}><IconSearch size={15} /></span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search apps and documents"
            className="w-full bg-transparent text-[13px] outline-none placeholder:opacity-55"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
      </div>

      <div className="scroll-fluent max-h-[min(58vh,460px)] overflow-auto px-5 pb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12.5px] font-semibold">{q ? "Results" : all ? "All apps" : "Pinned"}</span>
          {!q && (
            <button
              onClick={() => setAll((a) => !a)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] transition-colors"
              style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}
            >
              {all ? "Pinned" : "All apps"} <IconChevronRight size={11} />
            </button>
          )}
        </div>

        {apps.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
            {apps.map((a) => (
              <button
                key={a.id}
                onClick={() => launch(() => open(a.id))}
                title={a.blurb}
                className="flex flex-col items-center gap-1.5 rounded-md px-1 py-3 transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--stroke)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <AppIcon id={a.id} size={32} />
                <span className="w-full truncate text-center text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  {a.short}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-[12.5px]" style={{ color: "var(--text-muted)" }}>
            Nothing matches “{q}”.
          </p>
        )}

        {docs.length > 0 && (
          <>
            <div className="mb-2 mt-4 text-[12.5px] font-semibold">{q ? "Documents" : "Recommended"}</div>
            <div className="grid gap-1 sm:grid-cols-2">
              {docs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => launch(() => open("notepad", d.id, `${d.name} — Notepad`))}
                  className="flex items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--stroke)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <IconNotepad size={28} />
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px]">{d.name}</span>
                    <span className="block truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Modified {d.modified}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: "var(--surface-2)", borderTop: "1px solid var(--stroke)" }}
      >
        <button
          onClick={() => launch(() => open("wallet"))}
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12.5px] transition-colors"
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--stroke)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            H
          </span>
          holder
        </button>
        <button
          onClick={() => launch(() => open("settings"))}
          title="Power"
          aria-label="Power"
          className="grid h-8 w-8 place-items-center rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--stroke)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <IconPower size={15} />
        </button>
      </div>
    </div>
  );
}
