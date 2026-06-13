"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SellerContactCard } from "@/components/admin/seller-contact";
import { de, submissionLabels } from "@/lib/i18n/de";
import { formatMileage, formatPrice } from "@/lib/utils";

type Submission = {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  make: string;
  model: string;
  year: number;
  price: string;
  desiredPrice: string | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  hasAccident: boolean | null;
  accidentDetails: string | null;
  hasRepaint: boolean | null;
  repaintDetails: string | null;
  hasPartsReplaced: boolean | null;
  partsDetails: string | null;
  isRead: boolean;
  images: Array<{ id: string; url: string }>;
  videos: Array<{ id: string; url: string }>;
};

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/submissions/${id}`);
    const json = await res.json();
    setSubmission(json.data ?? null);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="text-zinc-500">{de.loading}</p>;
  if (!submission) return <p className="text-zinc-500">{de.submissionNotFound}</p>;

  return (
    <div>
      <Link href="/admin/submissions" className="text-sm text-brand-400 hover:text-brand-300">
        {submissionLabels.backToOffers}
      </Link>

      <SellerContactCard
        name={submission.sellerName}
        email={submission.sellerEmail}
        phone={submission.sellerPhone}
      />

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {submission.make} {submission.model} {submission.year}
          </h1>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            submission.isRead
              ? "border-zinc-700 text-zinc-500"
              : "border-brand-500/50 text-brand-400"
          }`}
        >
          {submission.isRead ? "Gelesen" : "Ungelesen"}
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <InfoBlock title="Preis" value={formatPrice(submission.price)} />
          {submission.desiredPrice && (
            <InfoBlock title="Wunschpreis" value={formatPrice(submission.desiredPrice)} />
          )}
          <InfoBlock title="Kilometerstand" value={formatMileage(submission.mileage)} />
          <InfoBlock title="Kraftstoff" value={submission.fuelType ?? "—"} />
          <InfoBlock title="Getriebe" value={submission.transmission ?? "—"} />
          <InfoBlock title="Farbe" value={submission.color ?? "—"} />
          {submission.description && (
            <div>
              <h3 className="text-sm text-zinc-500">Beschreibung</h3>
              <p className="mt-1 whitespace-pre-wrap text-zinc-300">{submission.description}</p>
            </div>
          )}
          <HistoryBlock
            label="Unfallschäden"
            hasIssue={submission.hasAccident}
            details={submission.accidentDetails}
          />
          <HistoryBlock
            label="Neulackierung"
            hasIssue={submission.hasRepaint}
            details={submission.repaintDetails}
          />
          <HistoryBlock
            label="Ausgetauschte Teile"
            hasIssue={submission.hasPartsReplaced}
            details={submission.partsDetails}
          />
        </div>

        <div>
          {submission.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {submission.images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-zinc-800">
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
          {submission.videos.map((vid) => (
            <video key={vid.id} src={vid.url} controls className="mt-2 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm text-zinc-500">{title}</h3>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}

function HistoryBlock({
  label,
  hasIssue,
  details,
}: {
  label: string;
  hasIssue: boolean | null;
  details: string | null;
}) {
  if (hasIssue === null) return null;

  return (
    <div>
      <h3 className="text-sm text-zinc-500">{label}</h3>
      <p className="mt-1 text-white">{hasIssue ? "Ja" : "Nein"}</p>
      {hasIssue && details && (
        <p className="mt-1 text-sm text-zinc-400">{details}</p>
      )}
    </div>
  );
}
