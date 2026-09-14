import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

/**
 * Serves a listing photo out of the database.
 *
 * Photos are immutable once uploaded — a change means a new row with a new id —
 * so these can be cached hard and for a long time. The id is a uuid, which is
 * why an unguessable url is not a security boundary here: every photo belongs
 * to a listing that is public anyway.
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const photo = await queryOne<{ bytes: Buffer; content_type: string }>(
    "select bytes, content_type from listing_photos where id = $1",
    [params.id],
  );

  if (!photo) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(photo.bytes), {
    headers: {
      "content-type": photo.content_type,
      "content-length": String(photo.bytes.length),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
