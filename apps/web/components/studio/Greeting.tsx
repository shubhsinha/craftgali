"use client";

import { useEffect, useState } from "react";

/**
 * "Good evening, Anaya · Thursday, 3 September".
 *
 * Both halves depend on the reader's clock, so the server renders the name
 * alone and the date lands on mount — a prerendered greeting would be wrong for
 * most of the day and would fight hydration for the rest of it.
 */
export function Greeting({ name, tierLine }: { name: string; tierLine: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => setNow(new Date()), []);

  const salutation = now ? `Good ${partOfDay(now.getHours())}, ${name}` : `Hello, ${name}`;
  const today = now
    ? now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
    : null;

  return (
    <div>
      <h1 className="cg-studio__greeting">{salutation}</h1>
      <p className="cg-studio__tier">{[today, tierLine].filter(Boolean).join(" · ")}</p>
    </div>
  );
}

function partOfDay(hour: number) {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
