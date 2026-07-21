"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signup } from "@/app/actions/auth";

function SignupContent() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"owner" | "walker">(
    searchParams.get("role") === "walker" ? "walker" : "owner",
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.redirectTo) router.push(state.redirectTo);
  }, [state, router]);

  if (state?.checkEmail) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-2xl">
          📬
        </div>
        <h1 className="mt-5 font-display text-2xl font-medium text-[var(--color-ink)]">
          Check your email
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
          We sent a confirmation link to your inbox. Click it to activate your account, then{" "}
          <Link href="/login" className="btn-text">
            log in
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-20">
      <div className="card p-8">
        <h1 className="font-display text-2xl font-medium text-[var(--color-ink)]">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Join Miami&apos;s dog walking community.
        </p>

        <form action={formAction} className="mt-7 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("owner")}
              className={
                role === "owner"
                  ? "rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition"
                  : "rounded-xl border-2 border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-ink-soft)] transition hover:border-[var(--color-ink-soft)]"
              }
            >
              🐶 Dog owner
            </button>
            <button
              type="button"
              onClick={() => setRole("walker")}
              className={
                role === "walker"
                  ? "rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition"
                  : "rounded-xl border-2 border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-ink-soft)] transition hover:border-[var(--color-ink-soft)]"
              }
            >
              🚶 Dog walker
            </button>
          </div>
          <input type="hidden" name="role" value={role} />

          <div>
            <label htmlFor="fullName" className="field-label">
              Full name
            </label>
            <input id="fullName" name="fullName" required className="field-input" />
          </div>

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
            {pending ? "Creating account…" : "Sign up"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-soft)]">
        Already have an account?{" "}
        <Link href="/login" className="btn-text">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupContent />
    </Suspense>
  );
}
