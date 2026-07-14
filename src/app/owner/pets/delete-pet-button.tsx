"use client";

import { deletePet } from "@/app/actions/pets";

export function DeletePetButton({ petId, onDeleted }: { petId: string; onDeleted?: () => void }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Remove this pet?")) return;
        await deletePet(petId);
        onDeleted?.();
      }}
      className="text-sm font-medium text-red-600 hover:underline"
    >
      Remove
    </button>
  );
}
