"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/app/actions/bookings";
import { DURATION_PRICES } from "@/lib/pricing";
import type { Pet } from "@/lib/types";

const DURATIONS = [20, 30, 60] as const;

export function BookingForm({ walkerId, pets }: { walkerId: string; pets: Pet[] }) {
  const [state, formAction, pending] = useActionState(createBooking, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.push("/owner/bookings?booked=1");
  }, [state, router]);

  if (pets.length === 0) {
    return (
      <p className="text-sm text-[var(--color-ink-soft)]">
        Add a pet profile before booking a walk. Go to{" "}
        <a href="/owner/pets" className="btn-text">
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
        <label htmlFor="petId" className="field-label">
          Which pet?
        </label>
        <select id="petId" name="petId" required className="field-input">
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="scheduledAt" className="field-label">
          Date &amp; time
        </label>
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="durationMinutes" className="field-label">
          Duration
        </label>
        <select id="durationMinutes" name="durationMinutes" required className="field-input">
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d === 60 ? "1 hour" : `${d} minutes`} — ${DURATION_PRICES[d]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="field-label">
          Notes for the walker (optional)
        </label>
        <textarea id="notes" name="notes" rows={2} className="field-input" />
      </div>

      {state?.error && (
        <p className="rounded-xl bg-[var(--color-accent-soft)] px-3.5 py-2.5 text-sm text-[var(--color-accent-hover)]">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-accent w-full">
        {pending ? "Booking…" : "Request booking"}
      </button>
    </form>
  );
}
