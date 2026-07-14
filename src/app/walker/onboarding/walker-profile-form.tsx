"use client";

import { useActionState } from "react";
import { updateWalkerProfile } from "@/app/actions/walker";
import { MIAMI_NEIGHBORHOODS } from "@/lib/neighborhoods";
import type { WalkerProfile } from "@/lib/types";

export function WalkerProfileForm({ walkerProfile }: { walkerProfile: WalkerProfile }) {
  const [state, formAction, pending] = useActionState(updateWalkerProfile, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="bio" className="field-label">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={walkerProfile.bio ?? ""}
          placeholder="Tell owners about your experience with dogs…"
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="ratePerWalk" className="field-label">
          Rate per walk (USD)
        </label>
        <input
          id="ratePerWalk"
          name="ratePerWalk"
          type="number"
          min={5}
          max={500}
          step="0.01"
          defaultValue={walkerProfile.rate_per_walk}
          required
          className="field-input w-40"
        />
      </div>

      <div>
        <span className="field-label">Service neighborhoods</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MIAMI_NEIGHBORHOODS.map((n) => (
            <label
              key={n}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink-soft)] transition has-checked:border-[var(--color-primary)] has-checked:bg-[var(--color-primary-soft)] has-checked:text-[var(--color-primary)]"
            >
              <input
                type="checkbox"
                name="neighborhoods"
                value={n}
                defaultChecked={walkerProfile.service_neighborhoods.includes(n)}
                className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/30"
              />
              {n}
            </label>
          ))}
        </div>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-[var(--color-accent-soft)] px-3.5 py-2.5 text-sm text-[var(--color-accent-hover)]">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-xl bg-[var(--color-primary-soft)] px-3.5 py-2.5 text-sm font-medium text-[var(--color-primary)]">
          Profile saved.
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
