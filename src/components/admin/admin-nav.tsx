"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/vehicles", label: "Araçlar" },
  { href: "/admin/submissions", label: "Başvurular" },
  { href: "/admin/chat", label: "Mesajlar" },
  { href: "/admin/settings", label: "Ayarlar" },
];

export function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn(mobile ? "flex gap-3 overflow-x-auto" : "space-y-1 p-4")}>
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm transition",
              active
                ? "bg-brand-500/20 text-brand-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
              mobile && "whitespace-nowrap"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
