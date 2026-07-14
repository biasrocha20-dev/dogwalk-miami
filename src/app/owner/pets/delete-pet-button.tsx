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
      className="shrink-0 text-sm font-medium text-[var(--color-accent-hover)] transition hover:text-[var(--color-accent)]"
    >
      Remove
    </button>
  );
}
