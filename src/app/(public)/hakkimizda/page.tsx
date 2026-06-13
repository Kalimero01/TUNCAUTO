import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "TUNCAUTO hakkında bilgi edinin.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Hakkımızda</h1>
      <div className="mt-8 space-y-4 text-zinc-400">
        <p>
          TUNCAUTO, premium araç alım-satım deneyimi sunan güvenilir bir galeridir. Müşterilerimize
          kaliteli araçlar, şeffaf fiyatlandırma ve profesyonel hizmet sunmayı hedefliyoruz.
        </p>
        <p>
          Aracınızı satmak istiyorsanız online formumuzu doldurabilir, ekibimiz en kısa sürede
          sizinle iletişime geçer.
        </p>
      </div>
    </div>
  );
}
