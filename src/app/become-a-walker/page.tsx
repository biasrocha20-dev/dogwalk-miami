import Link from "next/link";

const STEPS = [
  {
    icon: "📝",
    title: "Sign up",
    body: "Create a walker account in under a minute — just your name, email, and password.",
  },
  {
    icon: "🗺️",
    title: "Set your profile",
    body: "Add your bio, your rate per walk, and the Miami neighborhoods you want to cover.",
  },
  {
    icon: "🐕",
    title: "Start walking",
    body: "Owners in your area can find and book you. Confirm requests and get walking.",
  },
];

const PERKS = [
  "Set your own rate and hours",
  "Choose the neighborhoods you cover",
  "Simple booking requests — accept or decline",
  "Build a public profile with ratings and reviews",
];

export default function BecomeAWalkerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <span className="pill-active mx-auto mb-6 flex w-fit">For walkers</span>
      <h1 className="text-center font-display text-3xl font-medium text-[var(--color-ink)] sm:text-4xl">
        Turn your love of dogs into flexible income.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-center text-lg text-[var(--color-ink-soft)]">
        Walk dogs in your own Miami neighborhood, on your own schedule. No storefront, no
        contracts — just you, a leash, and a booking calendar.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/signup?role=walker" className="btn-accent px-7 py-3.5 text-base">
          Sign up to walk dogs
        </Link>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-white">
              {i + 1}
            </div>
            <div className="mt-3 text-2xl">{s.icon}</div>
            <h3 className="mt-2 font-display text-lg font-medium text-[var(--color-ink)]">
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <div className="card mt-10 p-8">
        <h2 className="font-display text-xl font-medium text-[var(--color-ink)]">
          Why walk with PawMiami
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs text-[var(--color-primary)]">
                ✓
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-center text-sm text-[var(--color-ink-soft)]">
        Already have an account?{" "}
        <Link href="/login" className="btn-text">
          Log in
        </Link>
      </p>
    </div>
  );
}
