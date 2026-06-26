// Mock data for Aarav (MF only) and Meera (Stocks + F&O) — mirrors the prototype.

import { Theme } from "./theme";

export type TileMetric =
  | { kind: "ring"; pct: number; color: "green" | "gold" }
  | { kind: "frac"; a: number; b: number }
  | { kind: "amt"; v: string; color?: "red" | "ink" };

export type Tile = {
  id: string;
  icon: "sip" | "tax" | "goal" | "warn" | "up";
  title: string;
  sub: string;
  tone: "good" | "warn" | "info";
  metric: TileMetric;
  to: string;
};

export type MixSlice = { label: string; pct: number; color: keyof Theme };

export type Profile = {
  key: "aarav" | "meera";
  name: string;
  short: string;
  value: number;
  day: number;
  pct: number;
  up: boolean;
  mix: MixSlice[];
  insightHeadline: string;
  insightCta: string;
  insightTo: string;
  tiles: Tile[];
  gated: string;
  pulse: string;
};

export const PROFILES: Record<"aarav" | "meera", Profile> = {
  aarav: {
    key: "aarav",
    name: "Aarav",
    short: "MF only",
    value: 482140,
    day: 3210,
    pct: 0.67,
    up: true,
    mix: [
      { label: "Equity", pct: 70, color: "gold" },
      { label: "Debt", pct: 30, color: "grey" },
    ],
    insightHeadline: "Your debt mix is quietly capping your growth.",
    insightCta: "Model it",
    insightTo: "rebalance",
    tiles: [
      { id: "sip", icon: "sip", title: "SIPs", sub: "1 failed", tone: "warn", metric: { kind: "frac", a: 2, b: 3 }, to: "sip" },
      { id: "tax", icon: "tax", title: "80C left", sub: "unused", tone: "info", metric: { kind: "amt", v: "₹40k" }, to: "tax" },
      { id: "goal", icon: "goal", title: "Retire 2040", sub: "on track", tone: "good", metric: { kind: "ring", pct: 62, color: "green" }, to: "goal" },
    ],
    gated: "Full rebalancing plan",
    pulse: "Quiet today — SIPs are doing the work.",
  },
  meera: {
    key: "meera",
    name: "Meera",
    short: "Stocks + F&O",
    value: 1840920,
    day: -12460,
    pct: -0.67,
    up: false,
    mix: [
      { label: "Stocks", pct: 45, color: "navy" },
      { label: "MF", pct: 40, color: "gold" },
      { label: "F&O", pct: 15, color: "red" },
    ],
    insightHeadline: "F&O has drifted past your own risk line.",
    insightCta: "Review it",
    insightTo: "fno",
    tiles: [
      { id: "fno", icon: "warn", title: "F&O", sub: "limit 10%", tone: "warn", metric: { kind: "amt", v: "15%", color: "red" }, to: "fno" },
      { id: "book", icon: "up", title: "Near highs", sub: "book?", tone: "info", metric: { kind: "amt", v: "3" }, to: "book" },
      { id: "goal", icon: "goal", title: "House 2028", sub: "behind", tone: "warn", metric: { kind: "ring", pct: 58, color: "gold" }, to: "goal" },
    ],
    gated: "Nova fund score & rebalancing",
    pulse: "F&O slipped below your risk line today.",
  },
};

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const lakh = (n: number) => "₹" + (n / 100000).toFixed(1) + "L";
export const fv = (m: number, y: number, r: number) =>
  m * ((Math.pow(1 + r / 12, y * 12) - 1) / (r / 12)) * (1 + r / 12);
export const blended = (equityPct: number) =>
  (equityPct / 100) * 0.12 + (1 - equityPct / 100) * 0.07;
