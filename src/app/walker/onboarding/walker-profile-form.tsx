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
        <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={walkerProfile.bio ?? ""}
          placeholder="Tell owners about your experience with dogs…"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="ratePerWalk" className="block text-sm font-medium text-slate-700">
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
          className="mt-1 w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-700">Service neighborhoods</span>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MIAMI_NEIGHBORHOODS.map((n) => (
            <label key={n} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="neighborhoods"
                value={n}
                defaultChecked={walkerProfile.service_neighborhoods.includes(n)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              {n}
            </label>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-teal-700">Profile saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
