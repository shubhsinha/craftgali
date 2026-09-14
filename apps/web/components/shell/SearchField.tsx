"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "./icons";

/**
 * The location + search combo. It submits to /discover, and reads the term back
 * out of the URL so a search survives a reload or a shared link.
 */
export function SearchField({ place }: { place: React.ReactNode }) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const box = useRef<HTMLInputElement>(null);

  /* The phone rail's Search tab lands here; there is no separate search screen,
     so it opens the feed with the box already focused. */
  useEffect(() => {
    if (params.get("focus") === "search") box.current?.focus();
  }, [params]);

  return (
    <form className="cg-search" role="search" action="/discover">
      <div className="cg-search__place">{place}</div>
      <label className="cg-search__field">
        <SearchIcon size={13} />
        <span className="cg-sr">Search</span>
        <input
          ref={box}
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search artwork, studio, or medium…"
          autoComplete="off"
        />
      </label>
    </form>
  );
}
