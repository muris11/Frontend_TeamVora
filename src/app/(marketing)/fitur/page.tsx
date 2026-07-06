"use client";

import { motion } from "motion/react";
import {
  CheckCircle2, ListTodo, Wallet, FolderOpen, ArrowRight, Zap, Target, LayoutDashboard, ShieldCheck,
  Banknote, CreditCard, PiggyBank, Receipt, TrendingUp, TrendingDown, DollarSign, Coins,
  CheckSquare, ClipboardList, ClipboardCheck, ListChecks, BadgeCheck,
  Users, UserCheck, UserPlus, UserCog, UsersRound, Contact,
  Shield, ShieldAlert, Lock, KeyRound, Fingerprint,
  Rocket, Sparkles, Star, Stars,
  BarChart3, BarChart4, LineChart, PieChart, Activity,
  PlayCircle, Video, ImagePlus, Camera, Film,
  Bell, BellRing, MessageCircle, MessageSquare, Send, Mail, Inbox,
  Calendar, CalendarCheck, CalendarDays, Clock, Timer, AlarmClock,
  FolderArchive, FileText, FilePlus, FileCheck, Archive,
  Settings, Settings2, SlidersHorizontal, Cog, Wrench,
  Building, Building2, Briefcase, Package, Store, Globe,
  Map, MapPin, Navigation, Compass,
  Cpu, Database, Server, Cloud, CloudUpload, HardDrive, Wifi,
  BookOpen, BookMarked, GraduationCap, Library, Newspaper,
  Heart, Handshake, Award, Trophy, Milestone, Flag,
  LayoutGrid, Layers, Grid2X2, PanelLeft, AppWindow,
  ExternalLink, QrCode, Share2, Download, Upload,
  Sun, Moon, Palette, Brush, Pen, PenLine,
  AlertCircle, Info, HelpCircle, Lightbulb, Flame
} from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/shared/seo-head";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { getColorTheme } from "@/lib/colors";
import { cn } from "@/lib/utils";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function FiturPage() {
  const { data: settings } = usePlatformSettings();

  const iconMap: Record<string, any> = {
    // Finance
    Wallet, Banknote, CreditCard, PiggyBank, Receipt, TrendingUp, TrendingDown, DollarSign, Coins,
    // Tasks & Productivity
    CheckSquare, CheckCircle2, ClipboardList, ClipboardCheck, ListTodo, ListChecks, BadgeCheck,
    // People
    Users, UserCheck, UserPlus, UserCog, UsersRound, Contact,
    // Security
    Shield, ShieldCheck, ShieldAlert, Lock, KeyRound, Fingerprint,
    // Performance
    Zap, Rocket, Sparkles, Star, Stars,
    // Analytics
    BarChart3, BarChart4, LineChart, PieChart, Activity,
    // Media
    PlayCircle, Video, ImagePlus, Camera, Film,
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
  Heart, Handshake, Award, Trophy, Milestone, Flag,
    // Layout
    LayoutDashboard, LayoutGrid, Layers, Grid2X2, PanelLeft, AppWindow,
    // Sharing
    Link, ExternalLink, QrCode, Share2, Download, Upload, ArrowRight,
    // Design
    Sun, Moon, Palette, Brush, Pen, PenLine,
    // Misc
    AlertCircle, Info, HelpCircle, Lightbulb, Flame,
  };

  let features: any[] = [];
  try {
    const raw = settings?.marketing?.features_content;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.sections?.length) {
        features = parsed.sections.map((s: any) => {
          const theme = getColorTheme(s.color || "blue");
          return {
            id: s.id || "",
            title: s.title || "",
            description: s.description || "",
            icon: iconMap[s.icon] ? iconMap[s.icon] : CheckCircle2,
            color: theme.text,
            bg: theme.bg,
            points: s.points?.length ? s.points : [""],
          };
        });
      }
    }
  } catch {}

  return (
    <>
      <SEOHead
        title="Fitur - TeamVora"
        description="Temukan fitur lengkap TeamVora: manajemen tugas, keuangan, absensi, dan kolaborasi tim dalam satu platform."
        keywords="fitur TeamVora, manajemen tugas, cash book, absensi, kolaborasi tim"
        ogUrl="https://teamvora.coded.my.id/fitur"
      />
      <PageTitle title="Fitur | TeamVora" />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted/20 border-b border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/3" />
        
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeUpVariant} className="flex justify-center mb-6">
              <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                Fitur Unggulan TeamVora
              </span>
            </motion.div>
            <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
              Satu Aplikasi, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Ribuan Solusi
              </span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-xl text-muted-foreground text-balance mx-auto leading-relaxed max-w-2xl">
              Singkirkan puluhan aplikasi terpisah. Temukan bagaimana TeamVora menyatukan semua aspek manajemen operasional tim Anda, menjadikannya satu kesatuan yang efisien dan tak terhentikan.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quick Overview Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Cepat & Ringan", desc: "Performa dioptimalkan" },
              { icon: ShieldCheck, title: "Aman", desc: "Enkripsi end-to-end" },
              { icon: LayoutDashboard, title: "Intuitif", desc: "Tanpa kurva belajar" },
              { icon: Target, title: "Tepat Sasaran", desc: "Dibuat untuk tim modern" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border bg-card flex gap-4 items-center"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Bento Grid */}
      {features.length > 0 && (
        <section className="py-24 bg-muted/10">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-6 gap-6">
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
                      <div className="h-full p-8 rounded-3xl border border-border/50 bg-card hover:border-primary/20 transition-all shadow-sm flex flex-col group">
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border mb-6", feature.bg)}>
                          <feature.icon className={cn("h-7 w-7", feature.color)} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                        <p className="text-muted-foreground text-base leading-relaxed mb-6 flex-grow">{feature.description}</p>
                        <ul className="space-y-3 pt-4 border-t border-border/50">
                          {feature.points.map((point: string, j: number) => (
                            <li key={j} className="flex items-center gap-3 text-sm font-medium">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="border-t border-border/50 bg-background py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
            <h3 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Siap meningkatkan produktivitas?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Bergabunglah dengan ribuan bisnis yang telah merasakan kemudahan menggunakan TeamVora.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 rounded-full text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  Mulai Uji Coba Gratis
                </Button>
              </Link>
              <Link href="/kontak">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base">
                  Hubungi Sales
                </Button>
              </Link>
            </div>
        </div>
      </section>
    </>
  );
}