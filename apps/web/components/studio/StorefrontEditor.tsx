"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import {
  DEFAULT_HERITAGE,
  HERITAGE_LAYERS,
  PRO_PRICE_INR,
  SKINS,
  SKIN_ORDER,
  skinIsAvailable,
  type Heritage,
  type HeritageId,
  type SkinDraft,
} from "@/lib/skins";
import type { Piece, SkinId, SkinMode, Studio } from "@/lib/types";
import { useFormState } from "react-dom";
import { publishSkinAction } from "@/lib/actions/storefront";
import type { ListingState } from "@/lib/plans";
import { AtelierPreview } from "./AtelierPreview";
import { HandoverPanel } from "./HandoverPanel";
import { ShopDetailsPanel } from "./ShopDetailsPanel";

/**
 * S9 — the storefront editor.
 *
 * A seller picks one hue and one mode for their shop, and decides how much of
 * the heritage ornament to carry. Those choices repaint their storefront only:
 * buyers keep their own hue everywhere else on CraftGali, which is why this is
 * a separate setting from the one in the header.
 *
 * There is no backend for it yet. Rather than a Publish button that silently
 * does nothing, the draft is kept in this browser and the page says plainly
 * that publishing is still to come — so the design can be reviewed and lived
 * with now, and the wiring is a small, separate job.
 */
