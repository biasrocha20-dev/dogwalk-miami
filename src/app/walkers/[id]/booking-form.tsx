"use client";

import { useActionState } from "react";
import { createBooking } from "@/app/actions/bookings";
import type { Pet } from "@/lib/types";

const DURATIONS = [20, 30, 60] as const;

export function BookingForm({ walkerId, pets }: { walkerId: string; pets: Pet[] }) {
  const [state, formAction, pending] = useActionState(createBooking, undefined);

  if (pets.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Add a pet profile before booking a walk. Go to{" "}
        <a href="/owner/pets" className="font-medium text-teal-700 hover:underline">
          My pets
        </a>
        .
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="walkerId" value={walkerId} />

      <div>
        <label htmlFor="petId" className="block text-sm font-medium text-slate-700">
          Which pet?
        </label>
        <select
          id="petId"
          name="petId"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        >
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="scheduledAt" className="block text-sm font-medium text-slate-700">
          Date &amp; time
        </label>
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="durationMinutes" className="block text-sm font-medium text-slate-700">
          Duration
        </label>
        <select
          id="durationMinutes"
          name="durationMinutes"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d} minutes
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes for the walker (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {pending ? "Booking…" : "Request booking"}
      </button>
    </form>
  );
}
