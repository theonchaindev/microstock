"use client";

import { useState } from "react";
import { AppShell, Badge } from "@/components/ui/kit";
import { IconChevronRight, IconFolder, IconNotepad } from "@/components/os/icons";
import { useSystem } from "@/components/os/system";
import { DOCS } from "@/lib/docs";

const FOLDERS = [
  { id: "documents", label: "Documents", count: DOCS.length },
  { id: "downloads", label: "Downloads", count: 0 },
  { id: "pictures", label: "Pictures", count: 0 },
] as const;

type FolderId = (typeof FOLDERS)[number]["id"];

export default function ExplorerApp() {
  const [folder, setFolder] = useState<FolderId>("documents");
  const { open } = useSystem();
  const active = FOLDERS.find((f) => f.id === folder)!;

  return (
    <div className="flex h-full min-h-0">
      <nav className="w-[186px] shrink-0 border-r p-2" style={{ borderColor: "var(--divider)" }}>
        <div className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.07em]" style={{ color: "var(--text-muted)" }}>
          This PC
        </div>
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFolder(f.id)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[12.5px] transition-colors"
            style={{
              background: folder === f.id ? "var(--surface-3)" : "transparent",
              color: folder === f.id ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            <IconFolder size={18} />
            <span className="truncate">{f.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5 border-b px-4 py-2.5 text-[12px]" style={{ borderColor: "var(--divider)", color: "var(--text-secondary)" }}>
          <span>This PC</span>
          <IconChevronRight size={12} />
          <span style={{ color: "var(--text-primary)" }}>{active.label}</span>
          <span className="ml-auto" style={{ color: "var(--text-muted)" }}>{active.count} items</span>
        </div>

        <AppShell className="min-h-0 flex-1 overflow-auto">
          {folder === "documents" ? (
            <ul className="space-y-1">
              {DOCS.map((d) => (
                <li key={d.id}>
                  <button
                    onDoubleClick={() => open("notepad", d.id, `${d.name} — Notepad`)}
                    onClick={(e) => e.detail === 0 && open("notepad", d.id, `${d.name} — Notepad`)}
                    className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-md px-2.5 py-2 text-left text-[12.5px] transition-colors hover:brightness-125"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    title="Double-click to open"
                  >
                    <IconNotepad size={26} />
                    <span className="truncate">{d.name}</span>
                    <span className="tabular hidden sm:block" style={{ color: "var(--text-muted)" }}>{d.modified}</span>
                    <span className="tabular w-14 text-right" style={{ color: "var(--text-muted)" }}>{d.size}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div>
                <IconFolder size={56} />
                <p className="mt-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>This folder is empty</p>
                <p className="mt-1 text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                  {folder === "downloads" ? "Nothing to download — rewards arrive on their own." : "No screenshots of green candles yet."}
                </p>
              </div>
            </div>
          )}
        </AppShell>

        <div className="flex items-center gap-2 border-t px-4 py-2 text-[11.5px]" style={{ borderColor: "var(--divider)", color: "var(--text-muted)" }}>
          <Badge>Read-only</Badge>
          <span>Double-click a document to open it in Notepad</span>
        </div>
      </div>
    </div>
  );
}
