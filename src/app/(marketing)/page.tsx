"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Wallet, Banknote, CreditCard, PiggyBank, Receipt, TrendingUp, TrendingDown, DollarSign, Coins,
  CheckSquare, CheckCircle2, ClipboardList, ClipboardCheck, ListTodo, ListChecks, BadgeCheck,
  Users, UserCheck, UserPlus, UserCog, UsersRound, Contact, PersonStanding,
  Shield, ShieldCheck, ShieldAlert, Lock, KeyRound, Fingerprint,
  Zap, Rocket, Sparkles, Star, Stars,
  BarChart3, BarChart4, LineChart, PieChart, Activity, TrendingUp as TrendUp,
  PlayCircle, Video, ImagePlus, Camera, Film,
  Bell, BellRing, MessageCircle, MessageSquare, Send, Mail, Inbox,
  Calendar, CalendarCheck, CalendarDays, Clock, Timer, AlarmClock,
  FolderOpen, FolderArchive, FileText, FilePlus, FileCheck, Archive,
  Settings, Settings2, SlidersHorizontal, Cog, Wrench,
  Building, Building2, Briefcase, Package, Store, Globe,
  Map, MapPin, Navigation, Compass,
  Cpu, Database, Server, Cloud, CloudUpload, HardDrive, Wifi,
  BookOpen, BookMarked, GraduationCap, Library, Newspaper,
  Heart, Handshake, Award, Trophy, Target, Milestone, Flag,
  LayoutDashboard, LayoutGrid, Layers, Grid2X2, PanelLeft, AppWindow,
  ExternalLink, QrCode, Share2, Download, Upload,
  Sun, Moon, Palette, Brush, Pen, PenLine,
  AlertCircle, Info, HelpCircle, Lightbulb, Flame
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { SEOHead } from "@/components/shared/seo-head";
import { getColorTheme } from "@/lib/colors";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function MarketingPage() {
  const shouldReduceMotion = useReducedMotion();
  const { data: settings } = usePlatformSettings();

  const siteName = settings?.general?.site_name || "TeamVora";
  const siteTagline = settings?.general?.tagline || "Satu platform untuk seluruh operasional tim Anda.";
  const contactEmail = settings?.contact?.contact_email || "";

  const mkt = settings?.marketing;
  const heroTitle = mkt?.hero_title || "Satu Platform untuk";
  const heroTitleGradient = mkt?.hero_title ? "" : "Manajemen Tim Modern";
  const heroSubtitle = mkt?.hero_subtitle || siteTagline;
  const heroCtaText = mkt?.hero_cta_text || "Mulai Gratis Sekarang";
  const heroCtaLink = mkt?.hero_cta_link || "/register";
  const featuresTitle = mkt?.features_title || "Segala yang Anda butuhkan,";
  const featuresTitleSub = mkt?.features_title ? "" : "tanpa kekacauan.";
  const testimonialsTitle = mkt?.testimonials_title || "Dicintai oleh tim produktif";

  const parsedFeatures: Array<{ title: string; description: string; icon: string }> = (() => {
    if (!mkt?.features) return [];
    try { return JSON.parse(mkt.features); } catch { return []; }
  })();

  const parsedTestimonials: Array<{ name: string; role: string; quote: string }> = (() => {
    if (!mkt?.testimonials) return [];
    try { return JSON.parse(mkt.testimonials); } catch { return []; }
  })();

  const parsedLogos: string[] = (() => {
    const anyMkt = mkt as any;
    if (!anyMkt?.client_logos) return [];
    try { return JSON.parse(anyMkt.client_logos); } catch { return []; }
  })();

  const iconMap: Record<string, any> = {
    // Finance
    Wallet, Banknote, CreditCard, PiggyBank, Receipt, TrendingUp, TrendingDown, DollarSign, Coins,
    // Tasks & Productivity
    CheckSquare, CheckCircle2, ClipboardList, ClipboardCheck, ListTodo, ListChecks, BadgeCheck,
    // People
    Users, UserCheck, UserPlus, UserCog, UsersRound, Contact, PersonStanding,
    // Security
    Shield, ShieldCheck, ShieldAlert, Lock, KeyRound, Fingerprint,
    // Performance
    Zap, Rocket, Sparkles, Star, Stars,
    // Analytics
    BarChart3, BarChart4, LineChart, PieChart, Activity,
    // Media
    PlayCircle, Video, Image, ImagePlus, Camera, Film,
    // Communication
    Bell, BellRing, MessageCircle, MessageSquare, Send, Mail, Inbox,
    // Time
    Calendar, CalendarCheck, CalendarDays, Clock, Timer, AlarmClock,
    // Files
    FolderOpen, FolderArchive, FileText, FilePlus, FileCheck, Archive,
    // Settings
    Settings, Settings2, SlidersHorizontal, Cog, Wrench,
    // Business
    Building, Building2, Briefcase, Package, Store, Globe,
    // Location
    Map, MapPin, Navigation, Compass,
    // Tech
    Cpu, Database, Server, Cloud, CloudUpload, HardDrive, Wifi,
    // Knowledge
    BookOpen, BookMarked, GraduationCap, Library, Newspaper,
    // Engagement
    Heart, Handshake, Award, Trophy, Target, Milestone, Flag,
    // Layout
    LayoutDashboard, LayoutGrid, Layers, Grid2X2, PanelLeft, AppWindow,
    // Sharing
    Link, ExternalLink, QrCode, Share2, Download, Upload, ArrowRight,
    // Design
    Sun, Moon, Palette, Brush, Pen, PenLine,
    // Misc
    AlertCircle, Info, HelpCircle, Lightbulb, Flame,
  };


  const fallbackColors = ["blue", "emerald", "amber", "purple", "rose", "cyan"];
  const features = parsedFeatures.map((f: any, i: number) => {
      const theme = getColorTheme(f.color || fallbackColors[i % fallbackColors.length]);
      return {
        title: f.title,
        desc: f.description,
        icon: iconMap[f.icon] || CheckSquare,
        col: "md:col-span-2",
        color: theme.text,
        bg: theme.bg,
      };
  });

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <SEOHead
        title={`${siteName} - Platform Manajemen Tim`}
        description={siteTagline}
        keywords="manajemen tim, produktivitas, kolaborasi, cash book, task management, Indonesia"
        ogUrl="https://teamvora.coded.my.id"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background"></div>
        <div className="absolute inset-0 -z-10 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            variants={staggerContainer}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate="visible"
          >
            <motion.div variants={fadeUpVariants} className="flex justify-center">
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {siteName} 2.0 is Live
                </span>
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeUpVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground"
              style={{ lineHeight: 1.1 }}
            >
              {heroTitle} <br className="hidden md:block" />
              {heroTitleGradient && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  {heroTitleGradient}
                </span>
              )}
            </motion.h1>

            <motion.p 
              variants={fadeUpVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div 
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-semibold rounded-full w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group" 
                asChild
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href={heroCtaLink}>
                    {heroCtaText}
                    <ArrowRight data-icon="inline-end" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </Button>
              {mkt?.hero_cta2_text && (
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-full w-full sm:w-auto hover:bg-secondary/50" asChild>
                  <Link href={mkt?.hero_cta2_link || "#"}>
                    <PlayCircle data-icon="inline-start" className="mr-2 text-muted-foreground" />
                    {mkt.hero_cta2_text}
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>

            <motion.div 
              className="mt-16 relative mx-auto max-w-3xl rounded-3xl border bg-background/50 p-2 md:p-3 shadow-2xl backdrop-blur-sm"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-2xl md:rounded-3xl overflow-hidden border bg-background shadow-sm ring-1 ring-border/50 relative aspect-[16/9] flex items-center justify-center bg-muted/20">
                <img 
                  src={mkt?.hero_image_url || "/hero_3d.png"}
                  alt="Dashboard Interface" 
                  className="w-full h-full object-contain p-2 md:p-6 drop-shadow-2xl"
                />
              </div>
            </motion.div>

        </div>
      </section>

      {/* Logo Wall using InfiniteSlider */}
      {parsedLogos.length > 0 && (
      <section className="py-12 border-y bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
            Dipercaya oleh perusahaan inovatif
          </p>
          <InfiniteSlider gap={64} speed={40} className="mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)">
            {parsedLogos.map((logo, i) => (
              <div key={i} className="text-2xl font-bold text-foreground/30 hover:text-foreground transition-colors duration-300 px-4">
                {logo}
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>
      )}

      {/* Features Bento Grid */}
      {features.length > 0 && (
        <section className="py-24 relative" id="features">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                {featuresTitle} <br className="hidden md:block" /> {featuresTitleSub}
              </h2>
              {!mkt?.features_title && (
                <p className="text-lg text-muted-foreground">
                  Fitur-fitur bertenaga tinggi yang disederhanakan dalam antarmuka yang elegan, dirancang khusus untuk alur kerja modern.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
              {features.map((feature, i) => {
                  const isLarge = i % 3 === 0;
                  return (
                    <motion.div
                      key={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      variants={scaleInVariants}
                      className={cn("h-full", isLarge ? "md:col-span-3" : "md:col-span-2")}
                    >
                      <Card className="h-full overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group border-border/50 hover:border-primary/20">
                        <CardHeader className="flex-1 space-y-4">
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border", feature.bg)}>
                            <feature.icon className={cn("h-6 w-6", feature.color)} />
                          </div>
                          <div>
                            <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                            <CardDescription className="text-base">{feature.desc}</CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {parsedTestimonials.length > 0 && (
        <section className="py-24 bg-muted/20 border-y relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Testimonial</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{testimonialsTitle}</h2>
              <p className="text-muted-foreground text-lg">Jangan hanya percaya kata-kata kami.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {parsedTestimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full flex flex-col justify-between hover:border-primary/20 transition-colors">
                    <CardHeader>
                      <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                      </div>
                      <p className="text-foreground/90 text-lg leading-relaxed italic">"{t.quote}"</p>
                    </CardHeader>
                    <CardContent className="mt-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {t.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Siap meningkatkan produktivitas tim Anda?
              </h2>
              <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto">
                Bergabunglah dengan ribuan tim yang telah beralih ke {siteName}. Mulai gratis hari ini, tingkatkan seiring pertumbuhan Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-bold rounded-full text-primary w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow" asChild>
                  <Link href={heroCtaLink}>
                    {heroCtaText}
                  </Link>
                </Button>
                {mkt?.hero_cta2_text && (
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto bg-transparent" asChild>
                    <Link href={mkt?.hero_cta2_link || "#"}>
                      {mkt.hero_cta2_text}
                    </Link>
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-sm text-primary-foreground/80 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Tanpa Kartu Kredit</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Setup 5 Menit</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Bantuan 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function BlogSection() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", "latest"],
    queryFn: async () => {
      const res = await fetch("/api/posts?limit=3");
      if (!res.ok) throw new Error("Gagal mengambil post");
      const json = await res.json();
      return json.data;
    },
  });

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4">Resource</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Wawasan Terbaru</h2>
            <p className="text-muted-foreground text-lg">
              Tips produktivitas, pembaruan fitur, dan panduan manajemen tim dari blog kami.
            </p>
          </div>
          <Link href="/blog" passHref>
            <Button variant="ghost" className="group">
              Lihat Semua Artikel 
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[400px] animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts?.map((post: any, index: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <Card className="h-full flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs font-normal">
                          {post.Category?.name || "Umum"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4 border-t mt-auto flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                        {post.User?.name?.charAt(0) || "U"}
                      </div>
                      <span className="text-sm font-medium">{post.User?.name || "Anonim"}</span>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
