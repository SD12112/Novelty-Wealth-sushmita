// Novelty Wealth color tokens — light + dark.
// Light is the primary brand surface (navy ink + gold accent).

export type Theme = {
  mode: "light" | "dark";
  ink: string;        // primary text
  navy: string;       // brand navy
  surface: string;    // app background
  card: string;       // card surface
  line: string;       // borders
  slate: string;      // secondary text
  gold: string;       // brand accent
  goldSoft: string;   // gold tint backgrounds
  grey: string;       // neutral chart
  green: string;      // positive
  red: string;        // negative
  redSoft: string;    // red tint background
  shellBg: string;    // device shell background
  trackOnDark: string;
  posText: string;    // positive-on-dark text
  negText: string;    // negative-on-dark text
  subOnDark: string;  // muted text on navy hero
};

export const lightTheme: Theme = {
  mode: "light",
  ink: "#0E1726",
  navy: "#16223A",
  surface: "#F4F6F9",
  card: "#FFFFFF",
  line: "#E5E9F0",
  slate: "#5B6472",
  gold: "#B8902F",
  goldSoft: "#FBF3DE",
  grey: "#9AA6BC",
  green: "#1F8A5B",
  red: "#C2492E",
  redSoft: "#FBEAE5",
  shellBg: "#DDE2EA",
  trackOnDark: "#243152",
  posText: "#7FE3B0",
  negText: "#F0A48F",
  subOnDark: "#A9B4C7",
};

export const darkTheme: Theme = {
  mode: "dark",
  ink: "#F2F4F8",
  navy: "#0B1424",
  surface: "#0E1726",
  card: "#16223A",
  line: "#22304E",
  slate: "#9AA6BC",
  gold: "#D4A33A",
  goldSoft: "#3A2E13",
  grey: "#5B6472",
  green: "#3CCB87",
  red: "#E37657",
  redSoft: "#3A1E15",
  shellBg: "#05080F",
  trackOnDark: "#1B2540",
  posText: "#7FE3B0",
  negText: "#F0A48F",
  subOnDark: "#A9B4C7",
};
