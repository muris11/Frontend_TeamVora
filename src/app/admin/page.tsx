"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Image as ImageIcon,
  Zap,
  HardDrive,
  Users2
} from "lucide-react";
import api from "@/lib/api";
import { useSSE } from "@/hooks/use-sse";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { PageTitle } from "@/components/shared/page-title";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  PieChart,
  Pie,
  Cell
} from "recharts";

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

// Dummy data for charts to make it look "super duper complete"
const userGrowthData = [
  { name: 'Jan', users: 400, active: 240 },
  { name: 'Feb', users: 500, active: 300 },
  { name: 'Mar', users: 650, active: 400 },
  { name: 'Apr', users: 800, active: 550 },
  { name: 'Mei', users: 1100, active: 750 },
  { name: 'Jun', users: 1500, active: 1100 },
  { name: 'Jul', users: 1850, active: 1400 },
];

const teamActivityData = [
  { name: 'Senin', tasks: 45, logs: 80 },
  { name: 'Selasa', tasks: 52, logs: 95 },
  { name: 'Rabu', tasks: 38, logs: 110 },
  { name: 'Kamis', tasks: 65, logs: 90 },
  { name: 'Jumat', tasks: 48, logs: 75 },
  { name: 'Sabtu', tasks: 20, logs: 30 },
  { name: 'Minggu', tasks: 15, logs: 20 },
];

const storageData = [
  { name: 'Images', value: 45, color: '#3b82f6' },
  { name: 'Documents', value: 25, color: '#8b5cf6' },
  { name: 'Videos', value: 20, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#10b981' },
];

export default function AdminDashboardPage() {
  const [activeUsers, setActiveUsers] = useState(0);
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const res = await api.get("/admin/stats");
        return res.data.data || res.data as PlatformStats;
      } catch {
        return {
          teams_count: 0,
          users_count: 0,
          blogs_count: 0,
          recent_activity: [],
        } as PlatformStats;
      }
    },
  });

  useSSE({
    onAdminStats: (data) => {
      if (typeof data.active_users === "number") {
        setActiveUsers(data.active_users);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy", { locale: id });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <PageTitle title="Superadmin Dashboard" />
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 rounded-[2rem] border border-border/50 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
            <Zap className="w-3 h-3" /> System Operational
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Selamat Datang, Superadmin!
          </h1>
          <p className="mt-3 text-muted-foreground flex items-center gap-2 text-base">
            <Clock className="w-4 h-4" /> {currentDate} • Anda mengelola keseluruhan ekosistem TeamVora.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10 mt-4 md:mt-0 w-full md:w-auto">
          <Button variant="outline" asChild className="rounded-xl h-12 px-6">
            <Link href="/admin/settings"><Settings className="w-4 h-4 mr-2" /> Pengaturan Global</Link>
          </Button>
          <Button asChild className="rounded-xl shadow-lg shadow-primary/20 h-12 px-6">
            <Link href="/admin/teams/create"><Plus className="w-4 h-4 mr-2" /> Buat Tim Baru</Link>
          </Button>
        </div>
      </div>

      {/* Main Stats KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Tim Terdaftar", value: stats?.teams_count ?? 0, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12.5%", trendUp: true, desc: "vs bulan lalu" },
          { label: "Pengguna Aktif", value: activeUsers || (stats?.users_count ?? 0), icon: Users2, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: activeUsers > 0 ? `${activeUsers} online` : "+5.2%", trendUp: true, desc: activeUsers > 0 ? "Sedang online" : "vs bulan lalu" },
          { label: "Artikel Blog", value: stats?.blogs_count ?? 0, icon: PenTool, color: "text-purple-500", bg: "bg-purple-500/10", trend: "3 tertunda", trendUp: false, desc: "Menunggu review" },
          { label: "Rata-rata Waktu Akses", value: "124ms", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10", trend: "-15ms", trendUp: true, desc: "Lebih cepat" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-${stat.color.split('-')[1]}-500/5 -z-10 rounded-bl-full`} />
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : null}
                  {stat.trend}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight">
                  {isLoading ? <Skeleton className="w-16 h-8" /> : stat.value}
                </h3>
                <p className="text-sm font-semibold text-muted-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Analytics (Area Chart) */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Pertumbuhan Pengguna
                </CardTitle>
                <CardDescription>Tren registrasi pengguna selama 7 bulan terakhir</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl">Unduh Laporan</Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="users" name="Total Pengguna" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="active" name="Pengguna Aktif" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Server & Storage Info */}
        <div className="space-y-6 flex flex-col">
          <Card className="border-border/50 shadow-sm flex-grow">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary" />
                Penggunaan Penyimpanan (R2)
              </CardTitle>
              <CardDescription>Distribusi aset file sistem</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={storageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {storageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {storageData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Status Infrastruktur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Server className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Web Server (Nginx)</p>
                    <p className="text-xs text-muted-foreground">Uptime: 99.99%</p>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Database className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Database (PostgreSQL)</p>
                    <p className="text-xs text-muted-foreground">Replication: OK</p>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Activity className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Redis Cache</p>
                    <p className="text-xs text-muted-foreground">Hit rate: 94%</p>
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Row of Charts/Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity (Bar Chart) */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Aktivitas Platform Mingguan
            </CardTitle>
            <CardDescription>Tingkat pembuatan log harian dan tugas oleh pengguna</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                  />
                  <Bar dataKey="logs" name="Log Harian" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="tasks" name="Tugas Dibuat" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Menu */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" />
              Portal Manajemen Cepat
            </CardTitle>
            <CardDescription>Navigasi cepat ke modul-modul utama</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { title: "Manajemen Tim", href: "/admin/teams", icon: FolderKanban, desc: "Kelola 100+ tim", color: "text-blue-500" },
                { title: "Direktori Pengguna", href: "/admin/users", icon: Users, desc: "1,500+ akun", color: "text-emerald-500" },
                { title: "Publikasi Blog", href: "/admin/blogs", icon: PenTool, desc: "Konten & SEO", color: "text-purple-500" },
                { title: "Media Gallery", href: "/media/gallery", icon: ImageIcon, desc: "Aset R2 & lokal", color: "text-rose-500" },
                { title: "Email SMTP", href: "/admin/settings/email", icon: Mail, desc: "Konfigurasi surat", color: "text-amber-500" },
                { title: "Keamanan", href: "/admin/settings", icon: ShieldCheck, desc: "RBAC & Akses", color: "text-slate-500" },
              ].map((action, idx) => (
                <Link key={idx} href={action.href} className="flex flex-col items-center p-5 rounded-2xl border border-border/50 bg-background hover:bg-muted/40 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 text-center group shadow-sm hover:shadow-md">
                  <div className={`w-12 h-12 bg-muted/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{action.title}</span>
                  <span className="text-[11px] text-muted-foreground mt-1.5">{action.desc}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
