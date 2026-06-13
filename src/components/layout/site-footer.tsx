import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-bold text-white">TUNCAUTO</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Premium araç galerisi — güvenilir alım & satım deneyimi.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Sayfalar</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/araclar" className="text-zinc-400 hover:text-white">
                Araçlar
              </Link>
              <Link href="/sat" className="text-zinc-400 hover:text-white">
                Aracını Sat
              </Link>
              <Link href="/hakkimizda" className="text-zinc-400 hover:text-white">
                Hakkımızda
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">İletişim</p>
            <p className="mt-4 text-sm text-zinc-400">admin@tuncauto.com</p>
            <Link
              href="/sat"
              className="mt-4 inline-flex text-sm text-brand-400 hover:text-brand-300"
            >
              Satış başvurusu yap →
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} TUNCAUTO. Tüm hakları saklıdır.
          </p>
          <Link href="/admin/login" className="text-xs text-zinc-600 hover:text-zinc-400">
            Yönetim Paneli
          </Link>
        </div>
      </div>
    </footer>
  );
}
