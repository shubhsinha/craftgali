/*
 * Seeds the database with accounts you can actually sign in as.
 *
 * Every seller here uses a handle that already exists in lib/sample-data.ts, so
 * the app's seeded content lines up behind a real login: sign in as Anaya and
 * the studio dashboard has her pieces, her offers and her traffic, because
 * `shelfFor("anaya")` finds them. The two accounts with handles the sample data
 * does not know are there on purpose — they are what a genuinely new seller
 * sees, which is the first-run screen.
 *
 * Idempotent: every row is an upsert keyed on email or handle, so re-running
 * resets the passwords and leaves everything else where it was.
 *
 *   npm run seed
 */
import { readFileSync } from "node:fs";
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import pg from "pg";

const scrypt = promisify(scryptCb);

/* Same format lib/auth.ts writes and reads: scrypt$<salt hex>$<key hex>. */
async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

const PASSWORD = process.env.SEED_PASSWORD ?? "craftgali-dev";

const BUYERS = [
  { email: "rhea@craftgali.dev", fullName: "Rhea Malhotra", city: "Mumbai" },
  { email: "kabir@craftgali.dev", fullName: "Kabir Shah", city: "Pune" },
  { email: "aditi@craftgali.dev", fullName: "Aditi Rao", city: "Bengaluru" },
  { email: "farhan@craftgali.dev", fullName: "Farhan Qureshi", city: "Delhi" },
];

/* The handles match lib/sample-data.ts, so these studios open fully stocked. */
const SELLERS = [
  {
    email: "anaya@craftgali.dev", fullName: "Anaya Deshpande", city: "Pune",
    shop: "Anaya Deshpande", handle: "anaya", area: "Baner", citySlug: "pune",
    categories: ["Paintings & Canvas"],
  },
  {
    email: "meera@craftgali.dev", fullName: "Meera Iyer", city: "Mumbai",
    shop: "Meera's Clay Atelier", handle: "meera", area: "Bandra West", citySlug: "mumbai",
    categories: ["Handcrafted Objects"],
  },
  {
    email: "nilambari@craftgali.dev", fullName: "Nilambari Collective", city: "Kutch",
    shop: "Nilambari Handloom", handle: "nilambari", area: "Bhuj", citySlug: "bhuj",
    categories: ["Handcrafted Objects"],
  },
  {
    email: "kumbh@craftgali.dev", fullName: "Kumbh Craft House", city: "Jaipur",
    shop: "Kumbh Craft House", handle: "kumbhcraft", area: "Amer Road", citySlug: "jaipur",
    categories: ["Handcrafted Objects"],
  },
  {
    email: "priya@craftgali.dev", fullName: "Priya Menon", city: "Kochi",
    shop: "Priya Atelier", handle: "priya", area: "Fort Kochi", citySlug: "kochi",
    categories: ["Paintings & Canvas"],
  },
  {
    email: "sunita@craftgali.dev", fullName: "Sunita Kumari", city: "Bhagalpur",
    shop: "Sunita Kumari", handle: "sunita", area: "Nathnagar", citySlug: "bhagalpur",
    categories: ["Handcrafted Objects"],
  },
  {
    email: "vikram@craftgali.dev", fullName: "Vikram Rao", city: "Mysuru",
    shop: "Vikram Rao", handle: "vikram", area: "Lakshmipuram", citySlug: "mysuru",
    categories: ["Handcrafted Objects", "Pre-Loved Items"],
  },
];

/* No sample pieces behind these handles — they land on the first-run screen. */
const NEW_SELLERS = [
  {
    email: "demo@craftgali.dev", fullName: "Demo Buyer", city: "Mumbai",
    shop: "Demo Clay Works", handle: "demoworks", area: "Bandra West", citySlug: "mumbai",
    categories: ["Handcrafted Objects"],
  },
  {
    email: "newseller@craftgali.dev", fullName: "Ishaan Verma", city: "Bhopal",
    shop: "Verma Woodworks", handle: "vermawood", area: "Shahpura", citySlug: "bhopal",
    categories: ["Handcrafted Objects"],
  },
];

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n").filter((l) => l && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")]; }),
);

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

