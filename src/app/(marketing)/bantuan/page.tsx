"use client";

import { motion } from "motion/react";
import { Search, Mail, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";
import { iconMap } from "@/components/ui/icon-picker";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const defaultChannels: any[] = [];
const defaultArticles: string[] = [];

export default function BantuanPage() {
  const { data: settings } = usePlatformSettings();

  let channels = defaultChannels;
  let articles = defaultArticles;
  try {
    const raw = settings?.marketing?.help_content;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.articles?.length) {
        channels = parsed.articles.map((a: any) => ({
          title: a.title || "",
          icon: a.icon || "Mail",
          description: a.description || "",
          action: a.action || "",
          link: a.link || "#",
        }));
      }
      if (parsed?.popular_articles?.length) {
        articles = parsed.popular_articles;
      }
    }
  } catch {}

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <PageTitle title="Pusat Bantuan - TeamVora" />

      <section className="container mx-auto px-6 max-w-3xl mb-24 text-center">
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">Pusat Bantuan</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Punya pertanyaan atau mengalami kendala? Kami di sini siap membantu Anda kapan pun dibutuhkan.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input type="text" placeholder="Cari solusi atau artikel panduan..." className="w-full pl-12 pr-6 py-8 rounded-full text-base shadow-sm border-border" />
          </div>
        </motion.div>
      </section>

      {channels.length > 0 && (
        <section className="container mx-auto px-6 max-w-5xl mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channels.map((channel: any, idx: number) => {
              const IconComp = iconMap[channel.icon] || Mail;
              return (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Card className="h-full border-border/50 text-center hover:border-primary/50 transition-all rounded-3xl p-6 shadow-sm">
                        <CardHeader className="p-0 mb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                            <IconComp className="w-7 h-7" />
                            </div>
                            <CardTitle className="text-2xl tracking-tight">{channel.title}</CardTitle>
                            <CardDescription className="mt-2 text-base">{channel.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Button variant="outline" className="w-full rounded-xl py-6 font-bold" asChild>
                                <Link href={channel.link}>{channel.action}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="py-24 bg-muted/20 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tighter">Artikel Populer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {articles.map((article: string, i: number) => (
                <Link key={i} href="/panduan" className="flex items-center justify-between p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all group shadow-sm">
                  <span className="font-semibold text-base">{article}</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
            <div className="mt-16">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-bold" asChild>
                <Link href="/panduan">
                  Lihat Semua Panduan <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
