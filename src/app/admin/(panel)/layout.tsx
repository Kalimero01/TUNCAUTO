import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="hidden w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/50 lg:block">
        <div className="flex h-16 items-center border-b border-zinc-800 px-6">
          <Link href="/admin" className="font-bold text-white">
            TUNCAUTO Admin
          </Link>
        </div>
        <AdminNav />
        <div className="border-t border-zinc-800 p-4">
          <p className="truncate text-xs text-zinc-500">{session.user.username}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="mt-2 text-xs text-zinc-400 hover:text-white">
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6 lg:hidden">
          <Link href="/admin" className="font-bold text-white">
            Admin
          </Link>
          <AdminNav mobile />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
