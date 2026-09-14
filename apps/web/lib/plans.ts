/**
 * Plan limits.
 *
 * These live outside the server-action module because a `"use server"` file may
 * only export async functions — and because the form, the studio and the fee
 * page all need to state the same number without importing an action to do it.
 */

/** Pieces a free studio may have live at once. Pro is uncapped. §4.2 */
export const FREE_SLOTS = 5;

/** Per listing. Kept low deliberately: the photos live in the database for now. */
export const MAX_PHOTOS = 6;
export const MAX_PHOTO_MB = 4;

export type ListingState = { error?: string; field?: string; done?: string } | null;
