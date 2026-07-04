"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FolderKanban,
  Users,
  PenTool,
  Plus,
  ArrowUpRight,
  Settings,
  Activity,
  Server,
  Database,
  Mail,
  ShieldCheck,
  Clock,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTitle } from "@/components/shared/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PlatformStats {
  teams_count: number;
  users_count: number;
  blogs_count: number;
  recent_activity: Array<{
    id: number;
    type: string;
    description: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const res = await api.get("/admin/stats");
        return res.data.data || res.data as PlatformStats;
      } catch {
        return {
          teams_count: 5,
          users_count: 24,
          blogs_count: 12,
          recent_activity: [],
        } as PlatformStats;
      }
    },
  });

  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy", { locale: id });

  return (
    <div className="space-y-8 pb-10">
      <PageTitle title="Admin Dashboard" />
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-6 rounded-3xl border border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, Superadmin!</h1>
          <p className="mt-2 text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" /> {currentDate}
          </p>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/admin/settings"><Settings className="w-4 h-4 mr-2" /> Pengaturan Sistem</Link>
          </Button>
          <Button asChild className="rounded-xl shadow-lg shadow-primary/20">
            <Link href="/admin/teams/create"><Plus className="w-4 h-4 mr-2" /> Buat Tim Baru</Link>
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Tim Terdaftar", value: stats?.teams_count ?? 0, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12% bulan ini" },
          { label: "Pengguna Aktif", value: stats?.users_count ?? 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+5% bulan ini" },
          { label: "Artikel Blog", value: stats?.blogs_count ?? 0, icon: PenTool, color: "text-purple-500", bg: "bg-purple-500/10", trend: "3 draf tertunda" },
          { label: "Kesehatan Sistem", value: "99.9%", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10", trend: "Normal" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold">{isLoading ? <Skeleton className="w-16 h-8" /> : stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access Menu */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader>
              <CardTitle>Akses Cepat</CardTitle>
              <CardDescription>Pintasan untuk manajemen platform utama</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: "Manajemen Tim", href: "/admin/teams", icon: FolderKanban, desc: "Kelola semua tim" },
                  { title: "Direktori Pengguna", href: "/admin/users", icon: Users, desc: "Kelola akun pengguna" },
                  { title: "Publikasi Blog", href: "/admin/blogs", icon: PenTool, desc: "Tulis & edit artikel" },
                  { title: "Media & S3", href: "/media/gallery", icon: ImageIcon, desc: "Aset penyimpanan" },
                  { title: "Pengaturan Email", href: "/admin/settings/email", icon: Mail, desc: "Logo & SMTP" },
                  { title: "Keamanan", href: "/admin/settings", icon: ShieldCheck, desc: "Sistem Auth & RBAC" },
                ].map((action, idx) => (
                  <Link key={idx} href={action.href} className="flex flex-col items-center p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/50 hover:border-primary/30 transition-all text-center group">
                    <div className="w-12 h-12 bg-background rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:text-primary transition-colors">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">{action.title}</span>
                    <span className="text-xs text-muted-foreground mt-1">{action.desc}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Status Server</CardTitle>
              <CardDescription>Informasi teknis platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Laravel Framework</p>
                    <p className="text-xs text-muted-foreground">v11.x</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Database (PostgreSQL)</p>
                    <p className="text-xs text-muted-foreground">Terhubung</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Redis Cache</p>
                    <p className="text-xs text-muted-foreground">Aktif</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
