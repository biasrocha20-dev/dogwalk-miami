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
  rate_per_walk: number;
  service_neighborhoods: string[];
  rating_avg: number;
  rating_count: number;
  profiles: { full_name: string } | null;
};

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
          "user_id, bio, rate_per_walk, service_neighborhoods, rating_avg, rating_count, profiles(full_name)",
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
        <p className="text-sm text-slate-600">Walker not found.</p>
      </div>
    );
  }

  if (!walker) return null;

  const profileName = walker.profiles?.full_name ?? "Walker";

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
          {walker.service_neighborhoods.map((n) => (
            <span key={n} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Book a walk</h2>
        <div className="mt-4">
          {session?.user ? (
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

export default function WalkerDetailPage() {
  return (
    <Suspense>
      <WalkerDetailContent />
    </Suspense>
  );
}
