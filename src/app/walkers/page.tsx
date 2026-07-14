import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MIAMI_NEIGHBORHOODS } from "@/lib/neighborhoods";

type WalkerRow = {
  user_id: string;
  bio: string | null;
  rate_per_walk: number;
  service_neighborhoods: string[];
  rating_avg: number;
  rating_count: number;
  profiles: { full_name: string } | null;
};

export default async function WalkersPage({
  searchParams,
}: {
  searchParams: Promise<{ neighborhood?: string }>;
}) {
  const { neighborhood } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("walker_profiles")
    .select("user_id, bio, rate_per_walk, service_neighborhoods, rating_avg, rating_count, profiles(full_name)")
    .eq("active", true);

  if (neighborhood) {
    query = query.contains("service_neighborhoods", [neighborhood]);
  }

  const { data: walkers } = await query;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Find a dog walker in Miami</h1>
      <p className="mt-1 text-sm text-slate-500">Vetted walkers across every neighborhood.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/walkers"
          className={`rounded-full border px-3 py-1.5 text-sm ${
            !neighborhood
              ? "border-teal-600 bg-teal-50 text-teal-700"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          All
        </Link>
        {MIAMI_NEIGHBORHOODS.map((n) => (
          <Link
            key={n}
            href={`/walkers?neighborhood=${encodeURIComponent(n)}`}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              neighborhood === n
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {n}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {(walkers as unknown as WalkerRow[] | null)?.length ? (
          (walkers as unknown as WalkerRow[]).map((w) => (
            <Link
              key={w.user_id}
              href={`/walkers/${w.user_id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
            >
              <p className="font-semibold text-slate-900">
                {w.profiles?.full_name ?? "Walker"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                ${w.rate_per_walk.toFixed(2)} / walk ·{" "}
                {w.rating_count > 0 ? `${w.rating_avg.toFixed(1)}★ (${w.rating_count})` : "New"}
              </p>
              {w.bio && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{w.bio}</p>}
              <div className="mt-3 flex flex-wrap gap-1">
                {w.service_neighborhoods.map((n) => (
                  <span
                    key={n}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-slate-500">No walkers found in this area yet.</p>
        )}
      </div>
    </div>
  );
}
