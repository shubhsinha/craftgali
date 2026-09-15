"use server";

import { revalidatePath } from "next/cache";
import { query, queryOne } from "@/lib/db";
import { requireSeller } from "@/lib/guard";
import { hit, LIMITS, retryMessage } from "@/lib/ratelimit";
import { HERITAGE_LAYERS, SKINS, skinIsAvailable, type HeritageId } from "@/lib/skins";
import type { ListingState } from "@/lib/plans";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_COVER = 6 * 1024 * 1024;
const MAX_AVATAR = 2 * 1024 * 1024;

/* --------------------------------------------------------- words --- */

/**
 * The tagline and the bio. Both are the maker's own words, rendered verbatim;
 * the only rule is length, because a storefront is a shop window and not a
 * blog. Empty clears.
 */
export async function updateShopDetailsAction(
  _prev: ListingState,
  form: FormData,
): Promise<ListingState> {
  const user = await requireSeller("/sell/storefront");

  const throttle = await hit(`shopdetails:user:${user.id}`, LIMITS.shopDetails);
  if (throttle.limited) return { error: retryMessage(LIMITS.shopDetails) };

  const tagline = String(form.get("tagline") ?? "").trim();
  const bio = String(form.get("bio") ?? "").trim();

  if (tagline.length > 140) return { error: "Keep the line under 140 characters.", field: "tagline" };
  if (bio.length > 1500) return { error: "Keep the about text under 1,500 characters.", field: "bio" };

  await query(
    "update storefronts set tagline = $2, bio = $3, updated_at = now() where handle = $1",
    [user.handle, tagline || null, bio || null],
  );

  revalidatePath(`/artist/${user.handle}`);
  revalidatePath("/sell/storefront");
  return { done: "Saved. It's on your storefront now." };
}

/* -------------------------------------------------------- pictures --- */

/**
 * Cover or avatar. One of each per shop — a new upload replaces the old row
 * rather than piling up, and the id changes so any cached copy is a miss.
 */
export async function uploadShopMediaAction(
  _prev: ListingState,
  form: FormData,
): Promise<ListingState> {
  const user = await requireSeller("/sell/storefront");

  const throttle = await hit(`shopmedia:user:${user.id}`, LIMITS.shopMedia);
  if (throttle.limited) return { error: retryMessage(LIMITS.shopMedia) };

  const kind = String(form.get("kind") ?? "");
  if (kind !== "cover" && kind !== "avatar") return { error: "Unknown picture slot." };

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a picture first.", field: kind };
  }
  if (!ALLOWED.includes(file.type)) {
    return { error: "JPEG, PNG, WebP or AVIF only.", field: kind };
  }
  const max = kind === "cover" ? MAX_COVER : MAX_AVATAR;
  if (file.size > max) {
    return { error: `Keep it under ${max / 1024 / 1024} MB.`, field: kind };
  }

  const shop = await queryOne<{ id: string }>("select id from storefronts where handle = $1", [user.handle]);
  if (!shop) return { error: "Your storefront has gone missing." };

  const bytes = Buffer.from(await file.arrayBuffer());

  await query(
    `insert into storefront_media (storefront_id, kind, bytes, content_type)
     values ($1, $2, $3, $4)
     on conflict (storefront_id, kind) do update
        set bytes = excluded.bytes,
            content_type = excluded.content_type,
            id = gen_random_uuid(),
            created_at = now()`,
    [shop.id, kind, bytes, file.type],
  );

  revalidatePath(`/artist/${user.handle}`);
  revalidatePath("/sell/storefront");
  revalidatePath("/sell");
  return { done: kind === "cover" ? "Cover updated." : "Portrait updated." };
}

/* ----------------------------------------------------------- skin --- */

/**
 * Publishing the skin. The plan gate is enforced here, not in the picker: the
 * picker lets a free seller *preview* a Pro hue because that is the whole
 * pitch, but a form field is not a subscription.
 */
export async function publishSkinAction(
  _prev: ListingState,
  form: FormData,
): Promise<ListingState> {
  const user = await requireSeller("/sell/storefront");

  const throttle = await hit(`publishskin:user:${user.id}`, LIMITS.publishSkin);
  if (throttle.limited) return { error: retryMessage(LIMITS.publishSkin) };

  const hue = String(form.get("hue") ?? "");
  const mode = String(form.get("mode") ?? "");
  if (!(hue in SKINS)) return { error: "Pick one of the four hues." };
  if (mode !== "light" && mode !== "dark") return { error: "Pick light or dark." };

  /* Everyone is on the free plan until billing exists. */
  const pro = false;
  if (!skinIsAvailable(hue as keyof typeof SKINS, pro)) {
    return { error: `${SKINS[hue as keyof typeof SKINS].name} needs Pro Studio.` };
  }

  const heritage: Record<string, boolean> = {};
  for (const layer of HERITAGE_LAYERS) {
    heritage[layer.id] = form.get(`heritage.${layer.id as HeritageId}`) === "on";
  }

  await query(
    `update storefronts
        set skin = $2, mode = $3, heritage = $4::jsonb, updated_at = now()
      where handle = $1`,
    [user.handle, hue, mode, JSON.stringify(heritage)],
  );

  revalidatePath(`/artist/${user.handle}`);
  revalidatePath("/sell/storefront");
  return { done: `Published. Your shop is now ${SKINS[hue as keyof typeof SKINS].name}, ${mode}.` };
}
