"use client";

import { Book, FileText, Settings, Users, CreditCard, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";

import { iconMap } from "@/components/ui/icon-picker";
const defaultCategories: any[] = [];
const defaultFaqs: any[] = [];

export default function PanduanPage() {
  const { data: settings } = usePlatformSettings();

  let categories = defaultCategories;
  let faqs = defaultFaqs;

  try {
    const raw = settings?.marketing?.guide_content;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.categories?.length) {
        categories = parsed.categories.map((c: any) => ({
          title: c.title || "",
          icon: c.icon || "Book",
          description: c.description || "",
          articles: c.articles?.length ? c.articles : [""],
        }));
      }
      if (parsed?.faqs?.length) {
        faqs = parsed.faqs.map((f: any) => ({ question: f.question || "", answer: f.answer || "" }));
      }
    }
  } catch {}

  return (
    <main className="min-h-screen bg-background">
      <PageTitle title="Panduan Pengguna - TeamVora" />

      <section className="relative pt-32 pb-20 bg-muted/30 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Panduan Pengguna
          </h1>
          <p className="text-xl text-muted-foreground">
            Pelajari semua fitur dan praktik terbaik untuk mengoptimalkan operasional tim Anda bersama TeamVora.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {categories.map((category: any, idx: number) => {
              const IconComp = iconMap[category.icon] || Book;
              return (
                <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <IconComp className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.articles.map((article: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                          <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{article}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {faqs.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq: any, idx: number) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
