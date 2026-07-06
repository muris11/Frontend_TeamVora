"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, ChevronRight, ArrowLeft, Shield, Bell, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSSE } from "@/hooks/use-sse";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import api from "@/lib/api";
import { Notification } from "@/types";
import { formatDate } from "@/lib/format";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  finance: "Finance",
  "cash-book": "Kas",
  bills: "Tagihan",
  "recurring-bills": "Tagihan Berulang",
  productivity: "Produktivitas",
  tasks: "Tugas",
  "daily-log": "Log Harian",
  media: "Media",
  documents: "Dokumen",
  gallery: "Galeri",
  settings: "Pengaturan",
  profile: "Profil",
  members: "Anggota",
  "team-members": "Anggota Tim",
  admin: "Admin",
  member: "Member",
  lead: "Leader",
  teams: "Kelola Tim",
  blogs: "Blog",
  manage: "Kelola",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [];
  let href = "";
  for (const seg of segments) {
    href += `/${seg}`;
    crumbs.push({
      label: routeLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
      href,
    });
  }
  return crumbs;
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, impersonator, originalToken, setAuth, setImpersonator, setOriginalToken, logout, token } = useAuthStore();
  const [stopping, setStopping] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  // SSE real-time notifications
  useSSE({
    onNotification: (data) => {
      toast.info(data.title || "Notifikasi Baru", {
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onTeamUpdated: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await api.get("/notifications");
        return (res.data.data || res.data) as Notification[];
      } catch {
        return [] as Notification[];
      }
    },
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Semua notifikasi ditandai sudah dibaca");
    },
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleStopImpersonation = async () => {
    setStopping(true);
    try {
      const res = await api.post("/stop-impersonation");
      const { user: adminUser, token: adminToken } = res.data;

      // Clear impersonation state
      localStorage.removeItem("originalToken");
      setAuth(adminUser, adminToken);
      setImpersonator(null);
      setOriginalToken(null);

      toast.success("Kembali ke akun asli");
      router.push("/admin");
    } catch {
      toast.error("Gagal kembali ke akun asli");
    } finally {
      setStopping(false);
    }
  };

  return (
    <>
      {/* Impersonation Banner */}
      {impersonator && (
        <div className="flex items-center justify-between bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 dark:text-amber-400">
              Sedang masuk sebagai <strong>{user?.name}</strong>
            </span>
            <span className="text-muted-foreground">
              (dari {impersonator.name})
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-amber-500/30 text-amber-700 hover:bg-amber-500/10"
            onClick={handleStopImpersonation}
            disabled={stopping}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            {stopping ? "Kembali..." : "Kembali ke Akun Asli"}
          </Button>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/50 bg-background/80 px-4 glass">
        <SidebarTrigger className="-ml-1 h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <a href={crumb.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {crumb.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Notifications */}
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-primary/20 hover:bg-muted/50">
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl border-border/50 p-1.5">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm font-semibold">Notifikasi</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllReadMutation.mutate()}
                    className="text-xs text-primary hover:underline"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Tidak ada notifikasi
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 10).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start gap-1 rounded-lg px-2 py-2 ${
                        !notification.read_at ? "bg-primary/5" : ""
                      }`}
                      onClick={() => {
                        if (!notification.read_at) {
                          markReadMutation.mutate(notification.id);
                        }
                      }}
                    >
                      <div className="flex w-full items-start justify-between">
                        <span className="text-sm font-medium leading-tight">{(notification.data as Record<string, unknown>)?.title as string ?? "Notifikasi"}</span>
                        {!notification.read_at && (
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{(notification.data as Record<string, unknown>)?.message as string ?? ""}</p>
                      <span className="text-[10px] text-muted-foreground/60">
                        {formatDate(notification.created_at)}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 py-1.5 pl-1.5 pr-3 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-primary/20 hover:bg-muted/50">
              <Avatar className="h-7 w-7 rounded-lg">
                <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-medium text-primary">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">
                {user?.name || "User"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 p-1.5">
              <DropdownMenuItem
                onClick={() => router.push("/settings/profile")}
                className="rounded-lg text-sm"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("https://docs.teamvora.web.id", "_blank")}
                className="rounded-lg text-sm"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Bantuan & Dokumentasi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-sm text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
