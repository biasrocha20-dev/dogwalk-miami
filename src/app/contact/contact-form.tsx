"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Please fill out every field.");
      setStatus("error");
      return;
    }

    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert({ name, email, message });

    if (insertError) {
      setError("Something went wrong sending your message. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("sent");
    e.currentTarget.reset();
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-2xl">
          ✅
        </div>
        <h2 className="mt-4 font-display text-xl font-medium text-[var(--color-ink)]">
          Message sent
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Thanks for reaching out — we&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-8">
      <div>
        <label htmlFor="name" className="field-label">
          Name
        </label>
        <input id="name" name="name" required className="field-input" />
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input id="email" name="email" type="email" required className="field-input" />
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className="field-input" />
      </div>

      {error && (
        <p className="rounded-xl bg-[var(--color-accent-soft)] px-3.5 py-2.5 text-sm text-[var(--color-accent-hover)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
