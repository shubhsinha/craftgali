"use client";

import { useState } from "react";
import { pieceImage, placeholder } from "@/lib/media";
import type { Piece } from "@/lib/types";

/**
 * The plate and its thumbnail strip. The artwork sits on a mat inside a white
 * mount — the one place a shadow is spent, because it reads as a hung frame.
 */
export function Gallery({ piece }: { piece: Piece }) {
  /* A real listing has uploads; a comp piece has seeds. Both end up as a list
     of urls, so the strip below does not care which it is looking at. */
  const shots = piece.photoIds?.length
    ? piece.photoIds.map((_, index) => ({
        full: pieceImage(piece, 900, 700, index),
        thumb: pieceImage(piece, 200, 160, index),
      }))
    : [piece.seed, ...(piece.detail?.gallery ?? [])].map((seed) => ({
        full: placeholder(seed, 900, 700),
        thumb: placeholder(seed, 200, 160),
      }));
  const [active, setActive] = useState(0);
  const aspect = piece.aspect ?? 1.2;

  return (
    <>
      <div className="cg-plate">
        <div className="cg-plate__mount">
          <img
            src={shots[active]!.full}
            alt={`${piece.title} — view ${active + 1} of ${shots.length}`}
            style={{ aspectRatio: `${aspect} / 1` }}
          />
        </div>
      </div>

      <div className="cg-thumbs">
        {shots.map((shot, index) => (
          <button
            key={shot.thumb}
            type="button"
            className="cg-thumb"
            aria-pressed={index === active}
            aria-label={`View ${index + 1}`}
            style={{ backgroundImage: `url(${shot.thumb})` }}
            onClick={() => setActive(index)}
          />
        ))}

        {piece.detail?.makingOf ? (
          <button type="button" className="cg-thumb cg-thumb--film">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16v12H4z" />
              <path d="M10 9.5 15 12l-5 2.5z" fill="currentColor" stroke="none" />
            </svg>
            Making of
          </button>
        ) : null}

        <button type="button" className="cg-thumb cg-thumb--wall">
          On your wall
        </button>
      </div>
    </>
  );
}
