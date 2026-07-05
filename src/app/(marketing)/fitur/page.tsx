"use client";

import { motion } from "framer-motion";
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


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function FiturPage() {
  const { data: settings } = usePlatformSettings();

  const defaultFeatures: any[] = [];

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

  let features = defaultFeatures;
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
            icon: iconMap[s.icon] ? (() => { const Icon = iconMap[s.icon]; return <Icon className="w-8 h-8 text-primary" />; })() : <CheckCircle2 className="w-8 h-8 text-primary" />,
            colorClass: `${theme.bg} ${theme.text}`,
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
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
            <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Satu Aplikasi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Ribuan Solusi</span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-xl text-muted-foreground text-balance mx-auto">
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

      {/* Main Features Detail */}
      {features.length > 0 && (
        <section className="py-24 bg-muted/10">
          <div className="container mx-auto px-6">
            <div className="space-y-32 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                  key={feature.id} 
                  id={feature.id}
                  className={`flex flex-col lg:flex-row gap-12 lg:gap-24 items-center ${
                    index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 space-y-6">
                    <motion.div variants={fadeUpVariant} className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.colorClass}`}>
                      {feature.icon}
                    </motion.div>
                    <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-bold">{feature.title}</motion.h2>
                    <motion.p variants={fadeUpVariant} className="text-lg text-muted-foreground leading-relaxed">{feature.description}</motion.p>
                    
                    <motion.ul variants={fadeUpVariant} className="space-y-4 pt-4">
                      {feature.points.map((point: string, i: number) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground/90">{point}</span>
                        </li>
                      ))}
                    </motion.ul>
                  </div>
                  
                  <motion.div variants={fadeUpVariant} className="flex-1 w-full">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-border/50 glass shadow-2xl bg-background group">
                      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                      <div className="absolute inset-4 rounded-xl bg-background border border-border shadow-sm flex flex-col overflow-hidden">
                        <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-muted/30">
                           <div className="w-3 h-3 rounded-full bg-destructive/80" />
                           <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                           <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-4">
                           <div className="h-6 w-1/3 bg-muted rounded-md" />
                           <div className="flex gap-4">
                              <div className="h-24 flex-1 bg-primary/5 rounded-lg border border-primary/10" />
                              <div className="h-24 flex-1 bg-primary/5 rounded-lg border border-primary/10" />
                              <div className="h-24 flex-1 bg-primary/5 rounded-lg border border-primary/10" />
                           </div>
                           <div className="h-full bg-muted/30 rounded-lg mt-2" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}
      
      {/* CTA Line */}
      <section className="border-t border-border/50 bg-background py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight">Tingkatkan Performa Tim Anda Hari Ini</h3>
            <p className="text-xl text-muted-foreground">Bergabunglah dengan ribuan bisnis yang telah merasakan kemudahan menggunakan TeamVora.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 rounded-full text-base shadow-lg shadow-primary/20">
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
        </div>
      </section>
    </>
  );
}
