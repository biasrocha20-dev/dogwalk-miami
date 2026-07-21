import Link from "next/link";
import { MIAMI_NEIGHBORHOODS } from "@/lib/neighborhoods";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <p className="font-display text-lg font-semibold text-[var(--color-ink)]">
              🐾 PawMiami
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Dog walking, Miami-style.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li>
                <Link href="/about" className="hover:text-[var(--color-primary)]">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--color-primary)]">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Get started
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-soft)]">
              <li>
                <Link href="/walkers" className="hover:text-[var(--color-primary)]">
                  Find a walker
                </Link>
              </li>
              <li>
                <Link href="/become-a-walker" className="hover:text-[var(--color-primary)]">
                  Become a walker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Neighborhoods
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-[var(--color-ink-soft)]">
              {MIAMI_NEIGHBORHOODS.slice(0, 6).map((n) => (
                <li key={n}>
                  <Link
                    href={`/walkers?neighborhood=${encodeURIComponent(n)}`}
                    className="hover:text-[var(--color-primary)]"
                  >
                    {n}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border-soft)] pt-6 text-xs text-[var(--color-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} PawMiami. Serving Miami-Dade.</p>
          <p>
            Questions?{" "}
            <a href="mailto:hello@pawmiami.com" className="hover:text-[var(--color-primary)]">
              hello@pawmiami.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
