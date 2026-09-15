"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckIcon, SlidersIcon } from "@/components/shell/icons";
import {
  DISCOVER_STREAMS,
  HANDOVER_FILTERS,
  MEDIUMS,
  PRICE_BAND,
  SORTS,
} from "@/lib/sample-data";
import type { DiscoverStream, Handover, Piece } from "@/lib/types";
import { PieceCard, rupees } from "./PieceCard";
import { SafetyCard } from "./SafetyCard";

/**
 * The P2 feed. The rail's facets are live — every chip and box narrows the
 * masonry below it, so the count line always describes what is on screen.
 */
export function DiscoverPage({
  stream,
  q,
  pieces: catalogue,
  place,
  saved,
  page,
  hasMore,
}: {
  stream: DiscoverStream;
  q?: string;
  /** Real listings and the seeded comps, already measured from the buyer. */
  pieces: Piece[];
  place: { city: string; radiusKm: number };
  /** Ids this viewer has saved. Empty for a signed-out visitor. */
  saved: string[];
  page: number;
  hasMore: boolean;
}) {
  const [medium, setMedium] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(PRICE_BAND.max);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [hideAi, setHideAi] = useState(false);
  const [handover, setHandover] = useState<Handover[]>(["in-person"]);
  const [sort, setSort] = useState(SORTS[0]);
  const [nearbyOnly, setNearbyOnly] = useState(true);
  const [railOpen, setRailOpen] = useState(false);

  const pieces = useMemo(() => {
    if (!stream.streams) return [];

    const needle = q?.trim().toLowerCase();

    const kept = catalogue.filter((piece) => {
      if (!stream.streams!.includes(piece.stream)) return false;
      if (needle && !haystack(piece).includes(needle)) return false;
      if (medium && !piece.medium.toLowerCase().includes(medium.toLowerCase())) return false;
      if (piece.priceInr > maxPrice) return false;
      if (verifiedOnly && !piece.verifiedMaker) return false;
      if (hideAi && piece.aiAssisted) return false;
      if (handover.length && !handover.some((mode) => piece.handover.includes(mode))) {
        return false;
      }
      /* A piece with no distance is one whose shop has set no city. It cannot
         honestly be called nearby, so a radius filter leaves it out. */
      if (nearbyOnly && (piece.distanceKm === undefined || piece.distanceKm > place.radiusKm)) {
        return false;
      }
      return true;
    });

    return sortPieces(kept, sort);
  }, [catalogue, stream, q, medium, maxPrice, verifiedOnly, hideAi, handover, sort, nearbyOnly, place.radiusKm]);

  const savedSet = useMemo(() => new Set(saved), [saved]);

  const activeFacets =
    (medium ? 1 : 0) +
    (maxPrice < PRICE_BAND.max ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (hideAi ? 1 : 0) +
    (nearbyOnly ? 1 : 0) +
    handover.length;

  function toggleHandover(mode: Handover) {
    setHandover((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode],
    );
  }

  return (
    <main className="cg-discover">
      <button
        type="button"
        className="cg-discover__railtoggle cg-show-md"
        aria-expanded={railOpen}
        onClick={() => setRailOpen((v) => !v)}
      >
        <SlidersIcon size={11} />
        Filters · {activeFacets}
      </button>

      <div className={`cg-rail ${railOpen ? "cg-rail--open" : ""}`}>
        <FacetGroup label="Stream" first>
          <div className="cg-rail__streams">
            {DISCOVER_STREAMS.map((row) => (
              <Link
                key={row.id}
                href={row.href}
                className="cg-rail__stream"
                aria-current={row.id === stream.id ? "page" : undefined}
              >
                {row.label}
                {row.count ? ` · ${row.count.toLocaleString("en-IN")}` : ""}
              </Link>
            ))}
          </div>
        </FacetGroup>

        <FacetGroup label="Distance">
          <Tick
            label={`Within ${place.radiusKm} km of ${place.city}`}
            note="Change the city or the radius from the pin in the header"
            on={nearbyOnly}
            onToggle={() => setNearbyOnly((v) => !v)}
          />
        </FacetGroup>

        <FacetGroup label="Price">
          <input
            type="range"
            className="cg-range"
            min={PRICE_BAND.min}
            max={PRICE_BAND.max}
            step={100}
            value={maxPrice}
            aria-label="Highest price"
            onChange={(event) => setMaxPrice(Number(event.target.value))}
          />
          <div className="cg-rail__band">
            <span>{rupees(PRICE_BAND.min)}</span>
            <span>{rupees(maxPrice)}</span>
          </div>
        </FacetGroup>

        <FacetGroup label="Medium">
          <div className="cg-rail__chips">
            {MEDIUMS.map((name) => {
              const on = medium === name;
              return (
                <button
                  key={name}
                  type="button"
                  className="cg-chip"
                  aria-pressed={on}
                  onClick={() => setMedium(on ? null : name)}
                >
                  {name}
                  {on ? <span aria-hidden="true">✕</span> : null}
                </button>
              );
            })}
          </div>
        </FacetGroup>

        <FacetGroup label="Trust">
          <Tick
            label="Verified Maker only"
            note="Studio video checked"
            on={verifiedOnly}
            onToggle={() => setVerifiedOnly((v) => !v)}
          />
          <Tick label="Hide AI-assisted work" on={hideAi} onToggle={() => setHideAi((v) => !v)} />
        </FacetGroup>

        <FacetGroup label="Handover">
          {HANDOVER_FILTERS.map((mode) => (
            <Tick
              key={mode.id}
              label={mode.label}
              on={handover.includes(mode.id as Handover)}
              onToggle={() => toggleHandover(mode.id as Handover)}
            />
          ))}
        </FacetGroup>

        <div className="cg-notice cg-rail__save">
          <p className="cg-notice__title">Save this search</p>
          <p className="cg-notice__body">
            Get told when matching pieces appear within {place.radiusKm} km of{" "}
            {place.city}.
          </p>
        </div>
      </div>

      <div className="cg-feed">
        <header className="cg-feed__head">
          <div>
            <h1 className="cg-feed__title">{stream.heading}</h1>
            <p className="cg-feed__count">
              {/* A closed stream has no result set, so it must not report one. */}
              {stream.awaiting
                ? "Not open yet"
                : describe({
                    count: pieces.length,
                    q,
                    medium,
                    maxPrice,
                    verifiedOnly,
                    place: nearbyOnly ? place : null,
                  })}
            </p>
          </div>
          {stream.awaiting ? null : (
            <div className="cg-feed__sorts">
              {SORTS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="cg-chip"
                  aria-pressed={sort === name}
                  onClick={() => setSort(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </header>

        {stream.awaiting ? (
          <p className="cg-feed__awaiting">{stream.awaiting}</p>
        ) : pieces.length ? (
          <>
          <div className="cg-masonry">
            {pieces.map((piece, index) => [
              /* Dealt into the third slot, so it lands mid-fold rather than
                 above the first piece where it reads as boilerplate. */
              index === 2 ? <SafetyCard key="safety" /> : null,
              <PieceCard
                key={piece.id}
                piece={piece}
                savable={Boolean(piece.photoIds)}
                saved={savedSet.has(piece.id)}
              />,
            ])}
          </div>
          {hasMore ? (
            <p className="cg-feed__more">
              <Link href={`${stream.href}?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page + 1) })}`}
                    className="cg-btn cg-btn--outline">
                Show more
              </Link>
            </p>
          ) : null}
          </>
        ) : (
          <p className="cg-feed__awaiting">
            {q?.trim()
              ? `Nothing matches “${q.trim()}” with these filters. Try a broader term, widen the radius, or drop a facet.`
              : `Nothing within ${place.radiusKm} km of ${place.city} matches those filters yet. Widen the radius from the pin in the header, or drop a facet.`}
          </p>
        )}
      </div>
    </main>
  );
}

/* ---------------------------------------------------------------- rail --- */

function FacetGroup({
  label,
  first = false,
  children,
}: {
  label: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`cg-facet ${first ? "cg-facet--first" : ""}`}>
      <h2 className="cg-eyebrow">{label}</h2>
      {children}
    </section>
  );
}

function Tick({
  label,
  note,
  on,
  onToggle,
}: {
  label: string;
  note?: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" className="cg-tick" aria-pressed={on} onClick={onToggle}>
      <span className="cg-tick__box">{on ? <CheckIcon /> : null}</span>
      <span>
        <span className="cg-tick__label">{label}</span>
        {note ? <span className="cg-tick__note">{note}</span> : null}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- feed --- */

function sortPieces(pieces: Piece[], sort: string) {
  const ordered = [...pieces];

  switch (sort) {
    case "Newest":
      return ordered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    case "Nearest":
      return ordered.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    case "Price":
      return ordered.sort((a, b) => a.priceInr - b.priceInr);
    default:
      return ordered;
  }
}

/** What a search term is matched against: title, studio and medium. */
function haystack(piece: Piece) {
  return `${piece.title} ${piece.studio.name} ${piece.medium}`.toLowerCase();
}

/** The line under the heading — it reads back the filters actually applied. */
function describe({
  count,
  q,
  medium,
  maxPrice,
  verifiedOnly,
  place,
}: {
  count: number;
  q?: string;
  medium: string | null;
  maxPrice: number;
  verifiedOnly: boolean;
  place: { city: string; radiusKm: number } | null;
}) {
  const parts = [`${count} ${count === 1 ? "piece" : "pieces"}`];
  if (q?.trim()) parts.push(`matching “${q.trim()}”`);
  if (medium) parts.push(medium);
  if (maxPrice < PRICE_BAND.max) parts.push(`under ${rupees(maxPrice)}`);
  if (place) parts.push(`within ${place.radiusKm} km of ${place.city}`);
  else parts.push("everywhere in India");
  if (verifiedOnly) parts.push("Verified Makers");
  return parts.join(" · ");
}
