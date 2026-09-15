/**
 * The cities CraftGali knows about.
 *
 * A buyer picks one the way you pick a city on a ticketing site: it is the
 * first thing you choose and it frames everything after it. A storefront
 * belongs to one too, and the distance shown on a listing is measured between
 * those two points — never between addresses, because a listing must never
 * carry one.
 *
 * Coordinates are city centres, to two decimals. That is roughly a kilometre of
 * precision, which is all a "12 km away" line needs and all we want to imply.
 */

export interface City {
  slug: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  /** Shown as a tile on the picker, the way a ticketing site leads with metros. */
  popular?: boolean;
}

export const CITIES: City[] = [
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.08, lng: 72.88, popular: true },
  { slug: "delhi", name: "Delhi", state: "Delhi", lat: 28.61, lng: 77.21, popular: true },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.97, lng: 77.59, popular: true },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.39, lng: 78.49, popular: true },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.02, lng: 72.57, popular: true },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.08, lng: 80.27, popular: true },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", lat: 22.57, lng: 88.36, popular: true },
  { slug: "pune", name: "Pune", state: "Maharashtra", lat: 18.52, lng: 73.86, popular: true },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.91, lng: 75.79, popular: true },
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.85, lng: 80.95, popular: true },
  { slug: "kochi", name: "Kochi", state: "Kerala", lat: 9.93, lng: 76.27, popular: true },
  { slug: "chandigarh", name: "Chandigarh", state: "Chandigarh", lat: 30.73, lng: 76.78, popular: true },

  { slug: "agra", name: "Agra", state: "Uttar Pradesh", lat: 27.18, lng: 78.01 },
  { slug: "amritsar", name: "Amritsar", state: "Punjab", lat: 31.63, lng: 74.87 },
  { slug: "aurangabad", name: "Chhatrapati Sambhajinagar", state: "Maharashtra", lat: 19.88, lng: 75.34 },
  { slug: "bhagalpur", name: "Bhagalpur", state: "Bihar", lat: 25.24, lng: 86.99 },
  { slug: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.26, lng: 77.41 },
  { slug: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", lat: 20.30, lng: 85.82 },
  { slug: "bhuj", name: "Bhuj", state: "Gujarat", lat: 23.24, lng: 69.67 },
  { slug: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", lat: 11.02, lng: 76.96 },
  { slug: "dehradun", name: "Dehradun", state: "Uttarakhand", lat: 30.32, lng: 78.03 },
  { slug: "goa", name: "Panaji", state: "Goa", lat: 15.49, lng: 73.83 },
  { slug: "guwahati", name: "Guwahati", state: "Assam", lat: 26.14, lng: 91.74 },
  { slug: "gwalior", name: "Gwalior", state: "Madhya Pradesh", lat: 26.22, lng: 78.18 },
  { slug: "indore", name: "Indore", state: "Madhya Pradesh", lat: 22.72, lng: 75.86 },
  { slug: "jaisalmer", name: "Jaisalmer", state: "Rajasthan", lat: 26.92, lng: 70.91 },
  { slug: "jodhpur", name: "Jodhpur", state: "Rajasthan", lat: 26.24, lng: 73.02 },
  { slug: "kanpur", name: "Kanpur", state: "Uttar Pradesh", lat: 26.45, lng: 80.33 },
  { slug: "madurai", name: "Madurai", state: "Tamil Nadu", lat: 9.93, lng: 78.12 },
  { slug: "mysuru", name: "Mysuru", state: "Karnataka", lat: 12.30, lng: 76.64 },
  { slug: "nagpur", name: "Nagpur", state: "Maharashtra", lat: 21.15, lng: 79.09 },
  { slug: "nashik", name: "Nashik", state: "Maharashtra", lat: 20.01, lng: 73.79 },
  { slug: "patna", name: "Patna", state: "Bihar", lat: 25.59, lng: 85.14 },
  { slug: "raipur", name: "Raipur", state: "Chhattisgarh", lat: 21.25, lng: 81.63 },
  { slug: "rajkot", name: "Rajkot", state: "Gujarat", lat: 22.30, lng: 70.80 },
  { slug: "ranchi", name: "Ranchi", state: "Jharkhand", lat: 23.34, lng: 85.31 },
  { slug: "shillong", name: "Shillong", state: "Meghalaya", lat: 25.58, lng: 91.89 },
  { slug: "srinagar", name: "Srinagar", state: "Jammu & Kashmir", lat: 34.08, lng: 74.80 },
  { slug: "surat", name: "Surat", state: "Gujarat", lat: 21.17, lng: 72.83 },
  { slug: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", lat: 8.52, lng: 76.94 },
  { slug: "udaipur", name: "Udaipur", state: "Rajasthan", lat: 24.58, lng: 73.71 },
  { slug: "vadodara", name: "Vadodara", state: "Gujarat", lat: 22.31, lng: 73.18 },
  { slug: "varanasi", name: "Varanasi", state: "Uttar Pradesh", lat: 25.32, lng: 82.97 },
  { slug: "vijayawada", name: "Vijayawada", state: "Andhra Pradesh", lat: 16.51, lng: 80.65 },
  { slug: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.69, lng: 83.22 },
];

export const DEFAULT_CITY = "mumbai";

/** The radii a buyer can choose, in km. `null` means the whole country. */
export const RADII = [5, 10, 25, 50, 100] as const;
export const DEFAULT_RADIUS = 25;

const BY_SLUG = new Map(CITIES.map((city) => [city.slug, city]));

export function cityBySlug(slug: string | undefined | null) {
  return slug ? BY_SLUG.get(slug) ?? null : null;
}

export function popularCities() {
  return CITIES.filter((city) => city.popular);
}

/** Everything else, alphabetical — the long list under the tiles. */
export function otherCities() {
  return CITIES.filter((city) => !city.popular).sort((a, b) => a.name.localeCompare(b.name));
}

export function searchCities(term: string) {
  const needle = term.trim().toLowerCase();
  if (!needle) return [];
  return CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(needle) || city.state.toLowerCase().includes(needle),
  ).slice(0, 12);
}

/* --------------------------------------------------------------- geometry --- */

const EARTH_KM = 6371;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in km. Good to well within the precision we display. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
}

/**
 * The listed city closest to a point.
 *
 * This is how "detect my location" resolves: the browser hands over
 * coordinates and we snap them to a city we actually know, rather than calling
 * out to a geocoder and handing someone's exact position to a third party.
 */
export function nearestCity(point: { lat: number; lng: number }) {
  let best = CITIES[0];
  let bestKm = Infinity;
  for (const city of CITIES) {
    const km = distanceKm(point, city);
    if (km < bestKm) { best = city; bestKm = km; }
  }
  return { city: best, km: bestKm };
}

/**
 * Every listed city whose centre is within the radius of a point.
 *
 * Distance is city-to-city, so "within 25 km" is really "shops in these
 * cities" — and that is a set Postgres can filter on with an index, instead of
 * measuring every row after the fact.
 */
export function citiesWithin(point: { lat: number; lng: number }, radiusKm: number) {
  return CITIES.filter((city) => distanceKm(point, city) <= radiusKm).map((city) => city.slug);
}

/** "1.2 km" close up, whole kilometres after that. */
export function formatKm(km: number) {
  if (km < 1) return "under 1 km";
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
