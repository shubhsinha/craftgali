import { SKIN_ORDER } from "./skins";
import type { DiscoverStream, Piece, Studio } from "./types";

/**
 * Content carried over from the design comps. This is the fallback the pages
 * render from until the Go API has real rows; `lib/api.ts` prefers the API and
 * falls back here so the site is never blank in development.
 */

export const STUDIOS: Studio[] = [
  {
    handle: "anaya",
    name: "Anaya Deshpande",
    artist: "Anaya Deshpande",
    shortName: "Anaya",
    city: "Pune",
    citySlug: "pune",
    discipline: "Oil & acrylic",
    skin: "indigo",
    seed: 201,
    verifiedMaker: true,
    tier: "Diamond · Founding #3,214",
    joined: 2023,
    place: "Pune, Maharashtra · since 2023",
    quote:
      "I paint the twenty minutes after it stops raining, when the light is doing something it will not do again.",
    collections: ["All work", "Monsoon Series", "Small works under ₹3,000", "Sold archive"],
    wall: [
      { question: "Do you take commissions for a 4ft canvas?", answered: "2 hours ago" },
      { question: "Is the Monsoon Series varnished?", answered: "yesterday" },
    ],
    stats: { live: 31, sold: 64, repliesIn: "2h" },
  },
  {
    handle: "meera",
    name: "Meera's Clay Atelier",
    artist: "Meera Iyer",
    shortName: "Meera",
    city: "Mumbai",
    citySlug: "mumbai",
    neighbourhood: "Bandra West",
    discipline: "Stoneware",
    skin: "ruby",
    seed: 107,
    verifiedMaker: true,
    tier: "Gold · Founding #6,801",
    joined: 2022,
    place: "Bandra West, Mumbai · 1.4 km away",
    cover: 140,
    quote:
      "Crafting slow-made stoneware ceramics right in the neighbourhood — shipped with pride across the globe.",
    blurb:
      "Everything here is wheel-thrown in a converted garage off Chapel Road, fired twice, glazed with ash and iron oxide. Nothing is ever made twice the same way. If you want a set, tell me and I'll throw it as a set.",
    collections: ["All work", "Tableware", "One-off vessels", "Seconds shelf", "Sold archive"],
    wall: [
      { question: "Are these food safe and dishwasher safe?", answered: "40 minutes ago" },
      { question: "Do you fire in winter?", answered: "last week" },
    ],
    stats: { live: 18, sold: 112, repliesIn: "40m" },
  },
  {
    handle: "nilambari",
    name: "Nilambari Handloom",
    artist: "Nilambari Collective",
    shortName: "Nilambari",
    city: "Kutch",
    citySlug: "bhuj",
    discipline: "Indigo resist",
    skin: "teal",
    mode: "dark",
    seed: 310,
    verifiedMaker: true,
    joined: 2024,
    place: "Bhuj, Kutch · Gujarat · working since 1998",
    verifiedArtist: true,
    tier: "Diamond · Founding #412",
    blurb:
      "Three generations of Ajrakh resist printing. Every panel is block-printed by hand, then buried in natural indigo eight to sixteen times. The blue gets deeper each dip and no two dips agree.",
    collections: ["All work", "Ajrakh panels", "Yardage", "Sold archive"],
    wall: [
      { question: "Will the indigo bleed on a first wash?", answered: "1 hour ago" },
      { question: "Can you print a 3 m panel to order?", answered: "3 days ago" },
    ],
    stats: { live: 24, sold: 76, repliesIn: "3h" },
  },
  {
    handle: "kumbhcraft",
    name: "Kumbh Craft House",
    artist: "Kumbh Craft House",
    shortName: "Kumbh Craft",
    city: "Jaipur",
    citySlug: "jaipur",
    discipline: "Brass & terracotta",
    skin: "pink",
    seed: 409,
    verifiedMaker: false,
    joined: 2023,
    place: "Jaipur · 0.5 km away",
    cover: 409,
    quote: "Four brothers, one furnace, since 1986.",
    blurb:
      "A 90-second clip of the pour, the cooling, and the tuning file. Everything on this shelf is cast, turned or fired within four streets of the shop.",
    collections: [
      "All work",
      "Lanterns",
      "Toran & hangings",
      "Brass bells",
      "Under ₹1,000",
      "Sold archive",
    ],
    wall: [
      { question: "Do the diyas come painted or plain?", answered: "1 hour ago" },
      { question: "Can I collect from the workshop directly?", answered: "2 days ago" },
    ],
    stats: { live: 42, sold: 203, repliesIn: "1h" },
  },
  {
    handle: "priya",
    name: "Priya Atelier",
    artist: "Priya Menon",
    shortName: "Priya",
    city: "Kochi",
    citySlug: "kochi",
    discipline: "Watercolour",
    skin: "indigo",
    seed: 102,
    verifiedMaker: true,
    joined: 2024,
    stats: { live: 12, sold: 29, repliesIn: "5h" },
  },
  {
    handle: "sunita",
    name: "Sunita Kumari",
    artist: "Sunita Kumari",
    shortName: "Sunita",
    city: "Bhagalpur",
    citySlug: "bhagalpur",
    discipline: "Macramé & jute",
    skin: "pink",
    seed: 411,
    verifiedMaker: false,
    joined: 2025,
    stats: { live: 9, sold: 14, repliesIn: "1d" },
  },
  {
    handle: "vikram",
    name: "Vikram Rao",
    artist: "Vikram Rao",
    shortName: "Vikram",
    city: "Mysuru",
    citySlug: "mysuru",
    discipline: "Reclaimed teak",
    skin: "ruby",
    seed: 512,
    verifiedMaker: true,
    joined: 2022,
    stats: { live: 7, sold: 38, repliesIn: "6h" },
  },
];

