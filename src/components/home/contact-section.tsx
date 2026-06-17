"use client";

import { useState } from "react";
import { contactLabels } from "@/lib/i18n/de";
import { MERCEDES_G_CLASS_BG } from "@/lib/page-backgrounds";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact-messages", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Nachricht konnte nicht gesendet werden.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
      setStatus("error");
    }
  }

  return (
    <section id="kontakt" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${MERCEDES_G_CLASS_BG})` }}
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

      <div className="relative mx-auto max-w-xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          {contactLabels.heading}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{contactLabels.intro}</p>

        {status === "success" ? (
          <div className="mt-10 rounded-sm border border-metallic/30 bg-zinc-950/60 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-light text-metallic">{contactLabels.successTitle}</h3>
            <p className="mt-3 text-zinc-400">{contactLabels.successMessage}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="btn-outline mt-6 rounded-sm border border-metallic px-6 py-3 text-sm font-semibold text-metallic hover:bg-metallic/10"
            >
              Neue Nachricht senden
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <FormInput name="customerName" placeholder={contactLabels.customerName} required />
            <FormInput name="email" type="email" placeholder={contactLabels.email} required />
            <FormInput name="phone" type="tel" placeholder={contactLabels.phone} required />
            <FormTextarea name="message" placeholder={contactLabels.message} required />

            {error && (
              <p className="rounded-sm border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-metallic mt-2 w-full rounded-sm border border-metallic bg-metallic/90 py-3.5 text-sm font-semibold uppercase tracking-wide text-black disabled:opacity-50"
            >
              {status === "loading" ? contactLabels.submitting : contactLabels.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function formFieldClassName() {
  return "w-full rounded-sm border border-zinc-600/80 bg-zinc-900/60 px-4 py-3.5 text-base text-white backdrop-blur-sm placeholder:text-xs placeholder:uppercase placeholder:tracking-wider placeholder:text-zinc-400 focus:border-metallic focus:outline-none";
}

function FormInput({
  placeholder,
  ...props
}: { placeholder: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} placeholder={placeholder} className={formFieldClassName()} />;
}

function FormTextarea({
  placeholder,
  ...props
}: { placeholder: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={5}
      placeholder={placeholder}
      className={`${formFieldClassName()} resize-none`}
    />
  );
}
