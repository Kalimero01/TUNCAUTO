"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      login: formData.get("login"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Benutzername/E-Mail oder Passwort ist falsch.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Tunc Automobile"
            width={180}
            height={72}
            className="h-16 w-auto object-contain brightness-0 invert"
            unoptimized
          />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold text-white">Admin-Anmeldung</h1>
        <p className="mt-2 text-center text-sm text-zinc-500">Verwaltungsbereich</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400">Benutzername oder E-Mail</label>
            <input
              name="login"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400">Passwort</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

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
            {loading ? "Anmeldung läuft..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
