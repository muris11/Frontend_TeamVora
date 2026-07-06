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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Mail, ImageIcon, Loader2, Server, Info, Send, Palette } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { ColorPicker } from "@/components/ui/color-picker";
import { MediaPicker } from "@/components/shared/media-picker";

interface EmailSettings {
  email_logo_url: string;
  email_sender_name: string;
  email_reply_to: string;
  email_button_color?: string;
  email_footer_text?: string;
  email_primary_color?: string;
}

interface PlatformSettings {
  general?: { site_name?: string; logo_url?: string };
  email?: {
    email_logo_url?: string;
    email_sender_name?: string;
    email_reply_to?: string;
    email_button_color?: string;
    email_primary_color?: string;
    email_footer_text?: string;
  };
}

export default function EmailSettingsPage() {
  const queryClient = useQueryClient();
  const [logoUrl, setLogoUrl] = useState("");
  const [senderName, setSenderName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [buttonColor, setButtonColor] = useState("blue");
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [footerText, setFooterText] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const { data: emailSettings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as PlatformSettings;
    },
  });

  const { data: emailConfig } = useQuery({
    queryKey: ["email-config"],
    queryFn: async () => {
      const res = await api.get("/email-config");
      return res.data.data as Record<string, string>;
    },
  });

  useEffect(() => {
    if (emailSettings) {
      const emailGroup = (emailSettings as any).email || {};
      setLogoUrl(emailGroup.email_logo_url ?? emailSettings.general?.logo_url ?? "");
      setSenderName(emailGroup.email_sender_name ?? "TeamVora");
      setReplyTo(emailGroup.email_reply_to ?? "");
      setButtonColor(emailGroup.email_button_color ?? "blue");
      setPrimaryColor(emailGroup.email_primary_color ?? "blue");
      setFooterText(emailGroup.email_footer_text ?? "");
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
      email_button_color: buttonColor,
      email_primary_color: primaryColor,
      email_footer_text: footerText,
    });
  };

  const testEmailMutation = useMutation({
    mutationFn: (email: string) =>
      api.post("/admin/platform-settings/test-email", { email }),
    onSuccess: () => {
      toast.success("Email tes berhasil dikirim.");
      setTestEmail("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal mengirim email tes.");
    }
  });

  const handleTestEmail = () => {
    if (!testEmail) {
      toast.error("Masukkan alamat email.");
      return;
    }
    testEmailMutation.mutate(testEmail);
  };

  // Maps tailwind color names to actual hex codes for the email inline styles
  const buttonColorHex: Record<string, string> = {
    blue: "#3b82f6",
    sky: "#0ea5e9",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    purple: "#a855f7",
    fuchsia: "#d946ef",
    pink: "#ec4899",
    rose: "#f43f5e",
    red: "#ef4444",
    orange: "#f97316",
    amber: "#f59e0b",
    yellow: "#eab308",
    lime: "#84cc16",
    green: "#22c55e",
    emerald: "#10b981",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    slate: "#64748b",
    gray: "#6b7280",
    zinc: "#71717a",
    primary: "#0f172a",
  };

  const actualButtonColor = buttonColorHex[buttonColor] || buttonColor;
  const actualPrimaryColor = buttonColorHex[primaryColor] || primaryColor;

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
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col gap-4">
        <PageTitle title="Pengaturan Email | TeamVora Admin" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Email</h1>
          <p className="text-muted-foreground mt-1">
            Sesuaikan tampilan dan pengirim email notifikasi sistem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Desain Email
              </CardTitle>
              <CardDescription>
                Logo dan warna aksen yang ditampilkan di setiap email notifikasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email_logo_url">URL Logo</Label>
                <MediaPicker
                  value={logoUrl}
                  onChange={setLogoUrl}
                  placeholder="Pilih atau upload logo"
                />
              </div>
              <div className="grid gap-2">
                <Label>Warna Utama (Header/Aksen)</Label>
                <ColorPicker
                  value={primaryColor}
                  onChange={setPrimaryColor}
                />
              </div>
              <div className="grid gap-2">
                <Label>Warna Tombol Email</Label>
                <ColorPicker
                  value={buttonColor}
                  onChange={setButtonColor}
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
              <div className="grid gap-2">
                <Label htmlFor="footer_text">Teks Footer Email</Label>
                <Input
                  id="footer_text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="&copy; 2026 TeamVora. Hak Cipta Dilindungi."
                />
                <p className="text-xs text-muted-foreground">
                  Teks kustom yang muncul di bagian paling bawah email.
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
                  { label: "MAIL_MAILER", value: emailConfig?.MAIL_MAILER || "-" },
                  { label: "MAIL_HOST", value: emailConfig?.MAIL_HOST || "-" },
                  { label: "MAIL_PORT", value: emailConfig?.MAIL_PORT || "-" },
                  { label: "MAIL_FROM_ADDRESS", value: emailConfig?.MAIL_FROM_ADDRESS || "-" },
                  { label: "MAIL_USERNAME", value: emailConfig?.MAIL_USERNAME || "-" },
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
              <CardTitle>Preview Email</CardTitle>
              <CardDescription>
                Pratinjau tampilan email asli (berdasarkan template Laravel).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="test" className="w-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="test" className="rounded-lg">Test Email</TabsTrigger>
                  <TabsTrigger value="reset" className="rounded-lg">Reset Password</TabsTrigger>
                  <TabsTrigger value="invite" className="rounded-lg">Undangan Tim</TabsTrigger>
                </TabsList>
                
                <div className="border border-border/50 rounded-2xl bg-muted/20 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[500px] overflow-hidden shadow-inner">
                  {/* Email Wrapper */}
                  <div className="bg-white shadow-sm w-full max-w-[600px] rounded-xl overflow-hidden border border-[#e5e7eb] font-sans text-[#374151] leading-relaxed">
                    
                    {/* Header */}
                    <div className="p-6 text-center border-b border-[#e5e7eb] bg-white">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="mx-auto object-contain max-h-[50px]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://teamvora.coded.my.id/icon.png";
                          }}
                        />
                      ) : (
                        <h2 className="text-[#111827] text-xl font-bold m-0">{senderName || "TeamVora"}</h2>
                      )}
                    </div>

                    {/* Body - Changes per tab */}
                    <div className="p-8">
                      <TabsContent value="test" className="m-0 mt-0">
                        <h1 className="text-xl font-bold text-[#111827] mt-0 mb-4">Email Tes Berhasil!</h1>
                        <p className="mb-4">Halo,</p>
                        <p className="mb-4">Ini adalah email tes dari <strong>{emailSettings?.general?.site_name || "TeamVora"}</strong>.</p>
                        <p className="mb-4">Jika Anda menerima email ini, berarti konfigurasi SMTP Anda telah berfungsi dengan baik dan sistem dapat mengirimkan email notifikasi ke pengguna.</p>
                        <p className="mb-4">Terima kasih,<br />Tim {emailSettings?.general?.site_name || "TeamVora"}</p>
                      </TabsContent>

                      <TabsContent value="reset" className="m-0 mt-0">
                        <h1 className="text-xl font-bold text-[#111827] mt-0 mb-4">Atur Ulang Kata Sandi</h1>
                        <p className="mb-4">Anda menerima email ini karena kami menerima permintaan pengaturan ulang kata sandi untuk akun Anda.</p>
                        <div className="my-6">
                          <a href="#" onClick={e => e.preventDefault()} style={{ backgroundColor: actualButtonColor }} className="inline-block text-white font-semibold py-3 px-6 rounded-lg no-underline shadow-sm hover:opacity-90">
                            Atur Ulang Kata Sandi
                          </a>
                        </div>
                        <p className="mb-4">Tautan atur ulang kata sandi ini akan kedaluwarsa dalam 60 menit.</p>
                        <p className="mb-4">Jika Anda tidak meminta pengaturan ulang kata sandi, tidak ada tindakan lebih lanjut yang diperlukan.</p>
                        <p className="mb-4">Salam,<br />{emailSettings?.general?.site_name || "TeamVora"}</p>
                      </TabsContent>

                      <TabsContent value="invite" className="m-0 mt-0">
                        <h1 className="text-xl font-bold text-[#111827] mt-0 mb-4">Undangan Bergabung Tim</h1>
                        <p className="mb-4">Anda telah diundang oleh <strong>John Doe</strong> untuk bergabung dengan tim <strong>Tim Pemasaran Digital</strong> di {emailSettings?.general?.site_name || "TeamVora"}.</p>
                        <div className="my-6">
                          <a href="#" onClick={e => e.preventDefault()} style={{ backgroundColor: actualButtonColor }} className="inline-block text-white font-semibold py-3 px-6 rounded-lg no-underline shadow-sm hover:opacity-90">
                            Terima Undangan
                          </a>
                        </div>
                        <p className="mb-4">Atau salin dan tempel URL berikut ke browser Anda:</p>
                        <p className="mb-4 text-[#6b7280] break-all"><a href="#" onClick={e => e.preventDefault()} style={{ color: actualButtonColor }}>https://teamvora.id/invite/abc123xyz</a></p>
                        <p className="mb-4">Jika Anda tidak mengetahui dari siapa undangan ini, Anda dapat mengabaikan email ini.</p>
                        <p className="mb-4">Salam,<br />{emailSettings?.general?.site_name || "TeamVora"}</p>
                      </TabsContent>
                    </div>

                    {/* Footer */}
                    <div className="p-6 text-center border-t border-[#e5e7eb] bg-[#f9fafb] text-[12px] text-[#9ca3af]">
                      <p className="mb-4 mt-0">Dikirim oleh {senderName || "TeamVora"}</p>
                      {replyTo && (
                        <p className="mb-4">Balas ke: <a href={`mailto:${replyTo}`} className="text-[#6b7280]">{replyTo}</a></p>
                      )}
                      <p className="mb-0">{footerText || `\u00A9 ${new Date().getFullYear()} TeamVora. Hak Cipta Dilindungi.`}</p>
                    </div>

                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Kirim Email Tes
              </CardTitle>
              <CardDescription>
                Pastikan konfigurasi SMTP Anda sudah benar dengan mengirimkan email tes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <Button onClick={handleTestEmail} disabled={testEmailMutation.isPending} className="whitespace-nowrap">
                  {testEmailMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Kirim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}




