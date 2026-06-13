"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/about", label: "About Us" },
  { href: "/admin/vision-mission", label: "Vision & Mission" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/submissions", label: "Offers" },
  { href: "/admin/social", label: "Social Media" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/impressum", label: "Impressum" },
  { href: "/admin/live-chat", label: "Live Chat" },
  { href: "/admin/chat", label: "Offer Chat" },
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
