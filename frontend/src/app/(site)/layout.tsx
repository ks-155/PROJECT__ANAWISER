import { SiteHeader } from "@/components/site-header";
import { AnawiserChatProvider } from "@/components/chat-context";
import { AiAssistantPanel } from "@/components/ai-assistant";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnawiserChatProvider>
      <div className="page-glow">
        <div className="orb orb-amber" />
        <div className="orb orb-rose" />
        <div className="orb orb-amber-mid" />
        <div className="relative z-10">
          <SiteHeader />
          {children}
        </div>
        <AiAssistantPanel />
      </div>
    </AnawiserChatProvider>
  );
}
