"use client";

import { useEffect, useState } from "react";
import { SocialPlatformIcon } from "@/components/icons/social-icons";
import {
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  type SocialPlatform,
} from "@/lib/social";

type Link = { id: string; platform: SocialPlatform; url: string; isActive: boolean };

type FormState = Record<SocialPlatform, string>;

const emptyForm = (): FormState =>
  Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""])) as FormState;

export default function AdminSocialPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/social");
    const json = await res.json();
    const data: Link[] = json.data ?? [];
    setLinks(data);

    const next = emptyForm();
    for (const link of data) {
      if (link.platform in next) {
        next[link.platform] = link.url;
      }
    }
    setForm(next);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError(false);

    try {
      for (const platform of SOCIAL_PLATFORMS) {
        const url = form[platform].trim();
        const existing = links.find((l) => l.platform === platform);

        if (existing) {
          const res = await fetch("/api/admin/social", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: existing.id,
              url,
              isActive: url !== "",
            }),
          });
          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(json.error ?? "Fehler beim Speichern.");
          }
        } else {
          const res = await fetch("/api/admin/social", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platform,
              url,
              isActive: url !== "",
            }),
          });
          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(json.error ?? "Fehler beim Speichern.");
          }
        }
      }

      await load();
      setMsg("Gespeichert.");
    } catch (err) {
      setError(true);
      setMsg(err instanceof Error ? err.message : "Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-zinc-500">Wird geladen...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Social Media</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Links zu Facebook, Instagram und TikTok verwalten
        </p>
      </div>

      {msg && (
        <p className={`text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-sm border border-zinc-800 p-6"
      >
        <h2 className="font-semibold text-white">Plattformen</h2>

        {SOCIAL_PLATFORMS.map((platform) => (
          <div key={platform} className="flex items-center gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-300"
              title={SOCIAL_PLATFORM_LABELS[platform]}
            >
              <SocialPlatformIcon platform={platform} className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <label className="block text-sm text-zinc-400">
                {SOCIAL_PLATFORM_LABELS[platform]} — Link
              </label>
              <input
                type="url"
                value={form[platform]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [platform]: e.target.value }))
                }
                placeholder="https://..."
                className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
              />
            </div>
          </div>
        ))}

        <p className="text-xs text-zinc-500">
          Leere Links werden im Footer ausgegraut angezeigt und sind noch nicht klickbar.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-metallic px-6 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {saving ? "Wird gespeichert..." : "Speichern"}
        </button>
      </form>
    </div>
  );
}
