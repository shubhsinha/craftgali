/**
 * A storefront's skin is a hue and a mode — the same two axes a buyer sets for
 * their own view, chosen again by the artist for their shop. Pink and Teal sit
 * behind Pro Studio; Indigo and Ruby are on the free plan.
 */
export type SkinId = "indigo" | "ruby" | "pink" | "teal";

export type SkinMode = "light" | "dark";

export type Stream = "art" | "decor";

/** How the piece changes hands. Craftgali never sits in the middle. §3.4 */
export type Handover = "in-person" | "seller-courier" | "buyer-pickup";

/** The long-form half of a listing — the story panel and the spec strip. §5.1 */
export interface PieceDetail {
  /** The maker's own account of the piece. Rendered verbatim, one <p> each. */
  story: string[];
  hours?: number;
  materials: string;
  edition: string;
  framing?: string;
  /** Extra photo seeds for the thumbnail strip, beyond the piece's own. */
  gallery?: number[];
  /** True when the studio has uploaded a making-of clip. */
  makingOf?: boolean;
  meetNote?: string;
  courierNote?: string;
}

export interface Piece {
  id: string;
  slug: string;
  title: string;
  /** Photo seed, for the seeded comp pieces that have no uploads. */
  seed: number;
  /** Uploaded photos, newest listings first. Empty for the comp pieces. */
  photoIds?: string[];
  priceInr: number;
  /** Set when the piece has sold; the card renders the archive treatment. */
  soldForInr?: number;
  medium: string;
  dimensions: string;
  year?: number;
  stream: Stream;
  distanceKm?: number;
  /** The shop's city, from lib/cities.ts. Drives the distance a buyer sees. */
  citySlug?: string;
  studio: { name: string; handle: string };
  badges?: string[];
  /** Higher-value pieces invite an offer instead of a straight message. */
  negotiable?: boolean;
  /** The studio passed the 20-second studio-video check. §3.2 */
  verifiedMaker: boolean;
  /** Declared by the seller at listing time; buyers can filter it out. */
  aiAssisted?: boolean;
  handover: Handover[];
  detail?: PieceDetail;
  /** Cards are laid out in a masonry column; this drives the card's height. */
  aspect?: number;
}

export interface Studio {
  handle: string;
  name: string;
  artist: string;
  /** What the shop is called in a sentence: "Message Anaya", "Ask Nilambari". */
  shortName: string;
  city: string;
  /** The city's slug in lib/cities.ts — what distance is measured from. */
  citySlug?: string;
  neighbourhood?: string;
  discipline: string;
  skin: SkinId;
  /** The storefront's own mode, independent of what the buyer has chosen. */
  mode?: SkinMode;
  seed: number;
  verifiedMaker: boolean;
  /** ID-checked as well as studio-video checked, which few studios are. */
  verifiedArtist?: boolean;
  tier?: string;
  joined?: number;
  /** Storefront copy. The quote is the artist's own line, set in the skin's serif. */
  quote?: string;
  blurb?: string;
  /** Reads under the name: "Pune, Maharashtra · since 2023". */
  place?: string;
  /** Cover photo seed for the storefront hero, if the shop has set one. */
  cover?: number;
  /** Uploaded cover and avatar, served from /api/media/[id]. Real shops only. */
  coverId?: string;
  avatarId?: string;
  /** The published ornament toggles. Comp studios take the default. */
  heritage?: Record<string, boolean>;
  /** The storefront's own filter rail — the artist names their own groupings. */
  collections?: string[];
  wall?: { question: string; answered: string }[];
  stats: {
    live: number;
    sold: number;
    /* Ratings are derived from the `reviews` table, never stated here — see
       lib/reviews.ts. Anything quoted in this file is design comp content. */
    repliesIn: string;
  };
}

/** The discovery rails. `everything` is the union; the last two are not open yet. */
export type StreamId = "everything" | "art" | "decor" | "pre-loved" | "auctions";

export interface DiscoverStream {
  id: StreamId;
  label: string;
  href: string;
  /** Feed heading — "Discover" for the union, the stream's own name otherwise. */
  heading: string;
  count?: number;
  /** Which pieces the stream draws; unset means the stream has no inventory yet. */
  streams?: Stream[];
  /** Shown in place of the grid while a stream is still closed. */
  awaiting?: string;
}
