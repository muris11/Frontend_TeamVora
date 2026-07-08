"use client";

import { useMarketingStore } from "@/stores/marketing-store";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckSquare, MessageCircle } from "lucide-react"; // Common icons

export function MarketingPageRenderer({ slug }: { slug: string }) {
  const { getPage } = useMarketingStore();
  const pageData = getPage(slug);

  if (!pageData.enabled) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {pageData.sections.sort((a, b) => a.order - b.order).map((section) => {
        switch (section.type) {
          case 'hero':
            return (
              <section key={section.id} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" style={{ backgroundColor: section.bgColor, color: section.textColor }}>
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                      {section.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                      {section.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                      {section.content?.split(',').map((cta, i) => (
                        <Button key={i} size="lg" variant={i === 0 ? "default" : "outline"} className={i === 0 ? "h-14 px-8 text-lg rounded-xl" : "h-14 px-8 text-lg rounded-xl"}>
                          {cta}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'features':
            return (
              <section key={section.id} className="py-24" style={{ backgroundColor: section.bgColor, color: section.textColor }}>
                <div className="container mx-auto px-4">
                  <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">{section.title}</h2>
                    <p className="text-lg text-muted-foreground">{section.subtitle}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {section.items?.map((item: any, i: number) => (
                      <div key={i} className="bg-card p-8 rounded-2xl border shadow-sm space-y-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          {item.icon === 'CheckSquare' ? <CheckSquare /> : <MessageCircle />}
                        </div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'text':
          default:
            return (
              <section key={section.id} className="py-24" style={{ backgroundColor: section.bgColor, color: section.textColor }}>
                <div className="container mx-auto px-4 max-w-3xl">
                  {section.title && <h2 className="text-3xl font-bold mb-6">{section.title}</h2>}
                  {section.subtitle && <p className="text-xl text-muted-foreground mb-8">{section.subtitle}</p>}
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    {section.content?.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </section>
            );
        }
      })}
    </div>
  );
}
