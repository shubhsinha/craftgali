/**
 * The two axes of the visual system: a hue and a mode.
 *
 * A buyer picks these for their own view of Craftgali and they follow the
 * account everywhere in the shell. A seller picks them again, separately, for
 * their storefront — see `lib/hues.ts`. The two never read each other: a buyer
 * browsing in Teal still sees a Ruby storefront as its maker built it.
 */

export const HUES = [
  { id: "indigo", label: "Electric Indigo", swatch: "#6366F1" },
  { id: "ruby", label: "Ruby Crimson", swatch: "#DC2626" },
  { id: "pink", label: "Light Pink", swatch: "#EC4899" },
  { id: "teal", label: "Teal Breeze", swatch: "#14B8A6" },
] as const;

export type HueId = (typeof HUES)[number]["id"];
export type Mode = "light" | "dark";

export const DEFAULT_HUE: HueId = "indigo";
export const DEFAULT_MODE: Mode = "light";

export const HUE_KEY = "cg-hue";
export const MODE_KEY = "cg-mode";

/**
 * Runs in <head>, before first paint, so a returning visitor never sees the
 * default indigo-on-light flash before their own choice lands. It writes both
 * attributes unconditionally — the CSS keys off `[data-hue]` and `[data-mode]`
 * rather than off their absence, so there is no bare-`:root` special case.
 */
export const THEME_BOOTSTRAP = `(function(){try{var d=document.documentElement,h=localStorage.getItem(${JSON.stringify(
  HUE_KEY,
)}),m=localStorage.getItem(${JSON.stringify(MODE_KEY)});d.dataset.hue=h||${JSON.stringify(
  DEFAULT_HUE,
)};d.dataset.mode=m||${JSON.stringify(DEFAULT_MODE)}}catch(e){}})()`;