async function upsertUser({ email, fullName, city }, role) {
  const hash = await hashPassword(PASSWORD);
  const { rows } = await pool.query(
    `insert into users (email, password_hash, full_name, city, role)
     values ($1, $2, $3, $4, $5)
     on conflict (email) do update
        set password_hash = excluded.password_hash,
            full_name = excluded.full_name,
            city = excluded.city,
            role = excluded.role,
            /* A reseed hands out a new password, so every session minted with
               the old one has to stop working. */
            session_version = users.session_version + 1,
            updated_at = now()
     returning id`,
    [email, hash, fullName, city, role],
  );
  return rows[0].id;
}

async function upsertStorefront(ownerId, { shop, handle, categories, area, citySlug }) {
  await pool.query(
    `insert into storefronts
       (owner_id, name, handle, categories, pickup_neighborhood, city_slug)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (owner_id) do update
        set name = excluded.name,
            handle = excluded.handle,
            categories = excluded.categories,
            pickup_neighborhood = excluded.pickup_neighborhood,
            city_slug = excluded.city_slug,
            updated_at = now()`,
    [ownerId, shop, handle, categories, area, citySlug],
  );
}

/*
 * Past sales, each with a real buyer and a real review.
 *
 * These exist so the demo shops have ratings without a single number being
 * hardcoded in the UI: every star on screen is averaged from a row in
 * `reviews`, exactly as it would be in production. A fresh database shows
 * zeros, which is the honest answer for a shop that has sold nothing.
 */
const SALES = [
  { handle: "anaya", title: "Baner Road at Dusk", medium: "Oil on canvas", size: "100×70 cm", price: 14500, stream: "art",
    buyer: "rhea@craftgali.dev", stars: 5, body: "Bigger in person than I expected, and the light in it is exactly what the photographs promised. Anaya met me at the mall atrium and waited while I looked at it properly." },
  { handle: "anaya", title: "Shivajinagar, First Rain", medium: "Oil on canvas", size: "75×50 cm", price: 9200, stream: "art",
    buyer: "kabir@craftgali.dev", stars: 5, body: "Second piece I've bought from her. Replies fast, no haggling games." },
  { handle: "anaya", title: "Study for a Wet Morning", medium: "Oil on board", size: "30×25 cm", price: 2600, stream: "art",
    buyer: "aditi@craftgali.dev", stars: 4, body: "Lovely small work. Took a couple of days to agree a time, but she was straightforward about it." },

  { handle: "meera", title: "Tenmoku Tea Bowls, Pair", medium: "Stoneware", size: "16 cm across", price: 2900, stream: "decor",
    buyer: "aditi@craftgali.dev", stars: 5, body: "Three bowls, no two the same, and she packed them better than most shops would." },
  { handle: "meera", title: "Carter Road Mugs, Set of Four", medium: "Stoneware", size: "11 cm tall", price: 1150, stream: "decor",
    buyer: "farhan@craftgali.dev", stars: 5, body: "Used them the same evening. Exactly the colour in the listing." },

  { handle: "nilambari", title: "Twelve-Dip Yardage", medium: "Cotton, natural indigo", size: "2.5 m", price: 5400, stream: "decor",
    buyer: "rhea@craftgali.dev", stars: 5, body: "The blue is astonishing and it smells of indigo still. Couriered at cost, arrived in four days." },
  { handle: "nilambari", title: "Ajrakh Cushion Panel, Pair", medium: "Indigo, madder", size: "40×40 cm", price: 2700, stream: "decor",
    buyer: "kabir@craftgali.dev", stars: 4, body: "Beautiful work. The frame is plainer than I'd have picked, which they did say." },

  { handle: "kumbhcraft", title: "Brass Diya, Set of Five", medium: "Brass", size: "9 cm", price: 1800, stream: "decor",
    buyer: "farhan@craftgali.dev", stars: 4, body: "Solid and heavy. Handover was at their workshop and took two minutes." },

  { handle: "priya", title: "Backwater Studies, Pair", medium: "Watercolour", size: "30×22 cm each", price: 3200, stream: "art",
    buyer: "aditi@craftgali.dev", stars: 5, body: "She sent extra photographs before I asked. That is the whole difference." },

  { handle: "vikram", title: "Teak Offcut Sculpture, No. 2", medium: "Reclaimed teak", size: "38 cm", price: 4100, stream: "decor",
    buyer: "kabir@craftgali.dev", stars: 5, body: "Reclaimed teak with the old nail holes left in, which is why I wanted it." },

  { handle: "sunita", title: "Jute Wall Hanging", medium: "Macramé, jute", size: "90×60 cm", price: 2200, stream: "decor",
    buyer: "farhan@craftgali.dev", stars: 3, body: "The piece is good. Took longer to arrange than I'd have liked and I had to chase twice." },
];