export const PIECES: Piece[] = [
  {
    id: "p-101",
    slug: "monsoon-serenade-in-oils",
    title: "Monsoon Serenade in Oils",
    seed: 101,
    priceInr: 3400,
    medium: "Oil on linen",
    dimensions: "90×60 cm",
    year: 2026,
    stream: "art",
    distanceKm: 1.2,
    studio: { name: "Anaya Deshpande", handle: "anaya" },
    badges: ["Verified maker"],
    verifiedMaker: true,
    handover: ["in-person", "seller-courier"],
    detail: {
      story: [
        "I started this on the 4th of July, the first real day of the monsoon in Pune, sitting under the awning of a chai stall on Baner Road because I couldn't get home. The colour of wet tarmac at that hour is not grey. It's a warm violet with orange sodium light sitting on top of it, and it lasts about twenty minutes.",
        "Nine sittings, two of them scraped back entirely. The final glaze layer is Prussian blue over burnt sienna, which is what gives the puddles their depth. Unframed — I'd rather you choose the frame than pay me to guess.",
      ],
      hours: 38,
      materials: "Oil, linen",
      edition: "One of one",
      framing: "unframed",
      gallery: [151, 152, 153],
      makingOf: true,
      meetNote: "Suggested: Westend Mall atrium — a Safe Exchange Zone",
      courierNote: "Rolled in a tube, ~₹450 within India",
    },
    aspect: 1.4,
  },
  {
    id: "p-107",
    slug: "hand-thrown-ceramic-vessel",
    title: "Hand-Thrown Ceramic Vessel",
    seed: 107,
    priceInr: 1600,
    medium: "Stoneware, ash glaze",
    dimensions: "24 cm tall",
    stream: "decor",
    distanceKm: 1.8,
    studio: { name: "Meera's Clay Atelier", handle: "meera" },
    verifiedMaker: true,
    handover: ["in-person", "buyer-pickup"],
    aspect: 1,
  },
  {
    id: "p-102",
    slug: "botanical-watercolours",
    title: "Botanical Watercolours, set of three",
    seed: 102,
    priceInr: 1200,
    medium: "Watercolour",
    dimensions: "30×40 cm each",
    stream: "art",
    distanceKm: 2.4,
    studio: { name: "Priya Atelier", handle: "priya" },
    verifiedMaker: true,
    aiAssisted: true,
    handover: ["in-person", "seller-courier"],
    aspect: 1.24,
  },
  {
    id: "p-109",
    slug: "brass-terracotta-lantern",
    title: "Brass & Terracotta Lantern",
    seed: 109,
    priceInr: 2100,
    medium: "Brass, terracotta",
    dimensions: "38 cm",
    stream: "decor",
    distanceKm: 0.5,
    studio: { name: "Kumbh Craft House", handle: "kumbhcraft" },
    badges: ["One of one"],
    verifiedMaker: false,
    handover: ["in-person"],
    aspect: 1.12,
  },
  {
    id: "p-310",
    slug: "ajrakh-resist-wall-panel",
    title: "Ajrakh Resist Wall Panel",
    seed: 310,
    priceInr: 8900,
    medium: "Natural indigo",
    dimensions: "70×110 cm",
    stream: "decor",
    distanceKm: 4.1,
    studio: { name: "Nilambari Handloom", handle: "nilambari" },
    negotiable: true,
    verifiedMaker: true,
    handover: ["in-person", "seller-courier", "buyer-pickup"],
    aspect: 0.92,
  },
  {
    id: "p-411",
    slug: "knotted-jute-wall-hanging",
    title: "Knotted Jute Wall Hanging",
    seed: 411,
    priceInr: 1850,
    medium: "Macramé, jute",
    dimensions: "60×95 cm",
    stream: "decor",
    distanceKm: 3.3,
    studio: { name: "Sunita Kumari", handle: "sunita" },
    verifiedMaker: false,
    handover: ["in-person", "buyer-pickup"],
    aspect: 1.32,
  },
  {
    id: "p-512",
    slug: "teak-offcut-sculpture-no-4",
    title: "Teak Offcut Sculpture, No. 4",
    seed: 512,
    priceInr: 4600,
    medium: "Reclaimed teak",
    dimensions: "42 cm",
    stream: "decor",
    distanceKm: 6.8,
    studio: { name: "Vikram Rao", handle: "vikram" },
    verifiedMaker: true,
    handover: ["in-person"],
    aspect: 1.06,
  },

  /* --- Anaya Deshpande · Electric Indigo ------------------------------------------ */
  {
    id: "p-131",
    slug: "wet-tarmac-baner-road",
    title: "Wet Tarmac, Baner Road",
    seed: 131,
    priceInr: 16000,
    medium: "Oil on linen",
    dimensions: "120×80 cm",
    year: 2026,
    stream: "art",
    distanceKm: 1.2,
    studio: { name: "Anaya Deshpande", handle: "anaya" },
    negotiable: true,
    verifiedMaker: true,
    handover: ["in-person", "seller-courier"],
    aspect: 1.3,
  },
  {
    id: "p-132",
    slug: "study-for-a-grey-afternoon",
    title: "Study for a Grey Afternoon",
    seed: 132,
    priceInr: 2600,
    medium: "Oil on board",
    dimensions: "30×25 cm",
    year: 2025,
    stream: "art",
    distanceKm: 1.2,
    studio: { name: "Anaya Deshpande", handle: "anaya" },
    verifiedMaker: true,
    handover: ["in-person", "seller-courier"],
    aspect: 1.15,
  },
  {
    id: "p-133",
    slug: "aundh-balcony-six-am",
    title: "Aundh Balcony, Six a.m.",
    seed: 133,
    priceInr: 5800,
    medium: "Acrylic on canvas",
    dimensions: "60×60 cm",
    year: 2026,
    stream: "art",
    distanceKm: 1.2,
    studio: { name: "Anaya Deshpande", handle: "anaya" },
    verifiedMaker: true,
    handover: ["in-person", "seller-courier"],
    aspect: 1,
  },
  {
    id: "p-134",
    slug: "two-umbrellas-one-rickshaw",
    title: "Two Umbrellas, One Rickshaw",
    seed: 134,
    priceInr: 9200,
    medium: "Oil on canvas",
    dimensions: "75×50 cm",
    year: 2025,
    stream: "art",
    distanceKm: 1.2,
    studio: { name: "Anaya Deshpande", handle: "anaya" },
    negotiable: true,
    verifiedMaker: true,
    handover: ["in-person", "seller-courier"],
    aspect: 1.28,
  },
  {
    id: "p-135",
    slug: "kharadi-skyline-in-rain",
    title: "Kharadi Skyline in Rain",
    seed: 135,
    priceInr: 14500,
    soldForInr: 14500,
    medium: "Oil on canvas",
    dimensions: "100×70 cm",
    year: 2025,
    stream: "art",
    studio: { name: "Anaya Deshpande", handle: "anaya" },
    verifiedMaker: true,
    handover: ["in-person"],
    aspect: 1.34,
  },

  /* --- Meera's Clay Atelier · Ruby Crimson -------------------------------------- */
  {
    id: "p-141",
    slug: "ash-glaze-bowl-set-of-three",
    title: "Ash-Glaze Bowl, Set of Three",
    seed: 141,
    priceInr: 2900,
    medium: "Stoneware, ash glaze",
    dimensions: "16 cm across",
    year: 2026,
    stream: "decor",
    distanceKm: 1.4,
    studio: { name: "Meera's Clay Atelier", handle: "meera" },
    verifiedMaker: true,
    handover: ["in-person", "buyer-pickup"],
    aspect: 0.86,
  },
  {
    id: "p-142",
    slug: "chapel-road-tumbler-pair",
    title: "Chapel Road Tumbler, Pair",
    seed: 142,
    priceInr: 1150,
    medium: "Stoneware, iron oxide",
    dimensions: "11 cm tall",
    year: 2026,
    stream: "decor",
    distanceKm: 1.4,
    studio: { name: "Meera's Clay Atelier", handle: "meera" },
    verifiedMaker: true,
    handover: ["in-person", "buyer-pickup"],
    aspect: 1.1,
  },
  {
    id: "p-143",
    slug: "iron-oxide-serving-platter",
    title: "Iron-Oxide Serving Platter",
    seed: 143,
    priceInr: 3600,
    medium: "Stoneware, twice fired",
    dimensions: "38 cm across",
    year: 2025,
    stream: "decor",
    distanceKm: 1.4,
    studio: { name: "Meera's Clay Atelier", handle: "meera" },
    verifiedMaker: true,
    handover: ["in-person", "seller-courier"],
    aspect: 0.78,
  },
  {
    id: "p-144",
    slug: "tilted-jar-seconds-shelf",
    title: "Tilted Jar, Seconds Shelf",
    seed: 144,
    priceInr: 800,
    soldForInr: 800,
    medium: "Stoneware, ash glaze",
    dimensions: "27 cm tall",
    year: 2025,
    stream: "decor",
    studio: { name: "Meera's Clay Atelier", handle: "meera" },
    verifiedMaker: true,
    handover: ["buyer-pickup"],
    aspect: 1.22,
  },

  /* --- Nilambari Handloom · Teal Breeze ----------------------------------------- */
  {
    id: "p-312",
    slug: "sixteen-dip-yardage",
    title: "Sixteen-Dip Yardage",
    seed: 312,
    priceInr: 5400,
    medium: "Cotton, natural indigo",
    dimensions: "2.5 m",
    year: 2026,
    stream: "decor",
    distanceKm: 4.1,
    studio: { name: "Nilambari Handloom", handle: "nilambari" },
    verifiedMaker: true,
    handover: ["seller-courier", "buyer-pickup"],
    aspect: 1.46,
  },
  {
    id: "p-313",
    slug: "block-print-sampler-framed",
    title: "Block-Print Sampler, Framed",
    seed: 313,
    priceInr: 2700,
    medium: "Indigo, madder",
    dimensions: "40×40 cm",
    year: 2025,
    stream: "decor",
    distanceKm: 4.1,
    studio: { name: "Nilambari Handloom", handle: "nilambari" },
    verifiedMaker: true,
    handover: ["seller-courier"],
    aspect: 1,
  },
  {
    id: "p-314",
    slug: "kutch-nine-square-quilt",
    title: "Kutch Nine-Square Quilt",
    seed: 314,
    priceInr: 21000,
    soldForInr: 19500,
    medium: "Indigo, cotton",
    dimensions: "150×200 cm",
    year: 2024,
    stream: "decor",
    studio: { name: "Nilambari Handloom", handle: "nilambari" },
    verifiedMaker: true,
    handover: ["seller-courier"],
    aspect: 1.36,
  },

  /* --- Kumbh Craft House · Kesar ----------------------------------------- */
  {
    id: "p-410",
    slug: "mirror-work-toran-5ft",
    title: "Mirror-Work Toran, 5 ft",
    seed: 410,
    priceInr: 1400,
    medium: "Cotton, mirror, lac",
    dimensions: "152 cm",
    year: 2026,
    stream: "decor",
    distanceKm: 0.5,
    studio: { name: "Kumbh Craft House", handle: "kumbhcraft" },
    verifiedMaker: false,
    handover: ["in-person", "seller-courier"],
    aspect: 1.1,
  },
  {
    id: "p-414",
    slug: "temple-bell-hand-cast",
    title: "Temple Bell, Hand-Cast",
    seed: 414,
    priceInr: 3200,
    medium: "Bell brass",
    dimensions: "22 cm · 1.9 kg",
    year: 2026,
    stream: "decor",
    distanceKm: 0.5,
    studio: { name: "Kumbh Craft House", handle: "kumbhcraft" },
    verifiedMaker: false,
    handover: ["in-person", "buyer-pickup"],
    aspect: 1.55,
  },
  {
    id: "p-412",
    slug: "lac-turned-candle-pair",
    title: "Lac-Turned Candle Pair",
    seed: 412,
    priceInr: 950,
    medium: "Lac on mango wood",
    dimensions: "18 cm",
    year: 2025,
    stream: "decor",
    distanceKm: 0.5,
    studio: { name: "Kumbh Craft House", handle: "kumbhcraft" },
    verifiedMaker: false,
    handover: ["in-person", "seller-courier"],
    aspect: 1.24,
  },
  {
    id: "p-413",
    slug: "terracotta-diya-set-of-twelve",
    title: "Terracotta Diya Set of Twelve",
    seed: 413,
    priceInr: 700,
    medium: "Terracotta, hand-painted",
    dimensions: "7 cm each",
    year: 2026,
    stream: "decor",
    distanceKm: 0.5,
    studio: { name: "Kumbh Craft House", handle: "kumbhcraft" },
    verifiedMaker: false,
    handover: ["in-person", "seller-courier", "buyer-pickup"],
    aspect: 1.42,
  },
];

