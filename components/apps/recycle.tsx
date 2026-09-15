"use client";

import { useState } from "react";
import { AppShell, Badge, Btn, Panel, Table } from "@/components/ui/kit";
import { IconRecycle } from "@/components/os/icons";

const JUNK = [
  { name: "SAFEMOON_V3.token", size: "0 KB", deleted: "14/02/2026", note: "Liquidity removed by deployer" },
  { name: "elon-inu.token", size: "0 KB", deleted: "02/03/2026", note: "Team wallet sold at 4am" },
  { name: "AI-AGENT-META.token", size: "0 KB", deleted: "28/03/2026", note: "The agent was a cron job" },
  { name: "staking-rewards-42069.token", size: "0 KB", deleted: "11/04/2026", note: "APY paid in more of itself" },
  { name: "presale-allocation.pdf", size: "112 KB", deleted: "19/04/2026", note: "Never unlocked" },
];

export default function RecycleApp() {
  const [emptied, setEmptied] = useState(false);

  return (
    <AppShell className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <IconRecycle size={40} />
        <div className="mr-auto">
          <h1 className="text-[15px] font-semibold">Recycle Bin</h1>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            {emptied ? "Empty. A clean portfolio is a happy portfolio." : `${JUNK.length} items · everything else you aped into`}
          </p>
        </div>
        <Btn onClick={() => setEmptied((e) => !e)}>{emptied ? "Restore all" : "Empty Recycle Bin"}</Btn>
      </div>

      {emptied ? (
        <Panel className="grid place-items-center py-14 text-center">
          <div>
            <IconRecycle size={64} />
            <p className="mt-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>This folder is empty</p>
            <p className="mt-1 text-[11.5px]" style={{ color: "var(--text-muted)" }}>Hold something that pays you instead.</p>
          </div>
        </Panel>
      ) : (
        <Panel pad={false} className="overflow-hidden">
          <Table head={["Name", "Deleted", "Size", "Reason"]}>
            {JUNK.map((j) => (
              <tr key={j.name} style={{ borderBottom: "1px solid var(--divider)" }}>
                <td className="px-3 py-2 font-mono text-[11.5px]">{j.name}</td>
                <td className="tabular px-3 py-2" style={{ color: "var(--text-muted)" }}>{j.deleted}</td>
                <td className="tabular px-3 py-2" style={{ color: "var(--text-muted)" }}>{j.size}</td>
                <td className="px-3 py-2" style={{ color: "var(--text-secondary)" }}>{j.note}</td>
              </tr>
            ))}
          </Table>
          <div className="px-4 py-3">
            <Badge>Satire</Badge>{" "}
            <span className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>
              Fictional filenames. No real project is being named here.
            </span>
          </div>
        </Panel>
      )}
    </AppShell>
  );
}
