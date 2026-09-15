/** App metadata only — no components, so the window store can import it freely. */

export type AppId =
  | "terminal"
  | "payouts"
  | "wallet"
  | "charts"
  | "holders"
  | "explorer"
  | "notepad"
  | "edge"
  | "taskmgr"
  | "cmd"
  | "settings"
  | "recycle";

export type AppMeta = {
  id: AppId;
  title: string;
  short: string;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  onDesktop?: boolean;
  pinned?: boolean;
  blurb: string;
};

export const APPS: Record<AppId, AppMeta> = {
  terminal: { id: "terminal", title: "Microstock Terminal", short: "Terminal", w: 1020, h: 680, minW: 720, minH: 520, onDesktop: true, pinned: true, blurb: "Live price, market cap and holder payouts" },
  payouts:  { id: "payouts",  title: "Payouts",             short: "Payouts",  w: 940,  h: 640, minW: 640, minH: 480, onDesktop: true, pinned: true, blurb: "Every distribution, as it settles on-chain" },
  wallet:   { id: "wallet",   title: "Wallet",              short: "Wallet",   w: 720,  h: 620, minW: 560, minH: 480, onDesktop: true, pinned: true, blurb: "Connect, track your share and claim" },
  charts:   { id: "charts",   title: "Charts",              short: "Charts",   w: 900,  h: 620, minW: 620, minH: 460, pinned: true, blurb: "Price, volume and supply breakdown" },
  holders:  { id: "holders",  title: "Holders",             short: "Holders",  w: 860,  h: 600, minW: 600, minH: 440, pinned: true, blurb: "Leaderboard of the biggest bags" },
  explorer: { id: "explorer", title: "File Explorer",       short: "Explorer", w: 880,  h: 580, minW: 620, minH: 420, onDesktop: true, pinned: true, blurb: "Docs, tokenomics and the audit" },
  notepad:  { id: "notepad",  title: "Notepad",             short: "Notepad",  w: 700,  h: 560, minW: 460, minH: 360, blurb: "Read the paperwork" },
  edge:     { id: "edge",     title: "Microstock Edge",     short: "Edge",     w: 940,  h: 640, minW: 620, minH: 460, pinned: true, blurb: "Links out to every official channel" },
  taskmgr:  { id: "taskmgr",  title: "Task Manager",        short: "Tasks",    w: 800,  h: 600, minW: 600, minH: 440, blurb: "What the protocol is running right now" },
  cmd:      { id: "cmd",      title: "Command Prompt",      short: "Command",  w: 720,  h: 460, minW: 460, minH: 300, pinned: true, blurb: "Query the chain the old-fashioned way" },
  settings: { id: "settings", title: "Settings",            short: "Settings", w: 820,  h: 600, minW: 600, minH: 440, pinned: true, blurb: "Personalise your desktop" },
  recycle:  { id: "recycle",  title: "Recycle Bin",         short: "Bin",      w: 720,  h: 500, minW: 520, minH: 380, onDesktop: true, blurb: "Everything else you aped into" },
};

export const APP_LIST = Object.values(APPS);
export const DESKTOP_APPS = APP_LIST.filter((a) => a.onDesktop);
export const PINNED_APPS = APP_LIST.filter((a) => a.pinned);
