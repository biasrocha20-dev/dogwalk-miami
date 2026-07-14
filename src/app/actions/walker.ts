import * as z from "zod";
import { supabase } from "@/lib/supabase/client";
import { MIAMI_NEIGHBORHOODS } from "@/lib/neighborhoods";

const WalkerProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  ratePerWalk: z.coerce.number().min(5).max(500),
  neighborhoods: z.array(z.enum(MIAMI_NEIGHBORHOODS)).min(1, {
    error: "Select at least one service neighborhood.",
  }),
});

export type WalkerFormState = { error?: string; success?: boolean } | undefined;

export async function updateWalkerProfile(
  _prevState: WalkerFormState,
  formData: FormData,
): Promise<WalkerFormState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const parsed = WalkerProfileSchema.safeParse({
    bio: formData.get("bio") || undefined,
    ratePerWalk: formData.get("ratePerWalk"),
    neighborhoods: formData.getAll("neighborhoods"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { error } = await supabase
    .from("walker_profiles")
    .update({
      bio: parsed.data.bio ?? null,
      rate_per_walk: parsed.data.ratePerWalk,
      service_neighborhoods: parsed.data.neighborhoods,
      active: true,
    })
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  return { success: true };
}
