"use client";

import { useState } from "react";
import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/hakkimizda", label: "About Us" },
  { href: "/vizyon-misyon", label: "Vision & Mission" },
  { href: "/araclar", label: "Vehicles" },
  { href: "/sat", label: "Sell Your Vehicle" },
  { href: "/iletisim", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-sm border border-zinc-700 px-3 py-2 text-zinc-400"
        aria-label="Menü"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-zinc-800 bg-black/95 px-4 py-4 backdrop-blur-xl">
          <nav className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-zinc-300 hover:text-metallic"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
