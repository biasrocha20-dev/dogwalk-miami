import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium text-[var(--color-ink)]">Contact us</h1>
      <p className="mt-3 text-[var(--color-ink-soft)]">
        Questions about booking, becoming a walker, or anything else? Send us a message and
        we&apos;ll get back to you.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-8 text-center text-sm text-[var(--color-muted)]">
        Or reach us directly at{" "}
        <a href="mailto:hello@pawmiami.com" className="btn-text">
          hello@pawmiami.com
        </a>
      </div>
    </div>
  );
}
