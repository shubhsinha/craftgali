"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  CITIES,
  DEFAULT_RADIUS,
  RADII,
  nearestCity,
  popularCities,
  type City,
} from "@/lib/cities";
import { PinIcon } from "./icons";

/**
 * The city sheet.
 *
 * A marketplace of handovers is useless without a place, so this is the first
 * real choice a visitor makes — the same shape as the ticketing sites everyone
 * here already knows: detect me, a row of metros, then everything else with a
 * search over it.
 *
 * "Detect my location" never leaves the browser: the coordinates are snapped to
 * the nearest city we already know about rather than sent to a geocoder, and
 * only that city and a two-decimal point are written to the cookie.
 */
export function CityPicker({
  city,
  radiusKm,
  precise,
}: {
  city: City;
  radiusKm: number;
  precise: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [radius, setRadius] = useState(radiusKm || DEFAULT_RADIUS);
  const [locating, setLocating] = useState(false);
  const [denied, setDenied] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    /* The sheet covers the page; letting the page behind it scroll is the
       classic way a modal feels broken on a phone. */
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const matches = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return null;
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(needle) || c.state.toLowerCase().includes(needle),
    );
  }, [term]);

  function commit(slug: string, point?: { lat: number; lng: number }) {
    const value: Record<string, unknown> = { c: slug, r: radius };
    if (point) {
      value.lat = Math.round(point.lat * 100) / 100;
      value.lng = Math.round(point.lng * 100) / 100;
    }
    /* A year is long enough that nobody is asked twice, short enough that a
       shared machine forgets eventually. */
    document.cookie = `cg_place=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setOpen(false);
    router.refresh();
  }

  function detect() {
    if (!navigator.geolocation) {
      setDenied("This browser cannot share a location. Pick a city instead.");
      return;
    }
    setLocating(true);
    setDenied(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = { lat: position.coords.latitude, lng: position.coords.longitude };
        const { city: found } = nearestCity(point);
        setLocating(false);
        commit(found.slug, point);
      },
      () => {
        setLocating(false);
        setDenied("We couldn't read your location. Pick a city instead.");
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }

  return (
    <>
      <button type="button" className="cg-place" onClick={() => setOpen(true)}>
        <PinIcon size={13} />
        <span className="cg-place__city">{city.name}</span>
        <span className="cg-place__radius">{radiusKm} km</span>
      </button>

      {/* The header bar carries a backdrop-filter, and that makes it the
          containing block for any position:fixed descendant — a sheet rendered
          in place would be anchored to the bar rather than to the viewport. So
          it goes to <body>. */}
      {open && mounted
        ? createPortal(
        <div className="cg-sheet" role="dialog" aria-modal="true" aria-label="Choose your city">
          <button
            type="button"
            className="cg-sheet__scrim"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />

          <div className="cg-sheet__panel">
            <header className="cg-sheet__head">
              <div>
                <h2 className="cg-sheet__title">Where are you shopping?</h2>
                <p className="cg-sheet__lede">
                  Everything on CraftGali is handed over in person or couriered by the
                  maker, so the city decides what you see.
                </p>
              </div>
              <button type="button" className="cg-sheet__close" onClick={() => setOpen(false)}>
                <span className="cg-sr">Close</span>
                <span aria-hidden="true">✕</span>
              </button>
            </header>

            <div className="cg-sheet__tools">
              <label className="cg-sheet__search">
                <span className="cg-sr">Search for your city</span>
                <input
                  autoFocus
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search for your city…"
                />
              </label>

              <button type="button" className="cg-sheet__detect" onClick={detect} disabled={locating}>
                <PinIcon size={14} />
                {locating ? "Finding you…" : "Detect my location"}
              </button>
            </div>

            {denied ? (
              <p className="cg-sheet__denied" role="alert">
                {denied}
              </p>
            ) : null}

            <div className="cg-sheet__radius">
              <span className="cg-eyebrow">How far will you travel?</span>
              <div className="cg-sheet__radii">
                {RADII.map((km) => (
                  <button
                    key={km}
                    type="button"
                    className="cg-chip"
                    aria-pressed={radius === km}
                    onClick={() => setRadius(km)}
                  >
                    {km} km
                  </button>
                ))}
              </div>
            </div>

            <div className="cg-sheet__body">
              {matches ? (
                matches.length ? (
                  <ul className="cg-sheet__list">
                    {matches.map((c) => (
                      <li key={c.slug}>
                        <button type="button" onClick={() => commit(c.slug)}>
                          <span className="cg-sheet__name">{c.name}</span>
                          <span className="cg-sheet__state">{c.state}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cg-sheet__none">
                    No city by that name yet. We are adding them as makers join —
                    pick the nearest one for now.
                  </p>
                )
              ) : (
                <>
                  <span className="cg-eyebrow">Popular cities</span>
                  <div className="cg-sheet__tiles">
                    {popularCities().map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        className="cg-tile"
                        aria-pressed={c.slug === city.slug}
                        onClick={() => commit(c.slug)}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>

                  <span className="cg-eyebrow cg-sheet__all">Everywhere else</span>
                  <ul className="cg-sheet__list">
                    {CITIES.filter((c) => !c.popular)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((c) => (
                        <li key={c.slug}>
                          <button type="button" onClick={() => commit(c.slug)}>
                            <span className="cg-sheet__name">{c.name}</span>
                            <span className="cg-sheet__state">{c.state}</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>

            {precise ? (
              <p className="cg-sheet__foot">
                Using your own location, rounded to about a kilometre. We never store
                anything finer, and never show it to a seller.
              </p>
            ) : null}
          </div>
        </div>,
          document.body,
        )
        : null}
    </>
  );
}
