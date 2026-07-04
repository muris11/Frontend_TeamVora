"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Mail, ImageIcon, Loader2, Server, Info } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface EmailSettings {
  email_logo_url: string;
  email_sender_name: string;
  email_reply_to: string;
}

interface PlatformSettings {
  general?: { site_name?: string; logo_url?: string };
}

export default function EmailSettingsPage() {
  const queryClient = useQueryClient();
  const [logoUrl, setLogoUrl] = useState("");
  const [senderName, setSenderName] = useState("");
  const [replyTo, setReplyTo] = useState("");

  const { data: emailSettings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as PlatformSettings;
    },
  });

  useEffect(() => {
    if (emailSettings) {
      setLogoUrl(emailSettings.general?.logo_url ?? "");
      setSenderName((emailSettings as any).email_sender_name ?? "TeamVora");
      setReplyTo((emailSettings as any).email_reply_to ?? "");
    }
  }, [emailSettings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan email berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan email"),
  });

  const handleSave = () => {
    saveMutation.mutate({
      email_logo_url: logoUrl,
      email_sender_name: senderName,
      email_reply_to: replyTo,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Pengaturan Email | TeamVora Admin" />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Email</h1>
        <p className="text-muted-foreground">
          Sesuaikan tampilan dan pengirim email notifikasi sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Logo Email
              </CardTitle>
              <CardDescription>
                Logo yang ditampilkan di header setiap email notifikasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email_logo_url">URL Logo</Label>
                <Input
                  id="email_logo_url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              {logoUrl && (
                <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="max-h-12 object-contain"
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
                <Mail className="w-5 h-5" />
                Pengirim Email
              </CardTitle>
              <CardDescription>
                Konfigurasi nama pengirim dan alamat reply-to.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="sender_name">Nama Pengirim</Label>
                <Input
                  id="sender_name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="TeamVora"
                />
                <p className="text-xs text-muted-foreground">
                  Nama yang muncul di kolom &quot;Dari&quot; email.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reply_to">Reply-To Email</Label>
                <Input
                  id="reply_to"
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  placeholder="noreply@teamvora.com"
                />
                <p className="text-xs text-muted-foreground">
                  Alamat email tujuan saat pengguna membalas email notifikasi.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="w-full rounded-xl"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Simpan Pengaturan
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Informasi SMTP
              </CardTitle>
              <CardDescription>
                Konfigurasi SMTP diatur melalui file{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> di server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
                {[
                  { label: "MAIL_MAILER", value: "smtp" },
                  { label: "MAIL_HOST", value: "smtp-relay.brevo.com" },
                  { label: "MAIL_PORT", value: "587" },
                  { label: "MAIL_FROM_ADDRESS", value: "info@teamvora.coded.my.id" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-foreground font-mono text-xs">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Ubah melalui{" "}
                <a href="/admin/env-config" className="underline hover:text-foreground">
                  Konfigurasi .env
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader>
              <CardTitle>Preview Email Header</CardTitle>
              <CardDescription>
                Pratinjau tampilan header email yang diterima pengguna.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-xl bg-gray-50 dark:bg-gray-900 p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-white dark:bg-gray-800 shadow-md w-full max-w-md rounded-t-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl || "https://teamvora.coded.my.id/icon.png"}
                      alt="Logo Preview"
                      className="mx-auto object-contain max-h-[50px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://teamvora.coded.my.id/icon.png";
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                      {senderName || "TeamVora"}
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                    </div>
                    <div className="flex justify-center pt-4">
                      <div className="h-10 bg-primary/20 rounded-lg w-36" />
                    </div>
                  </div>
                  <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700 text-[10px] text-muted-foreground">
                    Dikirim oleh {senderName || "TeamVora"}
                    {replyTo && (
                      <span> &middot; Balas ke {replyTo}</span>
                    )}
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
