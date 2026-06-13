import { AdminNav } from "@/components/admin/admin-nav";
import { SiteLogoLink, resolveSiteLogo } from "@/components/layout/site-logo";
import { auth, signOut } from "@/lib/auth";
import { getCompany } from "@/lib/cms";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const company = await getCompany();
  const { logoUrl, alt } = resolveSiteLogo(company);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <aside className="hidden w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/50 lg:block">
        <div className="flex h-16 items-center border-b border-zinc-800 px-4">
          <SiteLogoLink
            href="/admin"
            logoUrl={logoUrl}
            alt={alt}
            className="h-10 w-auto max-w-[140px] object-contain brightness-0 invert"
          />
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
              Abmelden
            </button>
          </form>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-4 lg:hidden">
          <SiteLogoLink
            href="/admin"
            logoUrl={logoUrl}
            alt={alt}
            className="h-9 w-auto max-w-[120px] object-contain brightness-0 invert"
          />
          <AdminNav mobile />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
