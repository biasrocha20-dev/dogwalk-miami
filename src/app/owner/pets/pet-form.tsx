"use client";

import { useActionState, useRef, useEffect } from "react";
import { createPet } from "@/app/actions/pets";

export function PetForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(createPet, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && state?.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [pending, state, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="field-label">
          Name
        </label>
        <input id="name" name="name" required className="field-input" />
      </div>
      <div>
        <label htmlFor="breed" className="field-label">
          Breed
        </label>
        <input id="breed" name="breed" className="field-input" />
      </div>
      <div>
        <label htmlFor="size" className="field-label">
          Size
        </label>
        <select id="size" name="size" className="field-input">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label htmlFor="vaccinationStatus" className="field-label">
          Vaccination status
        </label>
        <select id="vaccinationStatus" name="vaccinationStatus" className="field-input">
          <option value="up_to_date">Up to date</option>
          <option value="pending">Pending</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="field-label">
          Notes for walkers
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Leash pulling, friendly with other dogs, afraid of thunder…"
          className="field-input"
        />
      </div>

      {state?.error && (
        <p className="rounded-xl bg-[var(--color-accent-soft)] px-3.5 py-2.5 text-sm text-[var(--color-accent-hover)] sm:col-span-2">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Adding…" : "Add pet"}
        </button>
      </div>
    </form>
  );
}
