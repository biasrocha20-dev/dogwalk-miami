"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { Pet } from "@/lib/types";
import { BookingForm } from "./booking-form";

type WalkerDetail = {
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

function WalkerDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { session } = useAuth();
  const [walker, setWalker] = useState<WalkerDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("walker_profiles")
        .select(
          "user_id, bio, service_neighborhoods, rating_avg, rating_count, profiles(full_name)",
        )
        .eq("user_id", id)
        .eq("active", true)
        .single();

      if (!data) {
        setNotFound(true);
        return;
      }
      setWalker(data as unknown as WalkerDetail);
    })();
  }, [id]);

  useEffect(() => {
    if (!session?.user) return;
    (async () => {
      const { data } = await supabase.from("pets").select("*").eq("owner_id", session.user.id);
      setPets((data as Pet[]) ?? []);
    })();
  }, [session?.user]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="card p-8 text-center text-sm text-[var(--color-muted)]">
          Walker not found.
        </div>
      </div>
    );
  }

  if (!walker) return null;

  const profileName = walker.profiles?.full_name ?? "Walker";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="card p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xl font-semibold text-white">
            {initials(profileName)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium text-[var(--color-ink)]">
              {profileName}
            </h1>
            <p className="mt-0.5 text-sm text-[var(--color-muted)]">
              {walker.rating_count > 0
                ? `${walker.rating_avg.toFixed(1)}★ (${walker.rating_count} reviews)`
                : "New walker"}
            </p>
          </div>
        </div>
        {walker.bio && (
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {walker.bio}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {walker.service_neighborhoods.map((n) => (
            <span
              key={n}
              className="rounded-full bg-[var(--color-border-soft)] px-2.5 py-1 text-xs text-[var(--color-ink-soft)]"
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="card mt-6 p-7">
        <h2 className="font-display text-lg font-medium text-[var(--color-ink)]">
          Book a walk
        </h2>
        <div className="mt-4">
          {session?.user ? (
            <BookingForm walkerId={walker.user_id} pets={pets} />
          ) : (
            <p className="text-sm text-[var(--color-ink-soft)]">
              <a href="/login" className="btn-text">
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

export default function WalkerDetailPage() {
  return (
    <Suspense>
      <WalkerDetailContent />
    </Suspense>
  );
}
