import Link from "next/link";
import { MIAMI_NEIGHBORHOODS } from "@/lib/neighborhoods";

const FEATURES = [
  {
    icon: "📅",
    tint: "bg-[var(--color-primary-soft)]",
    title: "Flexible scheduling",
    body: "20, 30, or 60 minute walks — one-time or recurring, on your dog's clock.",
  },
  {
    icon: "✅",
    tint: "bg-[var(--color-accent-soft)]",
    title: "Vetted walkers",
    body: "Local walkers who know your neighborhood, your building, and your dog.",
  },
  {
    icon: "☀️",
    tint: "bg-[var(--color-sun-soft)]",
    title: "Miami-ready",
    body: "Heat-aware routes and schedules built for South Florida summers.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 10%, rgba(242,96,62,0.14), transparent), radial-gradient(55% 45% at 85% 20%, rgba(13,92,86,0.14), transparent), radial-gradient(40% 40% at 50% 100%, rgba(245,185,66,0.14), transparent)",
          }}
        />
        <div className="mx-auto max-w-3xl text-center">
          <span className="pill-active mx-auto mb-6 inline-flex w-fit">
            Now booking across Miami-Dade
          </span>
          <h1 className="font-display text-5xl font-medium tracking-tight text-[var(--color-ink)] sm:text-6xl">
            Dog walking,
            <br />
            <span className="text-[var(--color-primary)]">Miami-style.</span> 🐾
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--color-ink-soft)]">
            Book vetted, local walkers for scheduled or one-time walks — from Brickell to
            Coconut Grove.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/walkers" className="btn-accent px-7 py-3.5 text-base">
              Find a walker
            </Link>
            <Link href="/become-a-walker" className="btn-ghost px-7 py-3.5 text-base">
              Become a walker
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-14">
        <h2 className="text-center font-display text-2xl font-medium text-[var(--color-ink)]">
          Serving every Miami neighborhood
        </h2>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {MIAMI_NEIGHBORHOODS.map((n) => (
            <Link key={n} href={`/walkers?neighborhood=${encodeURIComponent(n)}`} className="pill">
              {n}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 pb-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover p-7 text-center">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${f.tint}`}>
                {f.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-[var(--color-ink)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
