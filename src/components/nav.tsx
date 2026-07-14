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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          🐾 PawMiami
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/walkers" className="hover:text-teal-700">
            Find a walker
          </Link>
          {!user && (
            <>
              <Link href="/login" className="hover:text-teal-700">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
              >
                Sign up
              </Link>
            </>
          )}
          {user && role === "owner" && (
            <>
              <Link href="/owner/pets" className="hover:text-teal-700">
                My pets
              </Link>
              <Link href="/owner/bookings" className="hover:text-teal-700">
                My bookings
              </Link>
            </>
          )}
          {user && role === "walker" && (
            <>
              <Link href="/walker/onboarding" className="hover:text-teal-700">
                My profile
              </Link>
              <Link href="/walker/dashboard" className="hover:text-teal-700">
                My bookings
              </Link>
            </>
          )}
          {user && (
            <button type="button" onClick={handleLogout} className="hover:text-teal-700">
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
