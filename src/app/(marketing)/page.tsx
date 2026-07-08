"use client";

import { SEOHead } from "@/components/shared/seo-head";
import { HeroSection } from "@/components/marketing/hero-section";
import { TrustedCompanies } from "@/components/marketing/trusted-companies";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { WorkflowTimeline } from "@/components/marketing/workflow-timeline";
import { PlatformIntegrations } from "@/components/marketing/platform-integrations";
import { StatisticsSection } from "@/components/marketing/statistics-section";
import { DeepDiveSections } from "@/components/marketing/deep-dive-sections";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQSection } from "@/components/marketing/faq-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function MarketingPage() {
  const siteName = "TeamVora";
  const siteTagline = "Standar Baru untuk Manajemen Operasional";

  return (
    <>
      <SEOHead 
        title={`${siteName} - ${siteTagline}`} 
        description="TeamVora menyatukan presensi, komunikasi tim, pengajuan cuti, dan kasbon dalam satu ruang kerja minimalis yang didesain untuk kecepatan." 
      />

      <div className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans">
        <HeroSection />
        <TrustedCompanies />
        <FeaturesGrid />
        <WorkflowTimeline />
        <PlatformIntegrations />
        <StatisticsSection />
        <DeepDiveSections />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
}
