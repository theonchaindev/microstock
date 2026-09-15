"use client";

import { DOC_BY_ID, DOCS } from "@/lib/docs";

const MENUS = ["File", "Edit", "Format", "View", "Help"];

export default function NotepadApp({ payload }: { payload?: string }) {
  const doc = (payload && DOC_BY_ID[payload]) || DOCS[0];
  const lines = doc.body.split("\n").length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-1 border-b px-2 py-1" style={{ borderColor: "#e2e0d4" }}>
        {MENUS.map((m) => (
          <span
            key={m}
            className="cursor-default rounded px-2 py-1 text-[11px] transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--content-alt)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {m}
          </span>
        ))}
      </div>

      <div className="scroll-xp min-h-0 flex-1 overflow-auto p-4">
        <pre className="m-0 whitespace-pre-wrap font-mono text-[11px] leading-[1.65] select-text" style={{ color: "var(--text)" }}>
          {doc.body}
        </pre>
      </div>

      <div className="flex items-center justify-end gap-6 border-t px-4 py-1.5 text-[11px]" style={{ borderColor: "#e2e0d4", color: "var(--text-faint)" }}>
        <span className="tabular">Ln {lines}, Col 1</span>
        <span>100%</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
