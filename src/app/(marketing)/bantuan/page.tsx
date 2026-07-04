"use client";

import { Search, Mail, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";

const iconMap: Record<string, any> = { Mail, MessageCircle, Phone };

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
    <main className="min-h-screen bg-background">
      <PageTitle title="Pusat Bantuan - TeamVora" />

      <section className="relative pt-32 pb-20 bg-primary/5 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Pusat Bantuan
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Punya pertanyaan atau mengalami kendala? Kami di sini siap membantu Anda kapan pun dibutuhkan.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input type="text" placeholder="Cari solusi atau artikel panduan..." className="w-full pl-10 pr-4 py-6 rounded-full text-base shadow-sm border-border" />
          </div>
        </div>
      </section>

      {channels.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channels.map((channel: any, idx: number) => {
                const IconComp = iconMap[channel.icon] || Mail;
                return (
                  <Card key={idx} className="border-border/50 text-center hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <CardTitle>{channel.title}</CardTitle>
                      <CardDescription className="mt-2">{channel.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={channel.link}>{channel.action}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="py-16 bg-muted/20 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-8">Artikel Populer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {articles.map((article: string, i: number) => (
                <Link key={i} href="/panduan" className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors group">
                  <span className="font-medium text-sm">{article}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
            <div className="mt-12">
              <Button size="lg" asChild>
                <Link href="/panduan">
                  Lihat Semua Panduan <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
