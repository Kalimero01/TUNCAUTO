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

  async function removeImage() {
    if (!form.imageFile) return;
    if (!confirm("Bild wirklich entfernen?")) return;

    setSaving(true);
    setMsg("");
    setError(false);

    const res = await fetch("/api/admin/about/image", { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(true);
      setMsg(json.error ?? "Fehler beim Entfernen des Bildes.");
      return;
    }

    setError(false);
    setMsg("Bild entfernt.");
    setForm((f) => ({ ...f, imageFile: null }));
  }

  async function clearContent() {
    if (!form.content) return;
    if (!confirm("Inhalt wirklich löschen?")) return;

    setSaving(true);
    setMsg("");
    setError(false);

    const res = await fetch("/api/admin/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clearContent" }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(true);
      setMsg(json.error ?? "Fehler beim Löschen des Inhalts.");
      return;
    }

    setError(false);
    setMsg("Inhalt gelöscht.");
    setForm((f) => ({ ...f, content: "" }));
  }

  async function resetTitle() {
    if (form.title === "Über uns") return;
    if (!confirm("Titel auf „Über uns“ zurücksetzen?")) return;

    setSaving(true);
    setMsg("");
    setError(false);

    const res = await fetch("/api/admin/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clearTitle" }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(true);
      setMsg(json.error ?? "Fehler beim Zurücksetzen des Titels.");
      return;
    }

    setError(false);
    setMsg("Titel zurückgesetzt.");
    setForm((f) => ({ ...f, title: "Über uns" }));
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
        <div className="space-y-3">
          <ProminentFileUpload
            name="image"
            label="Inhaltsbild (neben Text)"
            buttonLabel="Bild hochladen"
            currentImageUrl={imageUrl}
            disabled={saving}
          />
          {form.imageFile && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void removeImage()}
              className="rounded-sm border border-zinc-700 px-4 py-2 text-sm text-red-400 hover:border-red-900 hover:text-red-300 disabled:opacity-50"
            >
              Bild entfernen
            </button>
          )}
        </div>

        <div className="space-y-4 rounded-sm border border-zinc-800 p-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm text-zinc-400">Titel</label>
              {form.title !== "Über uns" && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void resetTitle()}
                  className="text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
                >
                  Titel zurücksetzen
                </button>
              )}
            </div>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm text-zinc-400">Inhalt</label>
              {form.content && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void clearContent()}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Inhalt löschen
                </button>
              )}
            </div>
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
