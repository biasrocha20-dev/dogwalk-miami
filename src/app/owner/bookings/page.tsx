"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth";
import { statusBadgeClass } from "@/lib/status";

type BookingRow = {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  price: number;
  pets: { name: string } | null;
  walker_profiles: { profiles: { full_name: string } | null } | null;
};

function OwnerBookingsContent() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const booked = searchParams.get("booked");
  const [bookings, setBookings] = useState<BookingRow[] | null>(null);

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    if (!session?.user) return;
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select(
          "id, scheduled_at, duration_minutes, status, price, pets(name), walker_profiles(profiles(full_name))",
        )
        .eq("owner_id", session.user.id)
        .order("scheduled_at", { ascending: false });
      setBookings((data as unknown as BookingRow[]) ?? []);
    })();
  }, [session?.user]);

  if (loading || !session) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-2xl font-medium text-[var(--color-ink)]">My bookings</h1>

      {booked && (
        <p className="mt-4 rounded-xl bg-[var(--color-primary-soft)] px-4 py-3 text-sm font-medium text-[var(--color-primary)]">
          🎉 Booking request sent! The walker will confirm shortly.
        </p>
      )}

      <div className="mt-8 space-y-3">
        {bookings?.length ? (
          bookings.map((b) => (
            <div key={b.id} className="card card-hover p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[var(--color-ink)]">
                  {b.pets?.name} with {b.walker_profiles?.profiles?.full_name ?? "Walker"}
                </p>
                <span className={statusBadgeClass(b.status)}>{b.status}</span>
              </div>
              <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                {new Date(b.scheduled_at).toLocaleString()} · {b.duration_minutes} min · $
                {b.price.toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <div className="card p-8 text-center text-sm text-[var(--color-muted)]">
            No bookings yet — find a walker to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export default function OwnerBookingsPage() {
  return (
    <Suspense>
      <OwnerBookingsContent />
    </Suspense>
  );
}
