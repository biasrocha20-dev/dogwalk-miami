import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Pet } from "@/lib/types";
import { BookingForm } from "./booking-form";

export default async function WalkerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: walker } = await supabase
    .from("walker_profiles")
    .select("user_id, bio, rate_per_walk, service_neighborhoods, rating_avg, rating_count, profiles(full_name)")
    .eq("user_id", id)
    .eq("active", true)
    .single();

  if (!walker) notFound();

  const profileName =
    (walker.profiles as unknown as { full_name: string } | null)?.full_name ?? "Walker";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let pets: Pet[] = [];
  if (user) {
    const { data } = await supabase.from("pets").select("*").eq("owner_id", user.id);
    pets = (data as Pet[]) ?? [];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">{profileName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          ${walker.rate_per_walk.toFixed(2)} / walk ·{" "}
          {walker.rating_count > 0
            ? `${walker.rating_avg.toFixed(1)}★ (${walker.rating_count} reviews)`
            : "New walker"}
        </p>
        {walker.bio && <p className="mt-4 text-slate-700">{walker.bio}</p>}
        <div className="mt-4 flex flex-wrap gap-1">
          {walker.service_neighborhoods.map((n: string) => (
            <span key={n} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Book a walk</h2>
        <div className="mt-4">
          {user ? (
            <BookingForm walkerId={walker.user_id} pets={pets} />
          ) : (
            <p className="text-sm text-slate-600">
              <a href="/login" className="font-medium text-teal-700 hover:underline">
                Log in
              </a>{" "}
              as a dog owner to book this walker.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
