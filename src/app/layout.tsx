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
    default: "TUNCAUTO | Premium Araç Galerisi",
    template: "%s | TUNCAUTO",
  },
  description:
    "TUNCAUTO — kaliteli ikinci el ve sıfır araçlar. Güvenilir alım-satım, profesyonel hizmet.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "TUNCAUTO",
    title: "TUNCAUTO | Premium Araç Galerisi",
    description: "Kaliteli araçlar, güvenilir alım-satım.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
