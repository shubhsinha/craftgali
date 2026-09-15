import { queryOne } from "./db";
import { studioFor } from "./sample-data";
import { DEFAULT_HERITAGE } from "./skins";
import type { SkinId, SkinMode, Studio } from "./types";

interface StorefrontRow {
  id: string;
  name: string;
  handle: string;
  categories: string[];
  pickupNeighborhood: string;
  citySlug: string | null;
  tagline: string | null;
  bio: string | null;
  skin: SkinId;
  mode: SkinMode;
  heritage: Record<string, boolean> | null;
  coverId: string | null;
  avatarId: string | null;
  city: string | null;
  artist: string;
  joined: number;
}

const SELECT = `
  select s.id,
         s.name,
         s.handle,
         s.categories,
         s.pickup_neighborhood as "pickupNeighborhood",
         s.city_slug           as "citySlug",
         s.tagline,
         s.bio,
         s.skin,
         s.mode,
         s.heritage,
         (select id from storefront_media m where m.storefront_id = s.id and m.kind = 'cover')  as "coverId",
         (select id from storefront_media m where m.storefront_id = s.id and m.kind = 'avatar') as "avatarId",
         u.city,
         u.full_name as artist,
         extract(year from u.created_at)::int as joined
    from storefronts s
    join users u on u.id = s.owner_id
   where s.handle = $1 and s.status = 'active'`;

/**
 * Resolves /artist/<handle>.
 *
 * Two sources, layered. The seeded studios carry a whole shop's worth of comp
 * content — quotes, collections, a wall — that a database row does not. But
 * those studios are also real accounts now, and what their owner *publishes*
 * (skin, tagline, cover) must win over what the design comp said. So the row
 * is always read, and its published fields are laid over the comp.
 */
export async function resolveStudio(handle: string): Promise<(Studio & { id?: string }) | null> {
  const seeded = studioFor(handle);
  const row = await queryOne<StorefrontRow>(SELECT, [handle]);

  if (!row) return seeded ?? null;

  const published = {
    id: row.id,
    skin: row.skin,
    mode: row.mode,
    heritage: row.heritage ?? DEFAULT_HERITAGE,
    coverId: row.coverId ?? undefined,
    avatarId: row.avatarId ?? undefined,
    citySlug: row.citySlug ?? undefined,
    neighbourhood: row.pickupNeighborhood,
    /* Words the maker typed beat words the comp invented for them. */
    ...(row.tagline ? { quote: row.tagline } : {}),
    ...(row.bio ? { blurb: row.bio } : {}),
  };

  if (seeded) return { ...seeded, ...published };

  return {
    ...published,
    handle: row.handle,
    name: row.name,
    artist: row.artist,
    shortName: row.artist.split(" ")[0],
    city: row.city ?? row.pickupNeighborhood,
    discipline: row.categories.join(" · ") || "Handmade",
    seed: seedFor(row.handle),
    verifiedMaker: false,
    joined: row.joined,
    place: [row.city ?? row.pickupNeighborhood, `since ${row.joined}`].filter(Boolean).join(" · "),
    quote: row.tagline ?? undefined,
    blurb: row.bio ?? undefined,
    /* live/sold are counted from the shelf by the page; nothing is stated. */
    stats: { live: 0, sold: 0, repliesIn: "" },
  };
}

function seedFor(handle: string) {
  return [...handle].reduce((total, char) => total + char.charCodeAt(0), 0) % 900;
}
