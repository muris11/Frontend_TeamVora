import { MarketingPageRenderer } from "@/components/marketing/page-renderer";
import { defaultMarketingPages } from "@/lib/marketing-defaults";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const page = defaultMarketingPages.landing;
  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    openGraph: page.seo.ogImage ? {
      images: [page.seo.ogImage]
    } : undefined
  };
}

export default function LandingPage() {
  return <MarketingPageRenderer slug="landing" />;
}
