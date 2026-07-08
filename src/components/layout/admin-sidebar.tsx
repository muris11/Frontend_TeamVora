"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  PenTool,
  Settings,
  UserCircle,
  ChevronDown,
  Shield,
  Mail,
  ImageIcon,
  FileKey,
  Palette,
  Search,
  Activity,
  BookOpen,
  FileText,
  KeyRound,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface AdminNavSubItem {
  title: string;
  href: string;
}

interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subItems?: AdminNavSubItem[];
}

interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

const navGroups: AdminNavGroup[] = [
  {
    label: "Menu",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Platform",
    items: [
      { title: "Kelola Tim", href: "/admin/teams", icon: FolderKanban },
      { title: "Kelola User", href: "/admin/users", icon: Users },
      { title: "Hak Akses (RBAC)", href: "/admin/rbac", icon: KeyRound },
    ],
  },
  {
    label: "Konten & Media",
    items: [
      { title: "Kelola Blog", href: "/admin/blogs", icon: PenTool },
      { title: "Media Galeri", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "Support",
    items: [{ title: "Ticketing", href: "/admin/tickets", icon: BookOpen }],
  },
  {
    label: "Dokumentasi",
    items: [{ title: "Dokumentasi Project", href: "/admin/project-docs", icon: FileText }],
  },
  {
    label: "Pengaturan",
    items: [
      { title: "General", href: "/admin/settings", icon: Settings },
      {
        title: "Marketing",
        href: "/admin/settings/marketing",
        icon: Palette,
        subItems: [
          { title: "Landing", href: "/admin/settings/marketing/landing" },
          { title: "Tentang", href: "/admin/settings/marketing/tentang" },
          { title: "Fitur", href: "/admin/settings/marketing/fitur" },
          { title: "Panduan", href: "/admin/settings/marketing/panduan" },
          { title: "Bantuan", href: "/admin/settings/marketing/bantuan" },
          { title: "Privasi", href: "/admin/settings/marketing/privasi" },
          { title: "Syarat", href: "/admin/settings/marketing/syarat" },
        ],
      },
      { title: "Email", href: "/admin/email", icon: Mail },
      { title: "SEO", href: "/admin/settings/seo", icon: Search },
      { title: "Status Sistem", href: "/admin/settings/status", icon: Activity },
      { title: "Konfigurasi .env", href: "/admin/env-config", icon: FileKey },
      { title: "Profil", href: "/admin/profile", icon: UserCircle },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
          <Image src={logoUrl} alt={siteName} width={48} height={48} className="w-12 h-12 object-contain mb-2" />
          <span className="font-bold text-lg tracking-tight mb-1">{siteName}</span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Super Admin</p>
        </div>
        <div className="mx-3 mb-2">
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-amber-600" />
              <p className="text-[10px] font-medium text-amber-600">Akses penuh ke seluruh platform</p>
            </div>
            <p className="text-[9px] text-muted-foreground">Akses penuh ke seluruh platform</p>
          </div>
        </div>
        <div className="mx-3 h-px bg-border/50" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        {navGroups.map((group) => (
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
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname === item.href || pathname.startsWith(item.href + "/");
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
                              <div className="absolute left-0 top-1/2 h-4 w-0.75 -translate-y-1/2 rounded-r-full bg-primary" />
                            )}
                          </SidebarMenuButton>
                          {item.subItems && pathname.startsWith(item.href) && (
                            <SidebarMenuSub>
                              {item.subItems.map((sub: AdminNavSubItem) => {
                                const isSubActive = pathname === sub.href;
                                return (
                                  <SidebarMenuSubItem key={sub.href}>
                                    <SidebarMenuSubButton
                                      isActive={isSubActive}
                                      render={<Link href={sub.href} />}
                                      className={isSubActive ? "font-medium text-primary" : "text-muted-foreground"}
                                    >
                                      {sub.title}
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          )}
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
          <span className="group-data-[collapsible=icon]:hidden">Docs Pengguna</span>
        </a>
        <p className="text-[10px] text-muted-foreground/40 mt-1 px-2 group-data-[collapsible=icon]:hidden">
          {siteName} SaaS v1.0 — Admin
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
