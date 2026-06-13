import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LiveChatWidget } from "@/components/chat/live-chat-widget";
import { SiteStructuredData } from "@/components/seo/site-structured-data";

export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteStructuredData />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <LiveChatWidget />
    </div>
  );
}
