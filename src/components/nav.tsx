"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { logout } from "@/app/actions/auth";

export function Nav() {
  const { session, profile } = useAuth();
  const router = useRouter();
  const user = session?.user;
  const role = profile?.role ?? null;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-canvas)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-[var(--color-ink)]">
          🐾 On Time
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-[var(--color-ink-soft)] sm:gap-2">
          <Link href="/walkers" className="rounded-full px-3 py-2 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]">
            Find a walker
          </Link>
          {!user && (
            <>
              <Link href="/login" className="rounded-full px-3 py-2 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]">
                Log in
              </Link>
              <Link href="/signup" className="btn-accent ml-1">
                Sign up
              </Link>
            </>
          )}
          {user && role === "owner" && (
            <>
              <Link href="/owner/pets" className="rounded-full px-3 py-2 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]">
                My pets
              </Link>
              <Link href="/owner/bookings" className="rounded-full px-3 py-2 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]">
                My bookings
              </Link>
            </>
          )}
          {user && role === "walker" && (
            <>
              <Link href="/walker/onboarding" className="rounded-full px-3 py-2 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]">
                My profile
              </Link>
              <Link href="/walker/dashboard" className="rounded-full px-3 py-2 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]">
                My bookings
              </Link>
            </>
          )}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-full px-3 py-2 transition hover:bg-[var(--color-border-soft)]"
            >
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
