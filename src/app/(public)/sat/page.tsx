"use client";

import { useState } from "react";
import Link from "next/link";
import { ProminentFileUpload } from "@/components/admin/prominent-file-upload";
import { PageHeroBackground } from "@/components/layout/page-hero-background";
import { IMAGE_FORMAT_LABEL } from "@/lib/upload-constants";
import { submissionLabels } from "@/lib/i18n/de";
import { MERCEDES_G_CLASS_BG } from "@/lib/page-backgrounds";
import { CAR_BRANDS } from "@/lib/vehicle-constants";

function YesNoField({
  name,
  label,
  detailsName,
  value,
  onChange,
}: {
  name: string;
  label: string;
  detailsName: string;
  value: "yes" | "no" | "";
  onChange: (v: "yes" | "no" | "") => void;
}) {
  return (
    <div className="rounded-sm border border-zinc-800 p-4">
      <p className="text-sm text-zinc-300">{label}</p>
      <div className="mt-3 flex gap-4">
        {(["yes", "no"] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              required
            />
            {opt === "yes" ? "Ja" : "Nein"}
          </label>
        ))}
      </div>
      {value === "yes" && (
        <textarea
          name={detailsName}
          maxLength={200}
          required
          rows={3}
          placeholder="Bitte beschreiben (max. 200 Zeichen)"
          className="mt-3 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-base text-white focus:border-metallic focus:outline-none"
        />
      )}
    </div>
  );
}

export default function SellPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [accident, setAccident] = useState<"yes" | "no" | "">("");
  const [repaint, setRepaint] = useState<"yes" | "no" | "">("");
  const [parts, setParts] = useState<"yes" | "no" | "">("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.delete("images");
    for (const file of imageFiles) {
      formData.append("images", file);
    }

    try {
      const res = await fetch("/api/submissions", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Anfrage fehlgeschlagen.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setImageFiles([]);
      setAccident("");
      setRepaint("");
      setParts("");
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
          kicker="Fahrzeug verkaufen"
          title="Fahrzeug verkaufen"
        />

        <section className="relative mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="rounded-sm border border-emerald-800/50 bg-emerald-950/20 p-10 backdrop-blur-sm">
            <h2 className="text-2xl font-light text-emerald-400">Anfrage erhalten!</h2>
            <p className="mt-4 text-zinc-400">Wir melden uns in Kürze bei Ihnen.</p>
            <Link
              href="/"
              className="btn-outline mt-6 inline-block rounded-sm border border-metallic px-6 py-3 text-sm font-semibold text-metallic hover:bg-metallic/10"
            >
              Zur Startseite
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
        kicker="Fahrzeug verkaufen"
        title="Fahrzeug verkaufen"
        subtitle="Füllen Sie das Formular aus — wir bewerten Ihr Fahrzeug schnell und fair."
      />

      <section className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="rounded-sm border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="space-y-4 rounded-sm border border-zinc-800 p-6">
          <legend className="px-2 text-sm font-medium text-zinc-400">{submissionLabels.contact}</legend>
          <Input name="sellerName" label={submissionLabels.name} required />
          <Input name="sellerEmail" label={submissionLabels.email} type="email" required />
          <Input name="sellerPhone" label={submissionLabels.phone} type="tel" required />
        </fieldset>

        <fieldset className="space-y-4 rounded-sm border border-zinc-800 p-6">
          <legend className="px-2 text-sm font-medium text-zinc-400">Fahrzeugdaten</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-400">Marke</label>
              <select
                name="make"
                required
                defaultValue=""
                className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-metallic focus:outline-none"
              >
                <option value="" disabled>
                  Marke wählen…
                </option>
                {CAR_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <Input name="model" label="Modell" required />
            <Input name="year" label="Baujahr" type="number" min={1900} max={2030} required />
            <Input name="price" label="Aktueller Preis (€)" type="number" min={0} required />
            <Input name="desiredPrice" label="Wunschpreis (€)" type="number" min={0} />
            <Input name="mileage" label="Kilometerstand" type="number" min={0} />
            <Input name="fuelType" label="Kraftstoff" />
            <Input name="transmission" label="Getriebe" />
            <Input name="color" label="Farbe" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400">Beschreibung</label>
            <textarea
              name="description"
              rows={4}
              className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-metallic focus:outline-none"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-sm border border-zinc-800 p-6">
          <legend className="px-2 text-sm font-medium text-zinc-400">Fahrzeughistorie</legend>
          <YesNoField
            name="hasAccident"
            label="Unfallschäden?"
            detailsName="accidentDetails"
            value={accident}
            onChange={setAccident}
          />
          <YesNoField
            name="hasRepaint"
            label="Neulackierung?"
            detailsName="repaintDetails"
            value={repaint}
            onChange={setRepaint}
          />
          <YesNoField
            name="hasPartsReplaced"
            label="Ausgetauschte Teile?"
            detailsName="partsDetails"
            value={parts}
            onChange={setParts}
          />
        </fieldset>

        <fieldset className="space-y-4 rounded-sm border border-zinc-800 p-6">
          <legend className="px-2 text-sm font-medium text-zinc-400">Bilder (max. 8)</legend>
          <ProminentFileUpload
            name="images"
            label="Fahrzeugbilder"
            buttonLabel="Bilder auswählen"
            multiple
            maxFiles={8}
            onFilesChange={setImageFiles}
            hint={`${IMAGE_FORMAT_LABEL} — max. 10 MB pro Bild · max. 8 Dateien`}
            previewVariant="square"
          />
        </fieldset>

        {error && (
          <p className="rounded-sm border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-metallic w-full rounded-sm border border-metallic bg-metallic/90 py-3.5 text-sm font-semibold tracking-wide text-black disabled:opacity-50"
        >
          {status === "loading" ? "Wird gesendet..." : "Anfrage absenden"}
        </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-metallic focus:outline-none"
      />
    </div>
  );
}
