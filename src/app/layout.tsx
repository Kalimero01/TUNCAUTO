import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { getBaseUrl } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "TUNC AUTO | Premium-Automobile",
    template: "%s | TUNC AUTO",
  },
  description:
    "TUNC AUTO — Premium-Autohaus. Exklusive Fahrzeuge, Finanzierung und professioneller An- und Verkauf.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "TUNC AUTO",
    title: "TUNC AUTO | Premium-Automobile",
    description: "Exklusive Fahrzeuge. Vertrauen. Eleganz.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-black text-zinc-100 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
