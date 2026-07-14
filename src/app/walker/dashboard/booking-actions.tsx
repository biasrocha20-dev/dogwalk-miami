"use client";

import { updateBookingStatus } from "@/app/actions/bookings";

export function BookingActions({ bookingId, status }: { bookingId: string; status: string }) {
  if (status === "pending") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => updateBookingStatus(bookingId, "confirmed")}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
        >
          Confirm
        </button>
        <button
          onClick={() => updateBookingStatus(bookingId, "cancelled")}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400"
        >
          Decline
        </button>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <button
        onClick={() => updateBookingStatus(bookingId, "completed")}
        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
      >
        Mark completed
      </button>
    );
  }

  return null;
}