export const STREAMS = [
  {
    id: "art" as const,
    index: "Stream 01",
    title: "Paintings & Canvas",
    body: "Oil, acrylic, watercolour, ink, mixed media.",
    count: "4,206 pieces from 812 painters.",
    href: "/discover/art",
  },
  {
    id: "decor" as const,
    index: "Stream 02",
    title: "Handcrafted Objects",
    body: "Ceramic, macramé, resin, woodwork, brass.",
    count: "2,981 pieces from 604 makers.",
    href: "/discover/decor",
  },
];

/** §4.2 — the founding-seller ladder shown on the landing hero. */
export const FOUNDING = {
  tier: "Founding Sellers · Tier 1 Diamond",
  claimed: 1153,
  total: 5000,
  remaining: 3847,
  perks: "25 free slots for 6 months, homepage feature, Diamond badge.",
};

/* ------------------------------------------------------------- discover --- */

/** The sidebar rails, in order. Counts are the design's figures. */
export const DISCOVER_STREAMS: DiscoverStream[] = [
  {
    id: "everything",
    label: "Everything",
    heading: "Discover",
    href: "/discover",
    count: 7187,
    streams: ["art", "decor"],
  },
  {
    id: "art",
    label: "Paintings & Canvas",
    heading: "Paintings & Canvas",
    href: "/discover/art",
    count: 4206,
    streams: ["art"],
  },
  {
    id: "decor",
    label: "Handcrafted Objects",
    heading: "Handcrafted Objects",
    href: "/discover/decor",
    count: 2981,
    streams: ["decor"],
  },
  {
    id: "pre-loved",
    label: "Pre-Loved",
    heading: "Pre-Loved",
    href: "/discover/pre-loved",
    awaiting:
      "Resale opens once a seller has completed their first handover. Nothing is listed here yet.",
  },
  {
    id: "auctions",
    label: "Auctions",
    heading: "Auctions",
    href: "/discover/auctions",
    awaiting:
      "Timed auctions are still being built. Pieces will appear here when the first studio schedules one.",
  },
];

