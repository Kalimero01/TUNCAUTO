"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { FUEL_TYPES, TRANSMISSION_TYPES } from "@/lib/vehicle-constants";

export function VehicleFilters({ total }: { total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const fuel = searchParams.get("fuel") ?? "";
  const transmission = searchParams.get("transmission") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => {
        router.push(`/araclar?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearAll = () => {
    startTransition(() => router.push("/araclar"));
  };

  const hasFilters = q || fuel || transmission;

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Suche
          </label>
          <input
            type="search"
            defaultValue={q}
            placeholder="Marke, Modell..."
            onChange={(e) => update("q", e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Kraftstoff
          </label>
          <select
            value={fuel}
            onChange={(e) => update("fuel", e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="">Alle</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-40">
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Getriebe
          </label>
          <select
            value={transmission}
            onChange={(e) => update("transmission", e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="">Alle</option>
            {TRANSMISSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <p className={pending ? "text-zinc-600" : "text-zinc-500"}>
          {total} Fahrzeuge gelistet
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="link-hover text-brand-400 hover:text-brand-300"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
