import { API_URL, getHealth, getVehicles } from "@/lib/api";

export default async function Home() {
  let apiStatus = "unknown";
  let dbStatus = "unknown";
  let vehicleCount = 0;
  let error: string | null = null;

  try {
    const health = await getHealth();
    apiStatus = health.status;

    try {
      const readyRes = await fetch(`${API_URL}/api/health/ready`, { cache: "no-store" });
      const ready = (await readyRes.json()) as { database?: string };
      dbStatus = ready.database ?? "unknown";
    } catch {
      dbStatus = "unreachable";
    }

    const vehicles = await getVehicles();
    vehicleCount = vehicles.data.length;
  } catch (e) {
    error = e instanceof Error ? e.message : "API unreachable";
    apiStatus = "offline";
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">TUNCAUTO</h1>
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">v0.1.0</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
        <section>
          <h2 className="text-3xl font-semibold tracking-tight">Platform hazır</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Frontend, backend API ve PostgreSQL altyapısı kuruldu. Promptunuzu bekliyoruz.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatusCard label="API" value={apiStatus} ok={apiStatus === "ok"} />
          <StatusCard label="Database" value={dbStatus} ok={dbStatus === "connected"} />
          <StatusCard label="Vehicles" value={String(vehicleCount)} ok />
        </section>

        {error && (
          <p className="rounded-lg border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
            Backend çalışmıyor olabilir. <code className="text-amber-100">npm run dev</code> ile
            başlatın veya Railway deploy bekleyin. ({error})
          </p>
        )}

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="font-medium">Stack</h3>
          <ul className="mt-3 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
            <li>Frontend — Next.js 16 + Tailwind</li>
            <li>Backend — Express + TypeScript</li>
            <li>Database — PostgreSQL + Prisma</li>
            <li>Deploy — Railway + GitHub</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function StatusCard({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-2 text-lg font-medium ${ok ? "text-emerald-400" : "text-zinc-300"}`}>
        {value}
      </p>
    </div>
  );
}