async function seedSale(sale) {
  const shop = (await pool.query("select id from storefronts where handle = $1", [sale.handle])).rows[0];
  const buyer = (await pool.query("select id from users where email = $1", [sale.buyer])).rows[0];
  if (!shop || !buyer) return;

  const slug = sale.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const listing = (await pool.query(
    `insert into listings
       (storefront_id, title, slug, price_inr, sold_for_inr, stream, medium, dimensions,
        status, buyer_id, sold_at, handover)
     values ($1,$2,$3,$4,$4,$5,$6,$7,'sold',$8, now() - (random() * interval '60 days'), '{in-person}')
     on conflict (storefront_id, slug) do update
        set price_inr = excluded.price_inr,
            sold_for_inr = excluded.sold_for_inr,
            buyer_id = excluded.buyer_id,
            status = 'sold',
            updated_at = now()
     returning id`,
    [shop.id, sale.title, slug, sale.price, sale.stream, sale.medium, sale.size, buyer.id],
  )).rows[0];

  await pool.query(
    `insert into reviews (listing_id, storefront_id, author_id, stars, body)
     values ($1,$2,$3,$4,$5)
     on conflict (listing_id, author_id) do update
        set stars = excluded.stars, body = excluded.body, updated_at = now()`,
    [listing.id, shop.id, buyer.id, sale.stars, sale.body],
  );
}

try {
  for (const buyer of BUYERS) await upsertUser(buyer, "buyer");
  console.log(`buyers    ${BUYERS.length}`);

  for (const seller of [...SELLERS, ...NEW_SELLERS]) {
    const id = await upsertUser(seller, "seller");
    await upsertStorefront(id, seller);
  }
  console.log(`sellers   ${SELLERS.length} stocked, ${NEW_SELLERS.length} brand new`);

  for (const sale of SALES) await seedSale(sale);
  const rated = await pool.query(
    "select count(*) as n, round(avg(stars)::numeric, 2) as avg from reviews",
  );
  console.log(`reviews   ${rated.rows[0].n} across ${new Set(SALES.map((s) => s.handle)).size} shops, averaging ${rated.rows[0].avg}`);

  /* Old throttle counts would lock out an account you just reseeded. */
  await pool.query("delete from auth_attempts");
  await pool.query("update password_resets set used_at = now() where used_at is null");

  const counts = await pool.query(
    "select (select count(*) from users) as users, (select count(*) from storefronts) as shops",
  );
  console.log(`\ntotals    ${counts.rows[0].users} users, ${counts.rows[0].shops} storefronts`);
  console.log(`password  ${PASSWORD}   (every seeded account)`);
} catch (error) {
  console.error("seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
