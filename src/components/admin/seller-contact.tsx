import { submissionLabels } from "@/lib/i18n/de";

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function SellerContactSummary({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="font-medium text-white">{name}</span>
      <a
        href={`mailto:${email}`}
        onClick={(e) => e.stopPropagation()}
        className="text-brand-400 hover:text-brand-300 hover:underline"
      >
        {email}
      </a>
      <a
        href={telHref(phone)}
        onClick={(e) => e.stopPropagation()}
        className="text-brand-400 hover:text-brand-300 hover:underline"
      >
        {phone}
      </a>
    </div>
  );
}

export function SellerContactCard({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  return (
    <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-5">
      <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">
        {submissionLabels.contact}
      </h2>
      <p className="mt-3 text-lg font-medium text-white">{name}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <a
          href={telHref(phone)}
          className="inline-flex items-center gap-2 rounded-lg border border-brand-500/40 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-300 transition hover:border-brand-400 hover:text-white"
        >
          <span className="text-zinc-500">{submissionLabels.phone}:</span>
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 rounded-lg border border-brand-500/40 bg-brand-500/10 px-4 py-2.5 text-sm font-medium text-brand-300 transition hover:border-brand-400 hover:text-white"
        >
          <span className="text-zinc-500">{submissionLabels.email}:</span>
          {email}
        </a>
      </div>
    </div>
  );
}
