"use client";

import { motion } from "framer-motion";
import { Users, Globe2, Trophy, Target, ArrowRight, Zap, Shield, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { SEOHead } from "@/components/shared/seo-head";
import { iconMap } from "@/components/ui/icon-picker";

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

export default function TentangPage() {
  const { data: settings } = usePlatformSettings();
  const siteName = settings?.general?.site_name || "TeamVora";




  const defaultStats: any[] = [];
  const defaultValues: any[] = [];
  const defaultTeam: any[] = [];

  let aboutContent: { stats: any[]; values: any[]; team: any[] } = { stats: defaultStats, values: defaultValues, team: defaultTeam };
  try {
    const raw = settings?.marketing?.about_content;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.stats?.length || parsed?.values?.length || parsed?.team?.length) {
        aboutContent = {
          stats: parsed.stats?.length ? parsed.stats : defaultStats,
          values: parsed.values?.length ? parsed.values : defaultValues,
          team: parsed.team?.length ? parsed.team : defaultTeam,
        };
      }
    }
  } catch {}

  const stats = aboutContent.stats.map((s) => ({ ...s, icon: iconMap[s.icon] || Users }));
  const values = aboutContent.values.map((v) => ({ ...v, icon: iconMap[v.icon] || Target }));
  const team = aboutContent.team;

  return (
    <>
      <SEOHead
        title={`Tentang Kami | ${siteName}`}
        description="Kenali tim di balik TeamVora dan misi kami membantu bisnis Indonesia mengelola operasional tim secara efisien."
        keywords="tentang TeamVora, tim, visi misi, perusahaan, manajemen tim"
        ogUrl="https://teamvora.coded.my.id/tentang"
      />
      <PageTitle title={`Tentang Kami | ${siteName}`} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Membangun Masa Depan <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Kolaborasi Kerja
              </span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-xl text-muted-foreground text-balance mx-auto">
              {siteName} didirikan dengan satu misi sederhana: menghapus kekacauan dari manajemen operasional perusahaan, sehingga Anda bisa fokus pada hal yang benar-benar penting.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {stats.length > 0 && (
        <section className="py-16 border-y border-border/50 bg-muted/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="text-center space-y-3"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">{stat.value}</h3>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      {values.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nilai Inti Kami</h2>
              <p className="text-lg text-muted-foreground">Prinsip yang membimbing setiap baris kode yang kami tulis.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-3xl border bg-card hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {team.length > 0 && (
        <section className="py-24 bg-muted/20 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Bertemu dengan Tim</h2>
                <p className="text-lg text-muted-foreground">Orang-orang berdedikasi di balik platform {siteName}.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-6 text-center rounded-2xl bg-card border hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform text-secondary-foreground">
                    {member.initials}
                  </div>
                  <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Line */}
      <section className="border-t border-border/50 bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Jadilah Bagian dari Perjalanan Kami</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Gunakan {siteName} untuk mengelola bisnis Anda dan rasakan perbedaannya.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full text-base font-bold shadow-xl">
              Mulai Gratis Sekarang <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
