"use client";

import { useState, useTransition } from "react";
import { toggleFollowAction } from "@/lib/actions/follows";

/** Flips at once, reconciles with what the server did. */
export function FollowButton({
  handle,
  following: initial,
  count: initialCount,
}: {
  handle: string;
  following: boolean;
  count: number;
}) {
  const [following, setFollowing] = useState(initial);
  const [pending, start] = useTransition();

  const count = initialCount + (following && !initial ? 1 : 0) - (!following && initial ? 1 : 0);

  function toggle() {
    const next = !following;
    setFollowing(next);
    start(async () => {
      const result = await toggleFollowAction(handle, `/artist/${handle}`);
      if (result.following !== next) setFollowing(result.following);
    });
  }

  return (
    <button
      type="button"
      className={`cg-btn ${following ? "cg-btn--quiet" : "cg-btn--outline"}`}
      aria-pressed={following}
      disabled={pending}
      onClick={toggle}
    >
      {following ? "Following" : "Follow"}
      {count > 0 ? <span className="cg-follow__count">{count}</span> : null}
    </button>
  );
}
