"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Image as ImageIcon, Search } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { PageTitle } from "@/components/shared/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaPicker } from "@/components/shared/media-picker";

interface PlatformSettings {
  general: {
    site_name: string;
    tagline: string;
    favicon_url: string;
    logo_url: string;
  };
  seo: {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    og_image_url: string;
  };
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  const [settingsForm, setSettingsForm] = useState({
    site_name: "",
    tagline: "",
    favicon_url: "",
    logo_url: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    og_image_url: "",
  });

  const [activePicker, setActivePicker] = useState<"favicon" | "logo" | "og_image" | null>(null);

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as PlatformSettings;
    },
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        site_name: settings.general?.site_name ?? "",
        tagline: settings.general?.tagline ?? "",
        favicon_url: settings.general?.favicon_url ?? "",
        logo_url: settings.general?.logo_url ?? "",
        seo_title: settings.seo?.seo_title ?? "",
        seo_description: settings.seo?.seo_description ?? "",
        seo_keywords: settings.seo?.seo_keywords ?? "",
        og_image_url: settings.seo?.og_image_url ?? "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan"),
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <PageTitle title="Pengaturan Umum | TeamVora Admin" />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Umum</h1>
        <p className="text-muted-foreground mt-2">
          Kelola informasi platform, branding, logo, dan pengaturan SEO secara lengkap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Identitas Platform
            </CardTitle>
            <CardDescription>
              Nama, tagline, dan logo visual platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settingsLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="site_name">Nama Situs</Label>
                  <Input
                    id="site_name"
                    value={settingsForm.site_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                    placeholder="TeamVora"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    placeholder="Platform Manajemen Tim Terbaik"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-3">
                    {settingsForm.favicon_url ? (
                      <img src={settingsForm.favicon_url} alt="Favicon" className="w-10 h-10 rounded border object-contain bg-muted" />
                    ) : (
                      <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <Input
                      value={settingsForm.favicon_url}
                      onChange={(e) => setSettingsForm({ ...settingsForm, favicon_url: e.target.value })}
                      placeholder="URL Favicon"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => setActivePicker("favicon")}>
                      Pilih Media
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Logo Platform</Label>
                  <div className="flex items-center gap-3">
                    {settingsForm.logo_url ? (
                      <img src={settingsForm.logo_url} alt="Logo" className="w-12 h-12 rounded border object-contain bg-muted" />
                    ) : (
                      <div className="w-12 h-12 rounded border bg-muted flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <Input
                      value={settingsForm.logo_url}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logo_url: e.target.value })}
                      placeholder="URL Logo"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => setActivePicker("logo")}>
                      Pilih Media
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-500" />
              Pengaturan SEO
            </CardTitle>
            <CardDescription>
              Optimasi mesin pencari dan metadata sosial (Open Graph).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settingsLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="seo_title">SEO Title (Default)</Label>
                  <Input
                    id="seo_title"
                    value={settingsForm.seo_title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seo_title: e.target.value })}
                    placeholder="TeamVora - Kolaborasi Tanpa Batas"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={settingsForm.seo_description}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seo_description: e.target.value })}
                    placeholder="Deskripsi singkat yang akan muncul di hasil pencarian..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seo_keywords">SEO Keywords (pisahkan dengan koma)</Label>
                  <Input
                    id="seo_keywords"
                    value={settingsForm.seo_keywords}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seo_keywords: e.target.value })}
                    placeholder="team, manajemen, kolaborasi, produktivitas"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Open Graph Image (OG Image)</Label>
                  <div className="flex items-center gap-3">
                    {settingsForm.og_image_url ? (
                      <img src={settingsForm.og_image_url} alt="OG Image" className="w-16 h-10 rounded border object-cover bg-muted" />
                    ) : (
                      <div className="w-16 h-10 rounded border bg-muted flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <Input
                      value={settingsForm.og_image_url}
                      onChange={(e) => setSettingsForm({ ...settingsForm, og_image_url: e.target.value })}
                      placeholder="URL Gambar OG"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => setActivePicker("og_image")}>
                      Pilih Media
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Gambar yang muncul ketika link website dibagikan di sosial media (Rekomendasi: 1200x630px).</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={() => updateMutation.mutate(settingsForm)}
          disabled={updateMutation.isPending || settingsLoading}
          size="lg"
          className="rounded-xl px-8 shadow-md"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Menyimpan..." : "Simpan Semua Pengaturan"}
        </Button>
      </div>

      <MediaPicker
        open={activePicker !== null}
        onOpenChange={(open) => !open && setActivePicker(null)}
        onSelect={(url) => {
          if (activePicker === "favicon") setSettingsForm({ ...settingsForm, favicon_url: url });
          if (activePicker === "logo") setSettingsForm({ ...settingsForm, logo_url: url });
          if (activePicker === "og_image") setSettingsForm({ ...settingsForm, og_image_url: url });
        }}
        type="gallery"
      />
    </div>
  );
}
