"use client";

import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps";
import {
  IconActivity,
  IconCharts,
  IconCmd,
  IconFolder,
  IconGear,
  IconGlobe,
  IconHolders,
  IconNotepad,
  IconPayouts,
  IconRecycle,
  IconTerminalApp,
  IconWallet,
} from "@/components/os/icons";

import TerminalApp from "./terminal";
import PayoutsApp from "./payouts";
import WalletApp from "./wallet";
import ChartsApp from "./charts";
import HoldersApp from "./holders";
import ExplorerApp from "./explorer";
import NotepadApp from "./notepad";
import EdgeApp from "./edge";
import TaskManagerApp from "./taskmgr";
import CmdApp from "./cmd";
import SettingsApp from "./settings";
import RecycleApp from "./recycle";

type AppComponent = ComponentType<{ payload?: string }>;
type Entry = { Component: AppComponent; Icon: ComponentType<{ size?: number; className?: string }> };

export const REGISTRY: Record<AppId, Entry> = {
  terminal: { Component: TerminalApp, Icon: IconTerminalApp },
  payouts: { Component: PayoutsApp, Icon: IconPayouts },
  wallet: { Component: WalletApp, Icon: IconWallet },
  charts: { Component: ChartsApp, Icon: IconCharts },
  holders: { Component: HoldersApp, Icon: IconHolders },
  explorer: { Component: ExplorerApp, Icon: IconFolder },
  notepad: { Component: NotepadApp, Icon: IconNotepad },
  edge: { Component: EdgeApp, Icon: IconGlobe },
  taskmgr: { Component: TaskManagerApp, Icon: IconActivity },
  cmd: { Component: CmdApp, Icon: IconCmd },
  settings: { Component: SettingsApp, Icon: IconGear },
  recycle: { Component: RecycleApp, Icon: IconRecycle },
};

export const AppIcon = ({ id, size = 24 }: { id: AppId; size?: number }) => {
  const { Icon } = REGISTRY[id];
  return <Icon size={size} />;
};
