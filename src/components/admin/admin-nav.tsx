"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNav } from "@/lib/i18n/de";

export function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn(mobile ? "flex gap-3 overflow-x-auto" : "space-y-1 p-4")}>
      {adminNav.map((link) => {
        const active = "exact" in link && link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-sm px-3 py-2 text-sm transition",
              active
                ? "bg-metallic/20 text-metallic"
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
