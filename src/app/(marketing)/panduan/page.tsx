"use client";

import { motion } from "motion/react";
import { Book, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";
import { iconMap } from "@/components/ui/icon-picker";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

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
    <main className="min-h-screen bg-background pt-32 pb-24">
      <PageTitle title="Panduan Pengguna - TeamVora" />

      <section className="container mx-auto px-6 max-w-5xl">
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">Panduan Pengguna</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Pelajari semua fitur dan praktik terbaik untuk mengoptimalkan operasional tim Anda bersama TeamVora.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {categories.map((category: any, idx: number) => {
              const IconComp = iconMap[category.icon] || Book;
              return (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Card className="h-full border-border/50 shadow-sm hover:border-primary/20 transition-all rounded-3xl p-6">
                        <CardHeader className="p-0 mb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <IconComp className="w-7 h-7 text-primary" />
                            </div>
                            <CardTitle className="text-2xl tracking-tight">{category.title}</CardTitle>
                            <CardDescription className="text-base mt-2">{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="space-y-3">
                            {category.articles.map((article: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                                <FileText className="w-5 h-5 mt-0.5 shrink-0 text-primary/50" />
                                <span>{article}</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </li>
                            ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
              );
            })}
        </div>

        {faqs.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-3xl border border-border/50"
            >
              <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq: any, idx: number) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          )}
      </section>
    </main>
  );
}
