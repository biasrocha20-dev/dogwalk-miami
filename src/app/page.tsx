import Link from "next/link";
import { MIAMI_NEIGHBORHOODS } from "@/lib/neighborhoods";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-gradient-to-b from-teal-50 to-slate-50 px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Dog walking, Miami-style. 🐾
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Book vetted, local walkers for scheduled or one-time walks — from Brickell to
            Coconut Grove.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/walkers"
              className="rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Find a walker
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Become a walker
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-center text-xl font-semibold text-slate-900">
          Serving every Miami neighborhood
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {MIAMI_NEIGHBORHOODS.map((n) => (
            <Link
              key={n}
              href={`/walkers?neighborhood=${encodeURIComponent(n)}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
            >
              {n}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-2xl">📅</p>
            <h3 className="mt-2 font-semibold text-slate-900">Flexible scheduling</h3>
            <p className="mt-1 text-sm text-slate-500">
              20, 30, or 60 minute walks — one-time or recurring.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-2xl">✅</p>
            <h3 className="mt-2 font-semibold text-slate-900">Vetted walkers</h3>
            <p className="mt-1 text-sm text-slate-500">
              Local walkers who know your neighborhood and your dog.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-2xl">☀️</p>
            <h3 className="mt-2 font-semibold text-slate-900">Miami-ready</h3>
            <p className="mt-1 text-sm text-slate-500">
              Heat-aware routes and schedules built for South Florida summers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
