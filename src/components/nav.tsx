import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
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
            <form action={logout}>
              <button type="submit" className="hover:text-teal-700">
                Log out
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
