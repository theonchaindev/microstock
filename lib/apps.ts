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
  terminal: { id: "terminal", title: "Microstock Terminal", short: "Terminal", w: 980, h: 650, minW: 700, minH: 500, onDesktop: true, pinned: true, blurb: "Live price, market cap and holder payouts" },
  payouts:  { id: "payouts",  title: "Payouts",             short: "Payouts",  w: 900,  h: 620, minW: 620, minH: 460, onDesktop: true, pinned: true, blurb: "Every distribution, as it settles on-chain" },
  wallet:   { id: "wallet",   title: "My Wallet",           short: "My Wallet",   w: 700,  h: 600, minW: 540, minH: 460, onDesktop: true, pinned: true, blurb: "Connect, track your share and claim" },
  charts:   { id: "charts",   title: "Charts",              short: "Charts",   w: 880,  h: 600, minW: 600, minH: 440, pinned: true, blurb: "Price, volume and supply breakdown" },
  holders:  { id: "holders",  title: "Holders",             short: "Holders",  w: 840,  h: 580, minW: 580, minH: 420, pinned: true, blurb: "Leaderboard of the biggest bags" },
  explorer: { id: "explorer", title: "My Documents",        short: "My Documents",w: 860,  h: 560, minW: 600, minH: 400, onDesktop: true, pinned: true, blurb: "Docs, tokenomics and the audit" },
  notepad:  { id: "notepad",  title: "Notepad",             short: "Notepad",  w: 680,  h: 540, minW: 440, minH: 340, blurb: "Read the paperwork" },
  edge:     { id: "edge",     title: "Microstock Browser",  short: "Browser",  w: 920,  h: 620, minW: 600, minH: 440, onDesktop: true, pinned: true, blurb: "Links out to every official channel" },
  taskmgr:  { id: "taskmgr",  title: "Task Manager",        short: "Task Mgr", w: 780,  h: 580, minW: 580, minH: 420, blurb: "What the protocol is running right now" },
  cmd:      { id: "cmd",      title: "Command Prompt",      short: "Command",  w: 700,  h: 440, minW: 440, minH: 280, pinned: true, blurb: "Query the chain the old-fashioned way" },
  settings: { id: "settings", title: "Control Panel",       short: "Control",  w: 800,  h: 580, minW: 580, minH: 420, pinned: true, blurb: "Change the look of your desktop" },
  recycle:  { id: "recycle",  title: "Recycle Bin",         short: "Recycle Bin",  w: 700,  h: 480, minW: 500, minH: 360, onDesktop: true, blurb: "Everything else you aped into" },
};

export const APP_LIST = Object.values(APPS);
export const DESKTOP_APPS = APP_LIST.filter((a) => a.onDesktop);
export const PINNED_APPS = APP_LIST.filter((a) => a.pinned);
