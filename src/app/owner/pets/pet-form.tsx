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
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-slate-700">
          Breed
        </label>
        <input
          id="breed"
          name="breed"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-slate-700">
          Size
        </label>
        <select
          id="size"
          name="size"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div>
        <label htmlFor="vaccinationStatus" className="block text-sm font-medium text-slate-700">
          Vaccination status
        </label>
        <select
          id="vaccinationStatus"
          name="vaccinationStatus"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="up_to_date">Up to date</option>
          <option value="pending">Pending</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes for walkers
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Leash pulling, friendly with other dogs, afraid of thunder…"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add pet"}
        </button>
      </div>
    </form>
  );
}
