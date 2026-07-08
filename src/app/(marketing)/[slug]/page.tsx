import { MarketingPageRenderer } from "@/components/marketing/page-renderer";
import { defaultMarketingPages } from "@/lib/marketing-defaults";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  // Generate routes for all pages except 'landing' which is handled by root page.tsx, 
  // and 'panduan' which is a redirect.
  return Object.keys(defaultMarketingPages)
    .filter(slug => slug !== 'landing' && slug !== 'panduan')
    .map((slug) => ({
      slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = defaultMarketingPages[slug];
  
  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    openGraph: page.seo.ogImage ? {
      images: [page.seo.ogImage]
    } : undefined
  };
}

export default async function DynamicMarketingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  
  if (!defaultMarketingPages[slug]) {
    notFound();
  }

  return <MarketingPageRenderer slug={slug} />;
}
