"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Globe } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformSettings {
  general: {
    site_name: string;
    tagline: string;
    favicon_url: string;
    logo_url: string;
  };
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  const [general, setGeneral] = useState({
    site_name: "",
    tagline: "",
    favicon_url: "",
    logo_url: "",
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as PlatformSettings;
    },
  });

  useEffect(() => {
    if (settings) {
      setGeneral({
        site_name: settings.general?.site_name ?? "",
        tagline: settings.general?.tagline ?? "",
        favicon_url: settings.general?.favicon_url ?? "",
        logo_url: settings.general?.logo_url ?? "",
      });
    }
  }, [settings]);

  const generalMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan umum berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan umum"),
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Pengaturan Umum | TeamVora Admin" />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Umum</h1>
        <p className="text-muted-foreground">
          Pengaturan dasar untuk identitas dan branding platform.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Informasi Platform
          </CardTitle>
          <CardDescription>
            Nama, tagline, dan aset visual platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {settingsLoading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="site_name">Nama Situs</Label>
                <Input
                  id="site_name"
                  value={general.site_name}
                  onChange={(e) =>
                    setGeneral({ ...general, site_name: e.target.value })
                  }
                  placeholder="TeamVora"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={general.tagline}
                  onChange={(e) =>
                    setGeneral({ ...general, tagline: e.target.value })
                  }
                  placeholder="Platform Manajemen Tim"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="favicon_url">URL Favicon</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="favicon_url"
                    value={general.favicon_url}
                    onChange={(e) =>
                      setGeneral({
                        ...general,
                        favicon_url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/favicon.ico"
                    className="flex-1"
                  />
                  {general.favicon_url && (
                    <img
                      src={general.favicon_url}
                      alt="Favicon preview"
                      className="w-8 h-8 rounded border border-border/50 object-contain"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo_url">URL Logo</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="logo_url"
                    value={general.logo_url}
                    onChange={(e) =>
                      setGeneral({ ...general, logo_url: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                    className="flex-1"
                  />
                  {general.logo_url && (
                    <img
                      src={general.logo_url}
                      alt="Logo preview"
                      className="w-8 h-8 rounded border border-border/50 object-contain"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => generalMutation.mutate(general)}
                  disabled={generalMutation.isPending}
                  className="rounded-xl"
                >
                  <Save className="w-4 h-4" />
                  {generalMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
