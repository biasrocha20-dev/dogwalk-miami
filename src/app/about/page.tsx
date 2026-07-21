import Link from "next/link";

const VALUES = [
  {
    icon: "🐾",
    title: "Dogs first",
    body: "Every walker on the platform is vetted for genuine experience handling dogs of all sizes and temperaments.",
  },
  {
    icon: "🏙️",
    title: "Truly local",
    body: "Walkers work the neighborhoods they actually live in — they know the shady routes, the dog parks, and the shortcuts.",
  },
  {
    icon: "🤝",
    title: "Built on trust",
    body: "Transparent pricing, real profiles, and a booking flow that keeps owners and walkers on the same page.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <span className="pill-active mx-auto mb-6 flex w-fit">Our story</span>
      <h1 className="font-display text-3xl font-medium text-[var(--color-ink)] sm:text-4xl">
        Built for Miami dogs, by Miami dog people.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink-soft)]">
        PawMiami started with a simple problem: Miami summers are brutal, apartment living
        doesn&apos;t come with a backyard, and reliable dog walkers are hard to find outside a
        small circle of neighbors and doormen. We built a platform to make finding a trustworthy,
        local walker as easy as booking a rideshare.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
        Every walker on PawMiami lives in the neighborhood they serve — from Brickell high-rises to
        Coconut Grove bungalows — so your dog gets a walker who already knows the best (and
        coolest) routes nearby.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="card p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-2xl">
              {v.icon}
            </div>
            <h3 className="mt-4 font-display text-lg font-medium text-[var(--color-ink)]">
              {v.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="card mt-12 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="font-display text-xl font-medium text-[var(--color-ink)]">
            Want to join us?
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Book a walker today, or start walking dogs in your neighborhood.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link href="/walkers" className="btn-ghost">
            Find a walker
          </Link>
          <Link href="/become-a-walker" className="btn-accent">
            Become a walker
          </Link>
        </div>
      </div>
    </div>
  );
}