export function StorefrontEditor({
  studio,
  pieces,
  citySlug,
  neighbourhood,
  publishedSkin,
  tagline,
  bio,
  coverId,
  avatarId,
  pro,
}: {
  studio: Studio;
  pieces: Piece[];
  /** The shop's stored handover location — editable here, and nowhere else. */
  citySlug: string | null;
  neighbourhood: string;
  /** What the row actually says — the comp may say otherwise, and loses. */
  publishedSkin: SkinDraft;
  tagline: string;
  bio: string;
  coverId: string | null;
  avatarId: string | null;
  /** From the seller's plan. Hard-coded false until billing exists. */
  pro: boolean;
}) {
  /* What the storefront is actually serving right now. */
  const published = publishedSkin;
  const [publish, publishState] = useFormState(publishSkinAction, null as ListingState);

  const [draft, setDraft] = useState<SkinDraft>(published);
  const [restored, setRestored] = useState(false);

  const key = `cg-skin-draft:${studio.handle}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setDraft({ ...published, ...JSON.parse(saved) });
        setRestored(true);
      }
    } catch {
      /* A malformed or unreadable draft is not worth an error — the published
         skin is a perfectly good starting point. */
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [key]);

  function update(next: Partial<SkinDraft>) {
    const merged = { ...draft, ...next };
    setDraft(merged);
    setRestored(false);
    try {
      localStorage.setItem(key, JSON.stringify(merged));
    } catch {
      /* private mode — the draft just doesn't outlive the tab */
    }
  }

  function toggleLayer(id: HeritageId) {
    update({ heritage: { ...draft.heritage, [id]: !draft.heritage[id] } as Heritage });
  }

  function revert() {
    setDraft(published);
    setRestored(false);
    try {
      localStorage.removeItem(key);
    } catch {
      /* nothing to clean up */
    }
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(published);

  /* A publish that landed makes the browser draft stale — clear it so a reload
     does not "restore" a draft identical to what is now live. */
  useEffect(() => {
    if (publish?.done) {
      try { localStorage.removeItem(key); } catch { /* fine */ }
      setRestored(false);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [publish?.done]);
  const needsPro = !skinIsAvailable(draft.hue, pro);

  return (
    <main className="cg-editor">
      <header className="cg-editor__head">
        <div>
          <h1 className="cg-editor__title">Your atelier skin</h1>
          <p className="cg-editor__lede">
            One hue, one mode. It repaints your storefront&rsquo;s header, buttons,
            accents and heritage tinting — buyers keep their own hue everywhere else
            on CraftGali.
          </p>
        </div>

        <div className="cg-editor__actions">
          <Link href={`/artist/${studio.handle}`} className="cg-btn cg-btn--outline">
            Preview as buyer
          </Link>
          <form action={publishState}>
            <input type="hidden" name="hue" value={draft.hue} />
            <input type="hidden" name="mode" value={draft.mode} />
            {HERITAGE_LAYERS.map((layer) => (
              <input key={layer.id} type="hidden" name={`heritage.${layer.id}`}
                     value={draft.heritage[layer.id] ? "on" : "off"} />
            ))}
            <button type="submit" className="cg-btn cg-btn--solid" disabled={!dirty || needsPro}
                    title={needsPro ? "This hue needs Pro Studio" : !dirty ? "Nothing to publish" : undefined}>
              Publish changes
            </button>
          </form>
        </div>
      </header>

      {publish?.error ? <p className="cg-form__error" role="alert">{publish.error}</p> : null}
      {publish?.done ? <p className="cg-form__done" role="status">{publish.done}</p> : null}

      <div className="cg-editor__grid">
        <div className="cg-editor__left">
          <section>
            <div className="cg-editor__sechead">
              <h2 className="cg-eyebrow">Choose a hue</h2>
              {/* Coming back to find an old draft is exactly when you most want
                  a way out of it, so the note never replaces the escape hatch. */}
              {dirty ? (
                <span className="cg-editor__state">
                  {restored ? (
                    <span className="cg-editor__note">Draft restored</span>
                  ) : null}
                  <button type="button" className="cg-editor__revert" onClick={revert}>
                    Revert to published
                  </button>
                </span>
              ) : null}
            </div>

            <div className="cg-skins">
              {SKIN_ORDER.map((id) => (
                <SkinCard
                  key={id}
                  id={id}
                  mode={draft.mode}
                  chosen={draft.hue === id}
                  published={published.hue === id}
                  locked={!skinIsAvailable(id, pro)}
                  onChoose={() => update({ hue: id })}
                />
              ))}
            </div>
          </section>

          <section className="cg-card cg-layers">
            <header className="cg-card__head">
              <h2 className="cg-eyebrow">Heritage layer</h2>
              <span className="cg-card__aside">
                {Object.values(draft.heritage).filter(Boolean).length} of{" "}
                {HERITAGE_LAYERS.length} on
              </span>
            </header>

            <ul className="cg-layers__list">
              {HERITAGE_LAYERS.map((layer) => (
                <li key={layer.id}>
                  <button
                    type="button"
                    className="cg-tick"
                    aria-pressed={draft.heritage[layer.id]}
                    onClick={() => toggleLayer(layer.id)}
                  >
                    <span className="cg-tick__box">
                      {draft.heritage[layer.id] ? <Check /> : null}
                    </span>
                    <span>
                      <span className="cg-tick__label">{layer.label}</span>
                      <span className="cg-tick__note">{layer.note}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="cg-card__note cg-card__note--ruled">
              Ornament is a matter of taste and of craft — a textile workshop can carry
              far more pattern than a photographer. Turn it all off and the shop is
              plain glass.
            </p>
          </section>

          {/* Unlike the hue and the ornament above, this one is not a draft:
              it writes straight through, because a wrong city is not a matter of
              taste — it is a shop nobody can find. */}
          <ShopDetailsPanel tagline={tagline} bio={bio} coverId={coverId} avatarId={avatarId} />
          <HandoverPanel city={citySlug} neighbourhood={neighbourhood} />
        </div>

        <div className="cg-editor__right">
          <section className="cg-card cg-editor__preview">
            <header className="cg-card__head">
              <h2 className="cg-eyebrow">Live preview</h2>
              <span className="cg-card__aside">craftgali.com/@{studio.handle}</span>
            </header>

            <div className="cg-modes" role="group" aria-label="Storefront mode">
              {(["light", "dark"] as SkinMode[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className="cg-chip"
                  aria-pressed={draft.mode === option}
                  onClick={() => update({ mode: option })}
                >
                  {option === "light" ? "☀ Light" : "☾ Dark"}
                </button>
              ))}
            </div>

            <AtelierPreview
              studio={studio}
              pieces={pieces}
              hue={draft.hue}
              mode={draft.mode}
              heritage={draft.heritage}
            />

            <p className="cg-card__note">
              This is your shop as a buyer will see it, whatever hue they browse
              CraftGali in.
            </p>
          </section>

          <section className={`cg-pro ${needsPro ? "cg-pro--wanted" : ""}`}>
            <h2 className="cg-eyebrow cg-eyebrow--accent">
              Pro Studio · ₹{PRO_PRICE_INR} / month
            </h2>
            <p className="cg-pro__title">
              {needsPro
                ? `${SKINS[draft.hue].name} needs Pro Studio`
                : "Unlock Light Pink and Teal Breeze"}
            </p>
            <p className="cg-pro__body">
              Both Pro skins, plus unlimited pieces live at once. Still 0% commission —
              the skin is cosmetic, and your listings, chats and offers work exactly the
              same on the free plan.
            </p>
            <button type="button" className="cg-btn cg-btn--solid cg-btn--block" disabled title="Billing is still being built">
              Upgrade to Pro Studio
            </button>
            <p className="cg-pro__foot">Billing is still being built.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------ one skin --- */

function SkinCard({
  id,
  mode,
  chosen,
  published,
  locked,
  onChoose,
}: {
  id: SkinId;
  mode: SkinMode;
  chosen: boolean;
  published: boolean;
  locked: boolean;
  onChoose: () => void;
}) {
  const skin = SKINS[id];

  return (
    <button
      type="button"
      className={`cg-skin ${chosen ? "cg-skin--chosen" : ""}`}
      aria-pressed={chosen}
      onClick={onChoose}
    >
      {/* The swatch is the wordmark in that hue, at that mode — the fastest
          honest answer to "what does this actually look like". */}
      <span className="cg-skin__swatch cg-skinned" data-hue={id} data-mode={mode}>
        <span className="cg-skin__seam" aria-hidden="true" />
        <Wordmark size="sm" />
      </span>

      <span className="cg-skin__row">
        <span className="cg-skin__name">{skin.name}</span>
        <span className={`cg-skin__tag ${locked ? "cg-skin__tag--pro" : ""}`}>
          {published ? "Live" : locked ? "🔒 Pro" : "Included"}
        </span>
      </span>

      <span className="cg-skin__blurb">{skin.blurb}</span>
    </button>
  );
}

function Check() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden="true">
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}
