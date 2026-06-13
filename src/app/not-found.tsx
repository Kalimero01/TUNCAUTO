import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-400">404</p>
      <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Seite nicht gefunden</h1>
      <p className="mt-4 max-w-md text-zinc-500">
        Die gesuchte Seite wurde entfernt oder die Adresse hat sich geändert.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400"
        >
          Startseite
        </Link>
        <Link
          href="/araclar"
          className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
        >
          Fahrzeuge ansehen
        </Link>
      </div>
    </div>
  );
}
