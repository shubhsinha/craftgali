import { queryOne } from "./db";
import { studioFor } from "./sample-data";
import type { Studio } from "./types";

interface StorefrontRow {
  name: string;
  handle: string;
  categories: string[];
  pickupNeighborhood: string;
  city: string | null;
  artist: string;
  joined: number;
}

/**
 * Resolves /artist/<handle>.
 *
 * The seeded studios come from the design comps and carry a whole shop's worth
 * of content; a storefront someone just opened has a name, a handle and nothing
 * else yet. Both must render, so a real row is widened into the same shape with
 * empty stats — the page then shows its own first-run state.
 */
export async function resolveStudio(handle: string): Promise<Studio | null> {
  const seeded = studioFor(handle);
  if (seeded) return seeded;

  const row = await queryOne<StorefrontRow>(
    `select s.name,
            s.handle,
            s.categories,
            s.pickup_neighborhood as "pickupNeighborhood",
            u.city,
            u.full_name as artist,
            extract(year from u.created_at)::int as joined
       from storefronts s
       join users u on u.id = s.owner_id
      where s.handle = $1 and s.status = 'active'`,
    [handle],
  );

  if (!row) return null;

  return {
    handle: row.handle,
    name: row.name,
    artist: row.artist,
    shortName: row.artist.split(" ")[0],
    city: row.city ?? row.pickupNeighborhood,
    neighbourhood: row.pickupNeighborhood,
    discipline: row.categories.join(" · ") || "Handmade",
    /* Indigo is the house default and the only skin on the free plan that
       needs no explaining, so a shop that has picked nothing gets it. */
    skin: "indigo",
    seed: seedFor(row.handle),
    verifiedMaker: false,
    joined: row.joined,
    place: [row.city ?? row.pickupNeighborhood, `since ${row.joined}`]
      .filter(Boolean)
      .join(" · "),
    stats: { live: 0, sold: 0, repliesIn: "—" },
  };
}

function seedFor(handle: string) {
  return [...handle].reduce((total, char) => total + char.charCodeAt(0), 0) % 900;
}
