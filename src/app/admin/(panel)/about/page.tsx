"use client";

import { useEffect, useState } from "react";
import { ProminentFileUpload } from "@/components/admin/prominent-file-upload";
import { cmsImageUrl } from "@/lib/cms";

type AboutData = {
  title: string;
  content: string;
  imageFile: string | null;
};

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutData>({
    title: "Über uns",
    content: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((j) => {
        if (j.data) {
          setForm({
            title: j.data.title ?? "Über uns",
            content: j.data.content ?? "",
            imageFile: j.data.imageFile ?? null,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError(false);

    const fd = new FormData(e.currentTarget);
    fd.set("title", form.title);
    fd.set("content", form.content);

    const res = await fetch("/api/admin/about", { method: "PUT", body: fd });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(true);
      setMsg(json.error ?? "Fehler beim Speichern.");
      return;
    }

    setError(false);
    setMsg("Gespeichert.");
    if (json.data) {
      setForm({
        title: json.data.title ?? form.title,
        content: json.data.content ?? form.content,
        imageFile: json.data.imageFile ?? form.imageFile,
      });
    }
  }

  if (loading) return <p className="text-zinc-500">Wird geladen...</p>;

  const imageUrl = cmsImageUrl(form.imageFile);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Über uns</h1>
      {msg && (
        <p className={`mt-2 text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>
      )}
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
        <ProminentFileUpload
          name="image"
          label="Titelbild"
          buttonLabel="Bild hochladen"
          currentImageUrl={imageUrl}
          disabled={saving}
        />

        <div className="space-y-4 rounded-sm border border-zinc-800 p-6">
          <div>
            <label className="block text-sm text-zinc-400">Titel</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400">Inhalt</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required
              rows={10}
              className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-metallic px-6 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {saving ? "Wird gespeichert..." : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
