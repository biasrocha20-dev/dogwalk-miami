"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { MIAMI_NEIGHBORHOODS } from "@/lib/neighborhoods";

type WalkerRow = {
  user_id: string;
  bio: string | null;
  service_neighborhoods: string[];
  rating_avg: number;
  rating_count: number;
  profiles: { full_name: string } | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function WalkersContent() {
  const searchParams = useSearchParams();
  const neighborhood = searchParams.get("neighborhood");
  const [walkers, setWalkers] = useState<WalkerRow[] | null>(null);

  useEffect(() => {
    (async () => {
      let query = supabase
        .from("walker_profiles")
        .select(
          "user_id, bio, service_neighborhoods, rating_avg, rating_count, profiles(full_name)",
        )
        .eq("active", true);

      if (neighborhood) {
        query = query.contains("service_neighborhoods", [neighborhood]);
      }

      const { data } = await query;
      setWalkers((data as unknown as WalkerRow[]) ?? []);
    })();
  }, [neighborhood]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-2xl font-medium text-[var(--color-ink)]">
        Find a dog walker in Miami
      </h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Vetted walkers across every neighborhood. Walks start at $15 for 30 minutes, $30 for an
        hour.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/walkers" className={!neighborhood ? "pill-active" : "pill"}>
          All
        </Link>
        {MIAMI_NEIGHBORHOODS.map((n) => (
          <Link
            key={n}
            href={`/walkers?neighborhood=${encodeURIComponent(n)}`}
            className={neighborhood === n ? "pill-active" : "pill"}
          >
            {n}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {walkers?.length ? (
          walkers.map((w) => {
            const name = w.profiles?.full_name ?? "Walker";
            return (
              <Link
                key={w.user_id}
                href={`/walkers/detail?id=${w.user_id}`}
                className="card card-hover flex flex-col p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
                    {initials(name)}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">{name}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {w.rating_count > 0
                        ? `${w.rating_avg.toFixed(1)}★ (${w.rating_count})`
                        : "New walker"}
                    </p>
                  </div>
                </div>
                {w.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-[var(--color-ink-soft)]">
                    {w.bio}
                  </p>
                )}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {w.service_neighborhoods.map((n) => (
                    <span
                      key={n}
                      className="rounded-full bg-[var(--color-border-soft)] px-2.5 py-1 text-xs text-[var(--color-ink-soft)]"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })
        ) : walkers ? (
          <div className="card p-8 text-center text-sm text-[var(--color-muted)] sm:col-span-2">
            No walkers found in this area yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function WalkersPage() {
  return (
    <Suspense>
      <WalkersContent />
    </Suspense>
  );
}
