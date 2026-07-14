"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth";
import type { Pet } from "@/lib/types";
import { PetForm } from "./pet-form";
import { DeletePetButton } from "./delete-pet-button";

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
      <h1 className="text-2xl font-bold text-slate-900">My pets</h1>
      <p className="mt-1 text-sm text-slate-500">
        Keep this up to date so walkers know how to care for your dog.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <PetForm onSuccess={loadPets} />
      </div>

      <div className="mt-8 space-y-3">
        {pets?.length ? (
          pets.map((pet) => (
            <div
              key={pet.id}
              className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {pet.name}{" "}
                  <span className="font-normal text-slate-500">
                    {pet.breed ? `· ${pet.breed}` : ""} {pet.size ? `· ${pet.size}` : ""}
                  </span>
                </p>
                {pet.notes && <p className="mt-1 text-sm text-slate-600">{pet.notes}</p>}
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                  Vaccination: {pet.vaccination_status.replace("_", " ")}
                </p>
              </div>
              <DeletePetButton petId={pet.id} onDeleted={loadPets} />
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No pets yet — add one above.</p>
        )}
      </div>
    </div>
  );
}
