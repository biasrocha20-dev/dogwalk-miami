import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { WalkerProfile } from "@/lib/types";
import { WalkerProfileForm } from "./walker-profile-form";

export default async function WalkerOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: walkerProfile } = await supabase
    .from("walker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!walkerProfile) redirect("/owner/pets");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Your walker profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        This is what dog owners see when browsing walkers in your area.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <WalkerProfileForm walkerProfile={walkerProfile as WalkerProfile} />
      </div>
    </div>
  );
}
