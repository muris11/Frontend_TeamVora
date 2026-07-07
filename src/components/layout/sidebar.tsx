"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Repeat,
  CheckSquare,
  BookOpen,
  FileText,
  Image,
  UserCircle,
  Users,
  ChevronDown,
  PenTool,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

function hasPermission(userPermissions: string[] | undefined, required: string[]): boolean {
  if (!userPermissions) return false;
  return required.some((p) => userPermissions.includes(p));
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const userPerms = user?.permissions || [];
  const isSuperAdmin = user?.role === "super_admin";
  const isTeamLeader = user?.role === "team_leader";
  const basePath = isTeamLeader ? "/lead" : "/member";

  const navGroups = [
    {
      label: "Menu",
      items: [
        { title: "Dashboard", href: `${basePath}/dashboard`, icon: LayoutDashboard, permissions: ["view_dashboard"] },
      ],
    },
    {
      label: "Finance",
      items: [
        { title: "Kas", href: `${basePath}/finance/cash-book`, icon: Wallet, permissions: ["view_cash_book"] },
        { title: "Tagihan", href: `${basePath}/finance/bills`, icon: Receipt, permissions: ["view_split_bill"] },
        { title: "Tagihan Berulang", href: `${basePath}/finance/recurring-bills`, icon: Repeat, permissions: ["view_recurring_bill"] },
      ],
    },
    {
      label: "Produktivitas",
      items: [
        { title: "Tugas", href: `${basePath}/productivity/tasks`, icon: CheckSquare, permissions: ["view_tasks"] },
        { title: "Log Harian", href: `${basePath}/productivity/daily-log`, icon: BookOpen, permissions: ["view_daily_log"] },
      ],
    },
    {
      label: "Media",
      items: [
        { title: "Media Storage", href: `${basePath}/media`, icon: Image, permissions: ["view_media"] },
      ],
    },
    ...((isTeamLeader) ? [{
      label: "Konten",
      items: [
        { title: "Blog", href: `${basePath}/blogs/manage`, icon: PenTool, permissions: [] },
      ],
    }] : []),
    {
      label: "Pengaturan",
      items: [
        { title: "Profil", href: `${basePath}/settings/profile`, icon: UserCircle, permissions: [] },
        ...(isTeamLeader ? [
          { title: "Profil Tim", href: `${basePath}/settings/team-profile`, icon: ShieldCheck, permissions: [] },
          { title: "Anggota Tim", href: `${basePath}/settings/team-members`, icon: Users, permissions: ["manage_teams"] },
        ] : []),
      ],
    },
    ...(isTeamLeader ? [{
      label: "Support",
      items: [
        { title: "Ticketing", href: `${basePath}/tickets`, icon: FileText, permissions: [] },
      ],
    }] : []),
  ];

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.permissions.length === 0 || hasPermission(userPerms, item.permissions)
      ),
    }))
    .filter((group) => group.items.length > 0);

  const roleLabel = isSuperAdmin ? "Super Admin" : isTeamLeader ? "Team Leader" : "Member";

  const { data: platformSettings } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/platform-settings");
      return res.data.data || {};
    },
    staleTime: 1000 * 60 * 5,
  });

  const siteName = platformSettings?.general?.site_name || "TeamVora";
  const logoUrl = platformSettings?.general?.logo_url || "/icon.png";

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="pb-0">
        <div className="flex flex-col items-center px-3 pt-4 pb-2">
          {/* Logo & Site Name handled by layout but if we want to show here */}
          <img src={logoUrl} alt={siteName} className="w-12 h-12 object-contain mb-2" />
          <span className="font-bold text-lg tracking-tight mb-1">{siteName}</span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{roleLabel}</p>
        </div>
        {/* Team Badge */}
        {user?.team && (
          <div className="mx-3 mb-2">
            <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <p className="text-[10px] font-medium text-primary truncate">{user.team.name}</p>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5 truncate">
                {isTeamLeader ? "Akses manajemen tim" : "Akses anggota tim"}
              </p>
            </div>
          </div>
        )}
        <div className="mx-3 h-px bg-border/50" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        {visibleGroups.map((group) => (
          <Collapsible key={group.label} defaultOpen className="group/collapsible">
            <SidebarGroup className="px-0">
              <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  {group.label}
                  <ChevronDown className="h-3 w-3 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            render={<Link href={item.href} />}
                            isActive={isActive}
                            tooltip={item.title}
                            className={`relative h-9 rounded-lg text-[13px] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                              isActive
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                          >
                            <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                            <span>{item.title}</span>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-3 pb-3">
        <div className="h-px bg-border/50 mb-2" />
        <a 
          href="https://docs.teamvora.web.id" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group-data-[collapsible=icon]:justify-center"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span className="group-data-[collapsible=icon]:hidden">Dokumentasi</span>
        </a>
        <p className="text-[10px] text-muted-foreground/40 mt-1 px-2 group-data-[collapsible=icon]:hidden">
          {siteName} SaaS v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
