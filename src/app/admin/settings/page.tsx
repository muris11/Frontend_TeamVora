"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Image as ImageIcon, Search, Map, Wrench, Settings } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PlatformSettings {
  general: {
    site_name: string;
    tagline: string;
    favicon_url: string;
    logo_url: string;
  };
  regional: {
    timezone: string;
    language: string;
    currency: string;
  };
  maintenance: {
    maintenance_mode: string;
    maintenance_message: string;
  };
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  const [settingsForm, setSettingsForm] = useState({
    site_name: "",
    tagline: "",
    favicon_url: "",
    logo_url: "",
    timezone: "Asia/Jakarta",
    language: "id",
    currency: "IDR",
    maintenance_mode: "false",
    maintenance_message: "",
  });

  const [activePicker, setActivePicker] = useState<"favicon" | "logo" | null>(null);

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
        timezone: settings.regional?.timezone ?? "Asia/Jakarta",
        language: settings.regional?.language ?? "id",
        currency: settings.regional?.currency ?? "IDR",
        maintenance_mode: settings.maintenance?.maintenance_mode ?? "false",
        maintenance_message: settings.maintenance?.maintenance_message ?? "",
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
          Kelola informasi platform, branding, logo, dan pengaturan regional secara lengkap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Identitas Platform */}
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

        <div className="space-y-8">
          {/* Pengaturan Regional */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-500" />
                Pengaturan Regional
              </CardTitle>
              <CardDescription>
                Zona waktu, bahasa, dan mata uang default.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settingsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label>Zona Waktu</Label>
                    <Select
                      value={settingsForm.timezone}
                      onValueChange={(val) => setSettingsForm({ ...settingsForm, timezone: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Zona Waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                        <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                        <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Bahasa Default</Label>
                    <Select
                      value={settingsForm.language}
                      onValueChange={(val) => setSettingsForm({ ...settingsForm, language: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Bahasa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Mata Uang</Label>
                    <Select
                      value={settingsForm.currency}
                      onValueChange={(val) => setSettingsForm({ ...settingsForm, currency: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Mata Uang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pengaturan Maintenance */}
          <Card className="border-border/50 shadow-sm border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-500" />
                Mode Maintenance
              </CardTitle>
              <CardDescription>
                Aktifkan mode pemeliharaan untuk menutup akses publik.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Status Maintenance</Label>
                      <p className="text-sm text-muted-foreground">Aktifkan untuk menampilkan halaman maintenance.</p>
                    </div>
                    <Switch
                      checked={settingsForm.maintenance_mode === "true"}
                      onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, maintenance_mode: checked ? "true" : "false" })}
                    />
                  </div>

                  {settingsForm.maintenance_mode === "true" && (
                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Label htmlFor="maintenance_message">Pesan Maintenance</Label>
                      <Textarea
                        id="maintenance_message"
                        value={settingsForm.maintenance_message}
                        onChange={(e) => setSettingsForm({ ...settingsForm, maintenance_message: e.target.value })}
                        placeholder="Kami sedang melakukan pemeliharaan sistem. Silakan kembali lagi nanti."
                        rows={3}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
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
        }}
        type="gallery"
      />
    </div>
  );
}
