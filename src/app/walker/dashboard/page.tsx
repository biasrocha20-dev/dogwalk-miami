"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth";
import { statusBadgeClass } from "@/lib/status";
import { BookingActions } from "./booking-actions";

type BookingRow = {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  price: number;
  notes: string | null;
  pets: { name: string; notes: string | null } | null;
  profiles: { full_name: string } | null;
};

export default function WalkerDashboardPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRow[] | null>(null);

  const loadBookings = useCallback(async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from("bookings")
      .select(
        "id, scheduled_at, duration_minutes, status, price, notes, pets(name, notes), profiles!bookings_owner_id_fkey(full_name)",
      )
      .eq("walker_id", session.user.id)
      .order("scheduled_at", { ascending: true });
    setBookings((data as unknown as BookingRow[]) ?? []);
  }, [session?.user]);

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (loading || !session) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-2xl font-medium text-[var(--color-ink)]">My bookings</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Requests and upcoming walks.</p>

      <div className="mt-8 space-y-3">
        {bookings?.length ? (
          bookings.map((b) => (
            <div key={b.id} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[var(--color-ink)]">
                  {b.pets?.name} · owner {b.profiles?.full_name ?? "—"}
                </p>
                <span className={statusBadgeClass(b.status)}>{b.status}</span>
              </div>
              <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                {new Date(b.scheduled_at).toLocaleString()} · {b.duration_minutes} min · $
                {b.price.toFixed(2)}
              </p>
              {(b.notes || b.pets?.notes) && (
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {b.pets?.notes} {b.notes ? `· ${b.notes}` : ""}
                </p>
              )}
              <div className="mt-3.5">
                <BookingActions bookingId={b.id} status={b.status} onUpdated={loadBookings} />
              </div>
            </div>
          ))
        ) : (
          <div className="card p-8 text-center text-sm text-[var(--color-muted)]">
            No booking requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
