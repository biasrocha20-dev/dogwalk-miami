"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.redirectTo) router.push(state.redirectTo);
  }, [state, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-20">
      <div className="card p-8">
        <h1 className="font-display text-2xl font-medium text-[var(--color-ink)]">Log in</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Welcome back.</p>

        <form action={formAction} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input id="email" name="email" type="email" required className="field-input" />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input id="password" name="password" type="password" required className="field-input" />
          </div>

          {state?.error && (
            <p className="rounded-xl bg-[var(--color-accent-soft)] px-3.5 py-2.5 text-sm text-[var(--color-accent-hover)]">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="btn-text">
          Sign up
        </Link>
      </p>
    </div>
  );
}
