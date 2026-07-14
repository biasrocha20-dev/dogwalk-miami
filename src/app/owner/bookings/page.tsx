import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type BookingRow = {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  price: number;
  pets: { name: string } | null;
  walker_profiles: { profiles: { full_name: string } | null } | null;
};

export default async function OwnerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string }>;
}) {
  const { booked } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, scheduled_at, duration_minutes, status, price, pets(name), walker_profiles(profiles(full_name))",
    )
    .eq("owner_id", user.id)
    .order("scheduled_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">My bookings</h1>

      {booked && (
        <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-700">
          Booking request sent! The walker will confirm shortly.
        </p>
      )}

      <div className="mt-8 space-y-3">
        {(bookings as unknown as BookingRow[] | null)?.length ? (
          (bookings as unknown as BookingRow[]).map((b) => (
            <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">
                  {b.pets?.name} with {b.walker_profiles?.profiles?.full_name ?? "Walker"}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    b.status === "confirmed"
                      ? "bg-teal-50 text-teal-700"
                      : b.status === "cancelled"
                        ? "bg-red-50 text-red-600"
                        : b.status === "completed"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {new Date(b.scheduled_at).toLocaleString()} · {b.duration_minutes} min · $
                {b.price.toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No bookings yet — find a walker to get started.
          </p>
        )}
      </div>
    </div>
  );
}
