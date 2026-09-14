import type { SkinId, SkinMode } from "./types";

/**
 * The skin catalogue.
 *
 * This is product configuration, not sample content — the four hues and which
 * of them sit behind Pro are the same for every seller, and the backend will
 * read this list too. It lives apart from `sample-data.ts` for that reason.
 */

export interface Skin {
  id: SkinId;
  name: string;
  tagline: string;
  blurb: string;
  /** Behind Pro Studio. Indigo and Ruby are on the free plan. */
  pro: boolean;
  /** The dot in the picker, and the seam across a preview card. */
  swatch: string;
}

export const SKINS: Record<SkinId, Skin> = {
  indigo: {
    id: "indigo",
    name: "Electric Indigo",
    tagline: "Cool violet glow",
    blurb: "The default. Best for mixed-media and modern canvas work.",
    pro: false,
    swatch: "#6366f1",
  },
  ruby: {
    id: "ruby",
    name: "Ruby Crimson",
    tagline: "Warm and loud",
    blurb: "Suits terracotta, brass and Madhubani work.",
    pro: false,
    swatch: "#dc2626",
  },
  pink: {
    id: "pink",
    name: "Light Pink",
    tagline: "Soft rose glass",
    blurb: "Reads well for textile, embroidery and pastel work.",
    pro: true,
    swatch: "#ec4899",
  },
  teal: {
    id: "teal",
    name: "Teal Breeze",
    tagline: "Cool and quiet",
    blurb: "Built for indigo resist, blue pottery and seascapes.",
    pro: true,
    swatch: "#14b8a6",
  },
};

/** Picker order. Free skins first, so the free plan reads as complete. */
export const SKIN_ORDER: SkinId[] = ["indigo", "ruby", "pink", "teal"];

/* ------------------------------------------------------------- heritage --- */

/**
 * The ornament layers a seller can turn on for their own shop.
 *
 * These are the craft motifs from the design system. They are per-storefront
 * because a potter and a textile workshop want very different amounts of
 * pattern behind their work.
 */
export const HERITAGE_LAYERS = [
  {
    id: "tapestry",
    label: "Tapestry backdrop",
    note: "The woven mandala-and-paisley field behind everything.",
  },
  {
    id: "medallion",
    label: "Rangoli medallion",
    note: "The 28-spoke landmark wheel, turning behind your name.",
  },
  {
    id: "toran",
    label: "Toran divider",
    note: "A garland hung above your work, the way a doorway is dressed.",
  },
  {
    id: "jali",
    label: "Jali corners",
    note: "Lattice flourishes on the corners of your header panel.",
  },
] as const;

export type HeritageId = (typeof HERITAGE_LAYERS)[number]["id"];

export type Heritage = Record<HeritageId, boolean>;

/** What a shop looks like before its owner has touched anything. */
export const DEFAULT_HERITAGE: Heritage = {
  tapestry: true,
  medallion: true,
  toran: false,
  jali: true,
};

export interface SkinDraft {
  hue: SkinId;
  mode: SkinMode;
  heritage: Heritage;
}

export const PRO_PRICE_INR = 599;

export function skinIsAvailable(id: SkinId, pro: boolean) {
  return pro || !SKINS[id].pro;
}
