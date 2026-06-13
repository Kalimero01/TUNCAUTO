import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [vehicleCount, availableCount, pendingSubmissions, unreadMessages, recentSubmissions] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.sellerSubmission.count({ where: { status: "PENDING" } }),
      prisma.chatMessage.count({ where: { senderType: "SELLER", isRead: false } }),
      prisma.sellerSubmission.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Übersicht</h1>
      <p className="mt-1 text-zinc-500">Willkommen, {session.user.username}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Fahrzeuge gesamt" value={vehicleCount} />
        <StatCard label="Verfügbar" value={availableCount} />
        <StatCard label="Offene Angebote" value={pendingSubmissions} href="/admin/submissions" />
        <StatCard label="Ungelesene Nachrichten" value={unreadMessages} href="/admin/chat" />
      </div>

      <section className="mt-10">
        <h2 className="font-semibold text-white">Neueste Angebote</h2>
        {recentSubmissions.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Keine offenen Angebote.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {recentSubmissions.map((s) => (
              <Link
                key={s.id}
                href={`/admin/submissions/${s.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3 transition hover:border-zinc-700"
              >
                <div>
                  <p className="font-medium text-white">
                    {s.make} {s.model} {s.year}
                  </p>
                  <p className="text-xs text-zinc-500">{s.sellerName}</p>
                </div>
                <span className="text-xs text-zinc-500">
                  {new Date(s.createdAt).toLocaleDateString("de-DE")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
