import { cookies } from "next/headers";
import { cityBySlug, DEFAULT_CITY, DEFAULT_RADIUS, type City } from "./cities";

/**
 * Where the buyer is shopping from.
 *
 * Kept in a cookie rather than in localStorage because the feed is filtered on
 * the server — the page has to know the city before it renders, or every visit
 * would flash the wrong results. It is not httpOnly: the picker writes it from
 * the client, and there is nothing secret in a city name.
 *
 * `precise` is only ever set when the visitor actively asked us to detect them,
 * and it is rounded to two decimals before it is written — about a kilometre,
 * which is all the distance line needs. We never store a street-level fix.
 */

export const PLACE_COOKIE = "cg_place";

export interface Place {
  city: City;
  radiusKm: number;
  /** Their own coordinates, if they offered them. Otherwise the city centre. */
  point: { lat: number; lng: number };
  /** True when the point came from the browser rather than the city centre. */
  precise: boolean;
}

interface StoredPlace {
  c?: string;
  r?: number;
  lat?: number;
  lng?: number;
}

export function readPlace(): Place {
  const raw = cookies().get(PLACE_COOKIE)?.value;

  let stored: StoredPlace = {};
  if (raw) {
    try {
      stored = JSON.parse(decodeURIComponent(raw));
    } catch {
      /* A cookie we cannot read is one we ignore — the default city is a fine
         answer and better than an error page. */
    }
  }

  const city = cityBySlug(stored.c) ?? cityBySlug(DEFAULT_CITY)!;
  const radiusKm = RADIUS_VALUES.has(stored.r as number) ? (stored.r as number) : DEFAULT_RADIUS;

  const precise = typeof stored.lat === "number" && typeof stored.lng === "number";

  return {
    city,
    radiusKm,
    point: precise ? { lat: stored.lat!, lng: stored.lng! } : { lat: city.lat, lng: city.lng },
    precise,
  };
}

const RADIUS_VALUES = new Set<number>([5, 10, 25, 50, 100]);

/** Serialises a choice for the client to write. Kept tiny — it rides every request. */
export function encodePlace(input: { city: string; radiusKm: number; lat?: number; lng?: number }) {
  const value: StoredPlace = { c: input.city, r: input.radiusKm };
  if (typeof input.lat === "number" && typeof input.lng === "number") {
    value.lat = Math.round(input.lat * 100) / 100;
    value.lng = Math.round(input.lng * 100) / 100;
  }
  return encodeURIComponent(JSON.stringify(value));
}
