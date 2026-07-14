"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { Pet } from "@/lib/types";
import { PetForm } from "./pet-form";
import { DeletePetButton } from "./delete-pet-button";

const SIZE_EMOJI: Record<string, string> = { small: "🐕", medium: "🐕‍🦺", large: "🐩" };

export default function OwnerPetsPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[] | null>(null);

  const loadPets = useCallback(async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", session.user.id)
      .order("created_at", { ascending: false });
    setPets((data as Pet[]) ?? []);
  }, [session?.user]);

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  if (loading || !session) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-2xl font-medium text-[var(--color-ink)]">My pets</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Keep this up to date so walkers know how to care for your dog.
      </p>

      <div className="card mt-8 p-6">
        <PetForm onSuccess={loadPets} />
      </div>

      <div className="mt-8 space-y-3">
        {pets?.length ? (
          pets.map((pet) => (
            <div key={pet.id} className="card card-hover flex items-start justify-between p-5">
              <div className="flex gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-xl">
                  {SIZE_EMOJI[pet.size ?? ""] ?? "🐾"}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {pet.name}{" "}
                    <span className="font-normal text-[var(--color-muted)]">
                      {pet.breed ? `· ${pet.breed}` : ""} {pet.size ? `· ${pet.size}` : ""}
                    </span>
                  </p>
                  {pet.notes && (
                    <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{pet.notes}</p>
                  )}
                  <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                    Vaccination: {pet.vaccination_status.replace("_", " ")}
                  </p>
                </div>
              </div>
              <DeletePetButton petId={pet.id} onDeleted={loadPets} />
            </div>
          ))
        ) : (
          <div className="card p-8 text-center text-sm text-[var(--color-muted)]">
            No pets yet — add one above.
          </div>
        )}
      </div>
    </div>
  );
}
