"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { openStudioAction, type FormState } from "@/lib/actions/auth";
import { CITIES } from "@/lib/cities";
import {
  checkHandle,
  normaliseHandle,
  suggestHandle,
  HANDLE_MAX,
  STUDIO_CATEGORIES as CATEGORIES,
} from "@/lib/handles";

const EMPTY: FormState = null;

export function StudioForm({
  suggestedName,
  suggestedCity,
}: {
  suggestedName: string;
  suggestedCity: string;
}) {
  const [state, action] = useFormState(openStudioAction, EMPTY);
  const [name, setName] = useState(suggestedName);
  const [handle, setHandle] = useState(suggestHandle(suggestedName));
  const [touchedHandle, setTouchedHandle] = useState(false);
  const [picked, setPicked] = useState<string[]>([CATEGORIES[0]]);

  function rename(value: string) {
    setName(value);
    if (!touchedHandle) setHandle(suggestHandle(value));
  }

  /* The same check the server will run. Showing it here turns a round trip and
     a red box into a note under the field — but the server still decides. */
  const verdict = checkHandle(handle);
  const handleFault = touchedHandle && !verdict.ok ? verdict.reason : null;

  function toggle(category: string) {
    setPicked((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  }

  return (
    <form action={action} className="cg-form">
      <label className="cg-field">
        <span className="cg-field__label">Storefront name</span>
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(event) => rename(event.target.value)}
          placeholder="Meera's Clay Atelier"
          aria-invalid={state?.field === "name" || undefined}
        />
      </label>

      <label className="cg-field">
        <span className="cg-field__label">
          Handle
          <span className="cg-field__hint">craftgali.com/@{handle || "…"}</span>
        </span>
        <input
          type="text"
          name="handle"
          required
          maxLength={HANDLE_MAX}
          value={handle}
          onChange={(event) => {
            setTouchedHandle(true);
            setHandle(normaliseHandle(event.target.value));
          }}
          aria-describedby="cg-handle-note"
          aria-invalid={Boolean(handleFault) || state?.field === "handle" || undefined}
        />
        <span className="cg-field__hint" id="cg-handle-note">
          {handleFault ?? "Buyers will type this. Letters, digits and single hyphens."}
        </span>
      </label>

      <fieldset className="cg-field cg-field--set">
        <legend className="cg-field__label">What do you make?</legend>
        <div className="cg-field__chips">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className="cg-chip"
              aria-pressed={picked.includes(category)}
              onClick={() => toggle(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {picked.map((category) => (
          <input key={category} type="hidden" name="categories" value={category} />
        ))}
      </fieldset>

      <label className="cg-field">
        <span className="cg-field__label">City</span>
        <select name="city" defaultValue={suggestedCity} required aria-invalid={state?.field === "city" || undefined}>
          {[...CITIES].sort((a, b) => a.name.localeCompare(b.name)).map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name} · {city.state}
            </option>
          ))}
        </select>
        <span className="cg-field__hint">
          Buyers search by city and distance. This is the only location a listing
          of yours will ever carry.
        </span>
      </label>

      <label className="cg-field">
        <span className="cg-field__label">
          Pickup neighbourhood{" "}
          <span className="cg-field__hint">buyers never see your address</span>
        </span>
        <input
          type="text"
          name="neighbourhood"
          required
          placeholder="Bandra West"
          aria-invalid={state?.field === "neighbourhood" || undefined}
        />
      </label>

      {state?.error ? (
        <p className="cg-form__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <p className="cg-field__hint">
        Your handle is your public address, and it is not something you can swap
        casually later — every link you have shared points at it.
      </p>

      <SubmitButton busy="Opening your studio…">Open my studio</SubmitButton>
    </form>
  );
}
