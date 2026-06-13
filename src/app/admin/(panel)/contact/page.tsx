"use client";

import { useEffect, useState } from "react";

type Company = {
  name: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string | null;
};

export default function AdminContactPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/company").then((r) => r.json()).then((j) => setCompany(j.data));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/admin/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMsg(res.ok ? "Gespeichert." : "Fehler.");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Contact</h1>
      {msg && <p className="mt-2 text-sm text-emerald-400">{msg}</p>}
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-4 rounded-sm border border-zinc-800 p-6">
        <Field name="name" label="Firmenname" defaultValue={company?.name} required />
        <div>
          <label className="block text-sm text-zinc-400">Adresse</label>
          <textarea name="address" required defaultValue={company?.address} rows={3} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
        </div>
        <Field name="phone" label="Telefon" defaultValue={company?.phone} required />
        <Field name="email" label="E-Mail" type="email" defaultValue={company?.email} required />
        <div>
          <label className="block text-sm text-zinc-400">Google Maps Embed URL</label>
          <input name="mapEmbedUrl" defaultValue={company?.mapEmbedUrl ?? ""} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
        </div>
        <button type="submit" className="rounded-sm bg-metallic px-6 py-2 text-sm font-semibold text-black">Speichern</button>
      </form>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input {...rest} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
    </div>
  );
}
