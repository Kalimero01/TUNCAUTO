import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-white">TUNCAUTO</p>
          <p className="mt-1 text-sm text-zinc-500">
            Premium araç galerisi — güvenilir alım & satım
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
          <Link href="/araclar" className="hover:text-zinc-300">
            Araçlar
          </Link>
          <Link href="/sat" className="hover:text-zinc-300">
            Aracını Sat
          </Link>
          <Link href="/hakkimizda" className="hover:text-zinc-300">
            Hakkımızda
          </Link>
        </div>
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} TUNCAUTO. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
