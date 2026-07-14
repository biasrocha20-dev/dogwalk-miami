"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const PetSchema = z.object({
  name: z.string().min(1, { error: "Name is required." }),
  breed: z.string().optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  notes: z.string().optional(),
  vaccinationStatus: z.enum(["up_to_date", "pending", "unknown"]).default("unknown"),
});

export type PetFormState = { error?: string } | undefined;

export async function createPet(
  _prevState: PetFormState,
  formData: FormData,
): Promise<PetFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const parsed = PetSchema.safeParse({
    name: formData.get("name"),
    breed: formData.get("breed") || undefined,
    size: formData.get("size") || undefined,
    notes: formData.get("notes") || undefined,
    vaccinationStatus: formData.get("vaccinationStatus") || "unknown",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { error } = await supabase.from("pets").insert({
    owner_id: user.id,
    name: parsed.data.name,
    breed: parsed.data.breed ?? null,
    size: parsed.data.size ?? null,
    notes: parsed.data.notes ?? null,
    vaccination_status: parsed.data.vaccinationStatus,
  });
  if (error) return { error: error.message };

  revalidatePath("/owner/pets");
}

export async function deletePet(petId: string) {
  const supabase = await createClient();
  await supabase.from("pets").delete().eq("id", petId);
  revalidatePath("/owner/pets");
}
