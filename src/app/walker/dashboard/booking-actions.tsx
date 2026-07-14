"use client";

import { updateBookingStatus } from "@/app/actions/bookings";

export function BookingActions({
  bookingId,
  status,
  onUpdated,
}: {
  bookingId: string;
  status: string;
  onUpdated?: () => void;
}) {
  async function update(newStatus: "confirmed" | "cancelled" | "completed") {
    await updateBookingStatus(bookingId, newStatus);
    onUpdated?.();
  }

  if (status === "pending") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => update("confirmed")}
          className="rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
        >
          Confirm
        </button>
        <button
          onClick={() => update("cancelled")}
          className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-ink-soft)] transition hover:border-[var(--color-ink-soft)]"
        >
          Decline
        </button>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <button
        onClick={() => update("completed")}
        className="rounded-full bg-[var(--color-ink)] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
      >
        Mark completed
      </button>
    );
  }

  return null;
}
