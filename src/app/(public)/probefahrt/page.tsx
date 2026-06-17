"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeroBackground } from "@/components/layout/page-hero-background";
import { testDriveLabels } from "@/lib/i18n/de";
import { MERCEDES_G_CLASS_BG } from "@/lib/page-backgrounds";

export default function ProbefahrtPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/probefahrt", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Anfrage fehlgeschlagen.");
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

  if (status === "success") {
    return (
      <div>
        <PageHeroBackground
          imageSrc={MERCEDES_G_CLASS_BG}
          kicker={testDriveLabels.title}
          title={testDriveLabels.heroTitle}
        />

        <section className="relative mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="rounded-sm border border-metallic/30 bg-zinc-950/60 p-10 backdrop-blur-sm">
            <h2 className="text-2xl font-light text-metallic">{testDriveLabels.successTitle}</h2>
            <p className="mt-4 text-zinc-400">{testDriveLabels.successMessage}</p>
            <Link
              href="/"
              className="btn-outline mt-6 inline-block rounded-sm border border-metallic px-6 py-3 text-sm font-semibold text-metallic hover:bg-metallic/10"
            >
              {testDriveLabels.backToHome}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeroBackground
        imageSrc={MERCEDES_G_CLASS_BG}
        kicker={testDriveLabels.title}
        title={testDriveLabels.heroTitle}
        subtitle="Wählen Sie Ihr Wunschfahrzeug und Ihren Termin — wir bestätigen Ihre Probefahrt persönlich."
      />

      <section className="relative mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="relative rounded-sm border border-zinc-700/80 bg-zinc-950/70 p-6 backdrop-blur-md sm:p-8">
          <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-metallic/60" />
          <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-metallic/60" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-metallic/60" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-metallic/60" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput name="customerName" placeholder={testDriveLabels.customerName} required />
            <FormInput name="phone" type="tel" placeholder={testDriveLabels.phone} required />
            <FormInput name="email" type="email" placeholder={testDriveLabels.email} required />
            <FormInput
              name="preferredDateTime"
              placeholder={testDriveLabels.preferredDateTime}
              required
            />
            <FormTextarea name="vehicleModel" placeholder={testDriveLabels.vehicleModel} required />

            {error && (
              <p className="rounded-sm border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-metallic mt-2 w-full rounded-sm border border-metallic bg-metallic/90 py-3.5 text-sm font-semibold tracking-wide text-black disabled:opacity-50"
            >
              {status === "loading" ? testDriveLabels.submitting : testDriveLabels.submit}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function formFieldClassName() {
  return "w-full rounded-sm border border-zinc-700 bg-zinc-900/90 px-4 py-3.5 text-base text-white placeholder:text-xs placeholder:uppercase placeholder:tracking-wider placeholder:text-zinc-500 focus:border-metallic focus:outline-none";
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
      rows={4}
      placeholder={placeholder}
      className={`${formFieldClassName()} resize-none`}
    />
  );
}