/** Facets on the left rail. The pressed ones match the design's default state. */
export const MEDIUMS = [
  "Oil",
  "Acrylic",
  "Watercolour",
  "Ceramic",
  "Macramé",
  "Resin",
  "Woodwork",
];

export const HANDOVER_FILTERS = [
  { id: "in-person", label: "Meet in person", on: true },
  { id: "seller-courier", label: "Seller couriers", on: false },
  { id: "buyer-pickup", label: "Buyer arranges pickup", on: false },
];

export const SORTS = ["For you", "Newest", "Nearest", "Price"];

export const PRICE_BAND = { min: 800, max: 25000 };

/** The signed-in stub the app chrome renders until auth lands. */
export const VIEWER = {
  name: "Anaya Deshpande",
  handle: "anaya",
  seed: 500,
  unread: 3,
  location: "Bandra West",
  radiusKm: 10,
};

/** §3.4 — the vetted public handover points. */
export const SAFE_ZONES = { count: 142, cities: 11 };

/** Pieces carry a handle; the storefront and listing pages need the whole studio. */
export function studioFor(handle: string) {
  return STUDIOS.find((studio) => studio.handle === handle);
}

export function pieceById(id: string) {
  return PIECES.find((piece) => piece.id === id);
}

/** Other work by the same hand, for the strip under a listing. */
export function alsoBy(handle: string, exceptId?: string) {
  return PIECES.filter((piece) => piece.studio.handle === handle && piece.id !== exceptId);
}

