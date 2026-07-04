import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Noise Overlay */}
      <div className="noise" />

      {/* Navigation (Sticky & Responsive) */}
      <MarketingNavbar />

      <main className="relative z-10 min-h-[calc(100vh-140px)]">
        {children}
      </main>

      <MarketingFooter />
    </div>
  );
}
