"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_PHOTOS, MAX_PHOTO_MB } from "@/lib/plans";

/**
 * The photo field.
 *
 * A plain <input type="file" multiple> would work, but a seller uploading their
 * own work needs to see what they picked before they commit — so this keeps the
 * real input as the source of truth for the form and draws previews from it.
 * The first photograph is the one buyers see in the feed, and it says so.
 */
export function PhotoPicker({ invalid = false }: { invalid?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);

  /* Object URLs are a manual resource: not revoking them leaks the file for as
     long as the tab is open. */
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  function read(files: FileList | null) {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews(
      [...(files ?? [])].slice(0, MAX_PHOTOS).map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    );
  }

  return (
    <div className="cg-photos-field">
      <input
        ref={input}
        type="file"
        name="photos"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="cg-sr"
        aria-invalid={invalid || undefined}
        onChange={(event) => read(event.target.files)}
      />

      <button
        type="button"
        className={`cg-dropzone ${invalid ? "cg-dropzone--bad" : ""}`}
        onClick={() => input.current?.click()}
      >
        <span className="cg-dropzone__mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="M4 17l5-5 4 4 2.5-2.5L20 17" />
          </svg>
        </span>
        <span className="cg-dropzone__lead">
          {previews.length ? "Choose different photographs" : "Choose photographs"}
        </span>
        <span className="cg-dropzone__note">{`JPEG, PNG, WebP or AVIF · up to ${MAX_PHOTOS} · ${MAX_PHOTO_MB} MB each`}</span>
      </button>

      {previews.length ? (
        <ol className="cg-shots">
          {previews.map((preview, index) => (
            <li key={preview.url} className="cg-shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.name} />
              {index === 0 ? <span className="cg-shot__tag">Cover</span> : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
