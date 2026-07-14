import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Pet } from "@/lib/types";
import { PetForm } from "./pet-form";
import { DeletePetButton } from "./delete-pet-button";

export default async function OwnerPetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">My pets</h1>
      <p className="mt-1 text-sm text-slate-500">
        Keep this up to date so walkers know how to care for your dog.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <PetForm />
      </div>

      <div className="mt-8 space-y-3">
        {(pets as Pet[] | null)?.length ? (
          (pets as Pet[]).map((pet) => (
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
              <DeletePetButton petId={pet.id} />
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No pets yet — add one above.</p>
        )}
      </div>
    </div>
  );
}
