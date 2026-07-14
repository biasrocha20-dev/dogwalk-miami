"use client";

import { deletePet } from "@/app/actions/pets";

export function DeletePetButton({ petId }: { petId: string }) {
  return (
    <button
      onClick={() => {
        if (confirm("Remove this pet?")) deletePet(petId);
      }}
      className="text-sm font-medium text-red-600 hover:underline"
    >
      Remove
    </button>
  );
}
