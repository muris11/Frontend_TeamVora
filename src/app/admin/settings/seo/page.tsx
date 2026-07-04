"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "@/components/shared/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Globe, Link as LinkIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface SeoSettings {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string;
  canonical_url: string;
}

interface PlatformSettings {
  general?: { site_name?: string };
  seo?: {
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
  };
}

export default function SeoSettingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SeoSettings>({
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    og_image_url: "",
    canonical_url: "",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as PlatformSettings;
    },
  });

  useEffect(() => {
    if (settings?.seo) {
      setForm({
        seo_title: settings.seo.seo_title ?? "",
        seo_description: settings.seo.seo_description ?? "",
        seo_keywords: settings.seo.seo_keywords ?? "",
        og_image_url: (settings.seo as any).og_image_url ?? "",
        canonical_url: (settings.seo as any).canonical_url ?? "",
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan SEO berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan SEO"),
  });

  const handleSave = () => {
    saveMutation.mutate(form as unknown as Record<string, string>);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Pengaturan SEO | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan SEO</h1>
          <p className="text-muted-foreground">
            Optimasi tampilan di mesin pencari dan media sosial.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="rounded-xl"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Meta Tags
              </CardTitle>
              <CardDescription>
                Kontrol judul dan deskripsi yang muncul di hasil pencarian.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seo_title">Judul SEO</Label>
                <Input
                  id="seo_title"
                  value={form.seo_title}
                  onChange={(e) =>
                    setForm({ ...form, seo_title: e.target.value })
                  }
                  placeholder="TeamVora - Platform Manajemen Tim"
                />
                <p className="text-xs text-muted-foreground">
                  {form.seo_title.length}/60 karakter. Idealnya 50-60 karakter.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seo_description">Deskripsi SEO</Label>
                <Textarea
                  id="seo_description"
                  value={form.seo_description}
                  onChange={(e) =>
                    setForm({ ...form, seo_description: e.target.value })
                  }
                  placeholder="Deskripsi singkat tentang platform untuk ditampilkan di mesin pencari..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {form.seo_description.length}/160 karakter. Idealnya 150-160
                  karakter.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seo_keywords">Kata Kunci</Label>
                <Textarea
                  id="seo_keywords"
                  value={form.seo_keywords}
                  onChange={(e) =>
                    setForm({ ...form, seo_keywords: e.target.value })
                  }
                  placeholder="manajemen tim, kolaborasi, produktivitas, project management"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Pisahkan dengan koma.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Open Graph
              </CardTitle>
              <CardDescription>
                Gambar dan info yang ditampilkan saat link dibagikan di media
                sosial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  value={form.og_image_url}
                  onChange={(e) =>
                    setForm({ ...form, og_image_url: e.target.value })
                  }
                  placeholder="https://example.com/og-image.png"
                />
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 1200x630 piksel.
                </p>
              </div>
              {form.og_image_url && (
                <div className="border rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.og_image_url}
                    alt="OG Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.currentTarget.style.display = "none");
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Canonical URL
              </CardTitle>
              <CardDescription>
                URL resmi untuk menghindari konten duplikat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={form.canonical_url}
                  onChange={(e) =>
                    setForm({ ...form, canonical_url: e.target.value })
                  }
                  placeholder="https://teamvora.com"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Google Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle>Preview Hasil Pencarian Google</CardTitle>
              <CardDescription>
                Seperti apa yang terlihat di Google.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-xl p-5 bg-background space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                    T
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      {settings?.general?.site_name || "TeamVora"}
                    </div>
                    <div className="text-[11px]">
                      {form.canonical_url || "https://teamvora.com"}
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                  {form.seo_title || "TeamVora - Platform Manajemen Tim"}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-500 font-mono text-xs">
                  {form.canonical_url || "https://teamvora.com"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {form.seo_description ||
                    "Deskripsi SEO akan muncul di sini..."}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium">Ringkasan SEO</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Panjang Judul</span>
                    <span
                      className={`font-mono ${
                        form.seo_title.length > 60
                          ? "text-red-500"
                          : form.seo_title.length >= 50
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {form.seo_title.length}/60
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">
                      Panjang Deskripsi
                    </span>
                    <span
                      className={`font-mono ${
                        form.seo_description.length > 160
                          ? "text-red-500"
                          : form.seo_description.length >= 150
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {form.seo_description.length}/160
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Kata Kunci</span>
                    <span className="font-mono text-muted-foreground">
                      {form.seo_keywords
                        ? form.seo_keywords.split(",").filter(Boolean).length
                        : 0}{" "}
                      kata
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">OG Image</span>
                    <span
                      className={`font-mono ${
                        form.og_image_url
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {form.og_image_url ? "✓ Terisi" : "✗ Kosong"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Canonical</span>
                    <span
                      className={`font-mono ${
                        form.canonical_url
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {form.canonical_url ? "✓ Terisi" : "✗ Kosong"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
