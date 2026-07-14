"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState<"owner" | "walker">("owner");
  const router = useRouter();

  useEffect(() => {
    if (state?.redirectTo) router.push(state.redirectTo);
  }, [state, router]);

  if (state?.checkEmail) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
        <p className="mt-3 text-sm text-slate-600">
          We sent a confirmation link to your inbox. Click it to activate your account, then{" "}
          <Link href="/login" className="font-medium text-teal-700 hover:underline">
            log in
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Join Miami&apos;s dog walking community.</p>

      <form action={formAction} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
              role === "owner"
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            I&apos;m a dog owner
          </button>
          <button
            type="button"
            onClick={() => setRole("walker")}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
              role === "walker"
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            I&apos;m a dog walker
          </button>
        </div>
        <input type="hidden" name="role" value={role} />

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-teal-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
