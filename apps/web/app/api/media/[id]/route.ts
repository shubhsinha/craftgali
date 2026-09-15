import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

/** A shop's cover or avatar, out of the database. Immutable per id — an upload
    mints a new id — so it can be cached hard. */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) return new NextResponse("Not found", { status: 404 });

  const media = await queryOne<{ bytes: Buffer; content_type: string }>(
    "select bytes, content_type from storefront_media where id = $1",
    [params.id],
  );
  if (!media) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(media.bytes), {
    headers: {
      "content-type": media.content_type,
      "content-length": String(media.bytes.length),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
