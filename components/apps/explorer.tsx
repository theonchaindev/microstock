"use client";

import { useState } from "react";
import { TaskBlock, TaskPane } from "@/components/ui/kit";
import { IconBack, IconChevronDown, IconFolder, IconNotepad, IconSearch } from "@/components/os/icons";
import { useSystem } from "@/components/os/system";
import { DOCS } from "@/lib/docs";

const MENUS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

const FOLDERS = [
  { id: "documents", label: "My Documents", count: DOCS.length },
  { id: "downloads", label: "Downloads", count: 0 },
  { id: "pictures", label: "My Pictures", count: 0 },
] as const;

type FolderId = (typeof FOLDERS)[number]["id"];

export default function ExplorerApp() {
  const [folder, setFolder] = useState<FolderId>("documents");
  const [sel, setSel] = useState<string | null>(null);
  const { open } = useSystem();
  const active = FOLDERS.find((f) => f.id === folder)!;
  const selected = DOCS.find((d) => d.id === sel);

  const launch = (id: string, name: string) => open("notepad", id, `${name} - Notepad`);

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
        <ToolBtn icon={<IconSearch size={13} />} label="Search" />
        <ToolBtn icon={<IconFolder size={14} />} label="Folders" />
      </div>

      {/* address bar */}
      <div className="flex shrink-0 items-center gap-1.5 px-1.5 py-1" style={{ borderBottom: "1px solid #e2e0d4" }}>
        <span className="text-[11px]" style={{ color: "var(--text-dim)" }}>Address</span>
        <div className="xp-input flex flex-1 items-center gap-1.5 py-[2px]">
          <IconFolder size={14} />
          <span className="flex-1 truncate">{active.label}</span>
          <IconChevronDown size={11} />
        </div>
        <button className="xp-btn" style={{ minWidth: 42 }}>Go</button>
      </div>

      {/* body */}
      <div className="flex min-h-0 flex-1">
        <TaskPane>
          <TaskBlock title={selected ? "File Tasks" : "Folder Tasks"}>
            {selected ? (
              <ul className="space-y-1 text-[11px]">
                <li>
                  <button className="text-left hover:underline" style={{ color: "var(--link)" }} onClick={() => launch(selected.id, selected.name)}>
                    Open this document
                  </button>
                </li>
                <li style={{ color: "var(--text-faint)" }}>Copy this file</li>
                <li style={{ color: "var(--text-faint)" }}>Delete this file</li>
              </ul>
            ) : (
              <ul className="space-y-1 text-[11px]" style={{ color: "var(--text-faint)" }}>
                <li>Make a new folder</li>
                <li>Publish this folder to the Web</li>
                <li>Share this folder</li>
              </ul>
            )}
          </TaskBlock>

          <TaskBlock title="Other Places">
            <ul className="space-y-1 text-[11px]">
              {FOLDERS.filter((f) => f.id !== folder).map((f) => (
                <li key={f.id}>
                  <button className="text-left hover:underline" style={{ color: "var(--link)" }} onClick={() => setFolder(f.id)}>
                    {f.label}
                  </button>
                </li>
              ))}
              <li>
                <button className="text-left hover:underline" style={{ color: "var(--link)" }} onClick={() => open("terminal")}>
                  My Computer
                </button>
              </li>
              <li>
                <button className="text-left hover:underline" style={{ color: "var(--link)" }} onClick={() => open("recycle")}>
                  Recycle Bin
                </button>
              </li>
            </ul>
          </TaskBlock>

          <TaskBlock title="Details">
            {selected ? (
              <div className="space-y-0.5 text-[11px]">
                <div className="font-bold">{selected.name}</div>
                <div style={{ color: "var(--text-dim)" }}>Size: {selected.size}</div>
                <div style={{ color: "var(--text-dim)" }}>Modified: {selected.modified}</div>
              </div>
            ) : (
              <div className="space-y-0.5 text-[11px]">
                <div className="font-bold">{active.label}</div>
                <div style={{ color: "var(--text-dim)" }}>File Folder</div>
                <div style={{ color: "var(--text-dim)" }}>{active.count} objects</div>
              </div>
            )}
          </TaskBlock>
        </TaskPane>

        {/* file list */}
        <div className="scroll-xp min-h-0 flex-1 overflow-auto p-2" style={{ background: "var(--content)" }}>
          {folder === "documents" ? (
            <ul className="space-y-[1px]">
              {DOCS.map((d) => {
                const on = sel === d.id;
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => setSel(d.id)}
                      onDoubleClick={() => launch(d.id, d.name)}
                      title="Double-click to open"
                      className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-2.5 px-1.5 py-1 text-left text-[11px]"
                      style={{
                        background: on ? "var(--select)" : "transparent",
                        color: on ? "var(--select-text)" : "var(--text)",
                      }}
                    >
                      <IconNotepad size={26} />
                      <span className="truncate">{d.name}</span>
                      <span className="tabular hidden sm:block" style={{ opacity: 0.7 }}>{d.modified}</span>
                      <span className="tabular w-12 text-right" style={{ opacity: 0.7 }}>{d.size}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div>
                <IconFolder size={48} />
                <p className="mt-2 text-[11px]">This folder is empty</p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-faint)" }}>
                  {folder === "downloads"
                    ? "Nothing to download — rewards arrive on their own."
                    : "No screenshots of green candles yet."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* status bar */}
      <div className="flex shrink-0 items-center gap-2 px-2 py-[3px] text-[11px]" style={{ borderTop: "1px solid #e2e0d4", color: "var(--text-dim)" }}>
        <span className="sunken flex-1 px-1.5 py-[1px]" style={{ background: "transparent", border: "1px inset #d5d2c6" }}>
          {selected ? selected.name : `${active.count} objects`}
        </span>
        <span className="sunken px-1.5 py-[1px]" style={{ background: "transparent", border: "1px inset #d5d2c6" }}>
          Double-click to open
        </span>
        <span className="sunken px-1.5 py-[1px]" style={{ background: "transparent", border: "1px inset #d5d2c6" }}>
          My Computer
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
