"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePasswordPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const forced = session?.user?.mustChangePassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

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

    await update({ mustChangePassword: false });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h1 className="text-2xl font-bold text-white">
          {forced ? "Passwort ändern" : "Passwort ändern"}
        </h1>
        {forced && (
          <p className="mt-2 text-sm text-amber-400">
            Aus Sicherheitsgründen müssen Sie Ihr Passwort bei der ersten Anmeldung ändern.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <PasswordField name="currentPassword" label="Aktuelles Passwort" />
          <PasswordField name="newPassword" label="Neues Passwort" />
          <PasswordField name="confirmPassword" label="Neues Passwort (Bestätigung)" />

          <p className="text-xs text-zinc-500">
            Mindestens 12 Zeichen, Groß-/Kleinbuchstaben, Ziffer und Sonderzeichen.
          </p>

          {error && (
            <p className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-50"
          >
            {loading ? "Wird gespeichert..." : "Passwort aktualisieren"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PasswordField({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        name={name}
        type="password"
        required
        minLength={12}
        className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}
