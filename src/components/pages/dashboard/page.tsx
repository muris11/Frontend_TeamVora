"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingDown, CheckCircle2, Clock, AlertCircle, FileText, Image as ImageIcon, Send, Activity, Users, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { DashboardStats } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import Link from "next/link";
import { PageTitle } from "@/components/shared/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function ListCard({
  title,
  href,
  children,
  className,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border-border/50 shadow-sm h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Link href={href} className="text-xs font-medium text-primary hover:underline underline-offset-4">
          Lihat semua
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-4">{children}</CardContent>
    </Card>
  );
}

export function DashboardPage({ basePath }: { basePath: string }) {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data.data || res.data;
    },
  });

  const stats = data as DashboardStats | undefined;
  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy", { locale: id });

  const TASK_COLORS = ['#cbd5e1', '#3b82f6', '#f59e0b', '#10b981']; // slate-300, blue-500, amber-500, emerald-500

  return (
    <div className="space-y-8 pb-10">
      <PageTitle title="Dashboard" />
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-6 rounded-3xl border border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">Halo, Selamat Datang!</h1>
          <p className="mt-2 text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" /> {currentDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10">
          <Button variant="outline" asChild className="rounded-xl">
            <Link href={`${basePath}/productivity/daily-log`}><Clock className="w-4 h-4 mr-2" /> Daily Log</Link>
          </Button>
          <Button asChild className="rounded-xl shadow-lg shadow-primary/20">
            <Link href={`${basePath}/finance/cash-book`}><Wallet className="w-4 h-4 mr-2" /> Kas Baru</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border/50"><CardContent className="p-6"><Skeleton className="h-10 w-10 rounded-xl" /><Skeleton className="mt-4 h-7 w-28" /><Skeleton className="mt-2 h-3 w-20" /></CardContent></Card>
          ))
        ) : (
          <>
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Wallet className="w-6 h-6" /></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{formatCurrency(stats?.finance?.balance ?? 0)}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Saldo Kas Tim</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform"><ArrowUpRight className="w-6 h-6" /></div>
                  <div className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/>In</div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{formatCurrency(stats?.finance?.total_in ?? 0)}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Total Pemasukan</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 group-hover:scale-110 transition-transform"><ArrowDownRight className="w-6 h-6" /></div>
                  <div className="bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center"><ArrowDownRight className="w-3 h-3 mr-1"/>Out</div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{formatCurrency(stats?.finance?.total_out ?? 0)}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Total Pengeluaran</p>
                </div>
              </CardContent>
            </Card>

            {user?.role === "team_leader" && stats?.team_members_count !== undefined && (
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-all group bg-primary text-primary-foreground border-transparent">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-white/20 group-hover:scale-110 transition-transform"><Users className="w-6 h-6 text-white" /></div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold">{stats.team_members_count} Anggota</h3>
                    <p className="text-sm font-medium text-primary-foreground/80 mt-1">Dalam Tim</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all group bg-primary text-primary-foreground border-transparent">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-white/20 group-hover:scale-110 transition-transform"><Activity className="w-6 h-6 text-white" /></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold">{stats?.active_tasks?.length ?? 0} Tugas</h3>
                  <p className="text-sm font-medium text-primary-foreground/80 mt-1">Sedang Aktif</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Tren Arus Kas
              </CardTitle>
              <CardDescription>Pemasukan vs Pengeluaran (6 Bulan Terakhir)</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-full h-[300px] rounded-xl" />
            ) : stats?.chart_data?.cash_flow && stats.chart_data.cash_flow.length > 0 ? (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chart_data.cash_flow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `Rp${val / 1000}k`} />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Area type="monotone" name="Pemasukan" dataKey="in" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                    <Area type="monotone" name="Pengeluaran" dataKey="out" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50">
                Belum ada data keuangan
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-primary" /> Distribusi Tugas
              </CardTitle>
              <CardDescription>Berdasarkan Status</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {isLoading ? (
              <Skeleton className="w-full h-[300px] rounded-xl" />
            ) : stats?.chart_data?.task_distribution && stats.chart_data.task_distribution.some(d => d.value > 0) ? (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.chart_data.task_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.chart_data.task_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50 mt-4">
                Belum ada tugas
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className="mb-4 text-sm font-bold tracking-tight">Akses Menu Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { title: "Split Bill", href: `${basePath}/finance/bills`, icon: AlertCircle, show: true },
            { title: "Kas Masuk/Keluar", href: `${basePath}/finance/cash-book`, icon: Wallet, show: true },
            { title: "Manajemen Tugas", href: `${basePath}/productivity/tasks`, icon: CheckCircle2, show: true },
            { title: "Log Harian", href: `${basePath}/productivity/daily-log`, icon: Clock, show: true },
            { title: "Media Tim", href: `${basePath}/media`, icon: ImageIcon, show: true },
            { title: "Pengaturan Tim", href: `${basePath}/settings/team-members`, icon: Send, show: user?.role === "team_leader" },
          ].filter(action => action.show).map((action, idx) => (
            <Link key={idx} href={action.href} className="flex flex-col items-center p-4 rounded-2xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all text-center group">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center mb-3 group-hover:text-primary transition-colors group-hover:bg-primary/10">
                <action.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ListCard title="Tagihan Belum Dibayar" href={`${basePath}/finance/bills`}>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
            </div>
          ) : stats?.unpaid_bills?.length ? (
            <div className="space-y-2">
              {stats.unpaid_bills.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{item.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.amount)}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
              <CheckCircle2 className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">Semua tagihan lunas!</p>
            </div>
          )}
        </ListCard>

        <ListCard title="Tugas Aktif (Prioritas)" href={`${basePath}/productivity/tasks`}>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
            </div>
          ) : stats?.active_tasks?.length ? (
            <div className="space-y-2">
              {stats.active_tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.assignee?.name} &middot; {formatDate(task.due_date)}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
              <CheckCircle2 className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">Tidak ada tugas aktif</p>
            </div>
          )}
        </ListCard>
      </div>
      
      {/* Lead specific lists */}
      {user?.role === "team_leader" && (
        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          <ListCard title="Log Harian Terbaru" href={`${basePath}/productivity/daily-log`}>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
              </div>
            ) : stats?.recent_logs?.length ? (
              <div className="space-y-2">
                {stats.recent_logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{log.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.log_date || log.created_at)}</p>
                    </div>
                    <StatusBadge status="completed" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
                <FileText className="mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">Belum ada log harian</p>
              </div>
            )}
          </ListCard>

          <ListCard title="Tagihan Mendatang (Berulang)" href={`${basePath}/finance/recurring-bills`}>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
              </div>
            ) : stats?.upcoming_recurring_bills?.length ? (
              <div className="space-y-2">
                {stats.upcoming_recurring_bills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{bill.title}</p>
                      <p className="text-xs text-muted-foreground">Tiba: {formatDate(bill.next_date)}</p>
                    </div>
                    <div className="font-semibold text-sm">
                      {formatCurrency(bill.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
                <CheckCircle2 className="mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">Tidak ada tagihan mendatang</p>
              </div>
            )}
          </ListCard>
        </div>
      )}
    </div>
  );
}
