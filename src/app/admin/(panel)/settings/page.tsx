"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Passwort konnte nicht geändert werden.");
      return;
    }

    setSuccess(true);
    e.currentTarget.reset();
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white">Einstellungen</h1>

      <section className="mt-8 rounded-2xl border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Konto</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Benutzername</dt>
            <dd className="text-zinc-300">{session?.user?.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">E-Mail</dt>
            <dd className="text-zinc-300">{session?.user?.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Sicherheit — Passwort ändern</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field name="currentPassword" label="Aktuelles Passwort" type="password" />
          <Field name="newPassword" label="Neues Passwort" type="password" />
          <Field name="confirmPassword" label="Neues Passwort (Bestätigung)" type="password" />
          <p className="text-xs text-zinc-500">
            Mindestens 12 Zeichen, Groß-/Kleinbuchstaben, Ziffer und Sonderzeichen.
          </p>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">Passwort erfolgreich aktualisiert.</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-50"
          >
            {loading ? "Wird gespeichert..." : "Passwort aktualisieren"}
          </button>
        </form>
      </section>

      <p className="mt-6">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Zur Website
        </Link>
      </p>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        name={name}
        type={type}
        required
        minLength={type === "password" ? 12 : undefined}
        className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}
