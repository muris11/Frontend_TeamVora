"use client";

import Link from "next/link";
import { PageTitle } from "@/components/shared/page-title";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, FileText, LayoutList, Mail, RefreshCcw, Puzzle, LifeBuoy, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { useMarketingStore } from "@/stores/marketing-store";

export default function MarketingSettingsHub() {
  const { getPage } = useMarketingStore();

  const pages = [
    { id: "landing", name: "Landing Page", desc: "Halaman beranda utama", icon: LayoutTemplate, path: "/admin/settings/marketing/landing" },
    { id: "tentang", name: "Tentang", desc: "Halaman tentang perusahaan", icon: FileText, path: "/admin/settings/marketing/tentang" },
    { id: "fitur", name: "Fitur", desc: "Daftar fitur platform", icon: LayoutList, path: "/admin/settings/marketing/fitur" },
    { id: "kontak", name: "Kontak", desc: "Informasi kontak", icon: Mail, path: "/admin/settings/marketing/kontak" },
    { id: "changelog", name: "Changelog", desc: "Pembaruan platform", icon: RefreshCcw, path: "/admin/settings/marketing/changelog" },
    { id: "integrasi", name: "Integrasi", desc: "Layanan pihak ketiga", icon: Puzzle, path: "/admin/settings/marketing/integrasi" },
    { id: "bantuan", name: "Bantuan", desc: "Pusat bantuan", icon: LifeBuoy, path: "/admin/settings/marketing/bantuan" },
    { id: "privasi", name: "Privasi", desc: "Kebijakan privasi", icon: ShieldCheck, path: "/admin/settings/marketing/privasi" },
    { id: "syarat", name: "Syarat", desc: "Syarat & ketentuan", icon: CheckCircle2, path: "/admin/settings/marketing/syarat" },
    { id: "keamanan", name: "Keamanan", desc: "Informasi keamanan", icon: Lock, path: "/admin/settings/marketing/keamanan" }
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Pengaturan Halaman Marketing | TeamVora Admin" />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Halaman Marketing (CMS)</h1>
        <p className="text-muted-foreground mt-2">
          Kelola konten halaman depan publik (Frontend-only).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {pages.map((p) => {
          const pageData = getPage(p.id);
          const Icon = p.icon;
          return (
            <Card key={p.id} className="border-border/50 shadow-sm flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {pageData.enabled ? (
                    <span className="text-[10px] font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">Aktif</span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full uppercase">Nonaktif</span>
                  )}
                </div>
                <CardTitle className="mt-4 text-lg">{p.name}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4">
                <Link href={p.path} className="w-full block">
                  <Button variant="outline" className="w-full">
                    Edit Konten
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