/** One studio per skin — the strip the landing page uses to advertise them. */
export function showcaseStudios() {
  return SKIN_ORDER
    .map((skin) => STUDIOS.find((studio) => studio.skin === skin))
    .filter((studio): studio is Studio => Boolean(studio));
}

/** A storefront shows live work first; the sold archive trails it. */
export function shelfFor(handle: string) {
  const all = PIECES.filter((piece) => piece.studio.handle === handle);
  return {
    live: all.filter((piece) => !piece.soldForInr),
    sold: all.filter((piece) => piece.soldForInr),
  };
}

/* ------------------------------------------------------------ dashboard --- */

/**
 * S3 — what the seller sees. Deliberately not a commerce console: no SKUs, no
 * inventory, no GMV. Every figure here is something the artist can act on.
 */
export const DASHBOARD = {
  studio: "anaya",
  tierLine: "Pro Studio · Diamond founding seller #3,214",

  nudge: {
    label: "Next best thing to do",
    /** The emphasised span is a piece title, set in the display italic. */
    lead: "Three people asked about",
    piece: "Wet Tarmac, Baner Road",
    tail: "and none of them got a reply.",
    body:
      "Your median reply time went from 2h to 9h this week. Reply time is shown on every piece you list and it feeds where you rank.",
    action: "Open the three chats",
  },

  slots: {
    used: 31,
    /** Ten blocks: filled, expiring, then free. Pro studios are uncapped. */
    filled: 7,
    expiring: 2,
    total: 10,
    plan: "Unlimited · Pro",
    note:
      "Slots count pieces that are live at the same time, not pieces you've ever uploaded. Mark one sold and the slot frees immediately.",
    warning: "2 pieces expire in 6 days — they'll archive, never delete.",
  },

  week: [
    { figure: "1,284", label: "Views", delta: "+18%" },
    { figure: "96", label: "Saves", delta: "+31%" },
    { figure: "11", label: "Conversations" },
    { figure: "2", label: "Deals agreed" },
  ],
  searches: ["monsoon painting pune", "oil on linen under 5000"],

  offers: [
    { pieceId: "p-131", by: "Rhea M.", offeredInr: 13500 },
    { pieceId: "p-134", by: "Kabir S.", offeredInr: 7000 },
  ],
  offersNote: "2 expire today",

  photos: {
    average: 74,
    body:
      "Pieces scoring above 75 get 3.2× more views. Four of yours are below that, all for the same reason.",
    weak: [
      { seed: 132, score: 51, reason: "tilted 4°" },
      { seed: 133, score: 58, reason: "tilted 3°" },
      { seed: 135, score: 62, reason: "underexposed" },
      { seed: 136, score: 66, reason: "cluttered edge" },
    ],
    action: "Auto-straighten all four — preview first",
  },

  verification: {
    label: "Verification centre",
    title: "Add a 20-second studio clip to unlock the Verified Maker badge.",
    body:
      "You, two of your listed pieces, and a handwritten slip with your handle and today's date. Verified Makers get 4× more messages.",
    action: "Record it now",
  },
};

/**
 * The studio's own nav. `href` is set only where the section actually exists;
 * the rest render as labels rather than links that go nowhere.
 */
export const STUDIO_NAV: { label: string; href?: string }[] = [
  { label: "Today", href: "/sell" },
  { label: "Pieces", href: "/sell/pieces" },
  { label: "Offers" },
  { label: "Storefront", href: "/sell/storefront" },
  { label: "Insights" },
  { label: "Plan & slots" },
  { label: "Verification" },
];
