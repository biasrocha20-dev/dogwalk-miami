import * as z from "zod";
import { supabase } from "@/lib/supabase/client";

const BookingSchema = z.object({
  walkerId: z.uuid(),
  petId: z.uuid(),
  scheduledAt: z.string().min(1, { error: "Choose a date and time." }),
  durationMinutes: z.coerce.number().refine((v) => [20, 30, 60].includes(v), {
    error: "Choose a valid duration.",
  }),
  notes: z.string().optional(),
});

export type BookingFormState = { error?: string; success?: boolean } | undefined;

export async function createBooking(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to book a walk." };

  const parsed = BookingSchema.safeParse({
    walkerId: formData.get("walkerId"),
    petId: formData.get("petId"),
    scheduledAt: formData.get("scheduledAt"),
    durationMinutes: formData.get("durationMinutes"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const scheduledDate = new Date(parsed.data.scheduledAt);
  if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() < Date.now()) {
    return { error: "Choose a date and time in the future." };
  }

  const { data: walkerProfile } = await supabase
    .from("walker_profiles")
    .select("rate_per_walk, active")
    .eq("user_id", parsed.data.walkerId)
    .single();
  if (!walkerProfile || !walkerProfile.active) {
    return { error: "This walker is not currently available." };
  }

  const { data: pet } = await supabase
    .from("pets")
    .select("id")
    .eq("id", parsed.data.petId)
    .eq("owner_id", user.id)
    .single();
  if (!pet) return { error: "Select one of your pets." };

  const price = Number(((walkerProfile.rate_per_walk * parsed.data.durationMinutes) / 30).toFixed(2));

  const { error } = await supabase.from("bookings").insert({
    owner_id: user.id,
    walker_id: parsed.data.walkerId,
    pet_id: parsed.data.petId,
    scheduled_at: scheduledDate.toISOString(),
    duration_minutes: parsed.data.durationMinutes,
    price,
    notes: parsed.data.notes ?? null,
  });
  if (error) return { error: error.message };

  return { success: true };
}

export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "cancelled" | "completed",
) {
  await supabase.from("bookings").update({ status }).eq("id", bookingId);
}
