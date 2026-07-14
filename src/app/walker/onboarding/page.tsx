"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { WalkerProfile } from "@/lib/types";
import { WalkerProfileForm } from "./walker-profile-form";

export default function WalkerOnboardingPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [walkerProfile, setWalkerProfile] = useState<WalkerProfile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    if (!session?.user) return;
    (async () => {
      const { data } = await supabase
        .from("walker_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      if (!data) {
        router.replace("/owner/pets");
        return;
      }
      setWalkerProfile(data as WalkerProfile);
      setChecked(true);
    })();
  }, [session?.user, router]);

  if (loading || !session || !checked || !walkerProfile) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Your walker profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        This is what dog owners see when browsing walkers in your area.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <WalkerProfileForm walkerProfile={walkerProfile} />
      </div>
    </div>
  );
}
