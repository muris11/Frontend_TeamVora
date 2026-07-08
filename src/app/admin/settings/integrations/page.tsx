"use client";

import { useEffect, useState } from "react";
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
import { Save, Key, Database, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export default function IntegrationsSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    googleClientId: "",
    googleClientSecret: "",
  });

  useEffect(() => {
    // For frontend-only demo, we load from localStorage
    const savedId = localStorage.getItem("GOOGLE_CLIENT_ID") || "";
    const savedSecret = localStorage.getItem("GOOGLE_CLIENT_SECRET") || "";
    setForm({
      googleClientId: savedId,
      googleClientSecret: savedSecret,
    });
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("GOOGLE_CLIENT_ID", form.googleClientId);
      localStorage.setItem("GOOGLE_CLIENT_SECRET", form.googleClientSecret);
      toast.success("Konfigurasi integrasi berhasil disimpan");
    } catch (e) {
      toast.error("Gagal menyimpan konfigurasi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <PageTitle title="Integrasi Pihak Ketiga | TeamVora Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrasi & API</h1>
          <p className="text-muted-foreground mt-1">
            Kelola koneksi aplikasi pihak ketiga seperti Google OAuth dan Google Drive.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="rounded-xl w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Menyimpan..." : "Simpan Konfigurasi"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Google Cloud API Credentials
            </CardTitle>
            <CardDescription>
              Kredensial ini digunakan untuk fitur <strong>Login dengan Google</strong> dan integrasi <strong>Google Drive</strong> bagi Team Lead.
              Pastikan Anda telah mengaktifkan <em>Google Drive API</em> di Google Cloud Console.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="googleClientId">Client ID</Label>
              <Input
                id="googleClientId"
                value={form.googleClientId}
                onChange={(e) => setForm({ ...form, googleClientId: e.target.value })}
                placeholder="Misal: 1234567890-abcdefg...apps.googleusercontent.com"
              />
              <p className="text-xs text-muted-foreground">
                Didapatkan dari Google Cloud Console &gt; API & Services &gt; Credentials.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="googleClientSecret">Client Secret</Label>
              <Input
                id="googleClientSecret"
                type="password"
                value={form.googleClientSecret}
                onChange={(e) => setForm({ ...form, googleClientSecret: e.target.value })}
                placeholder="••••••••••••••••••••••••"
              />
            </div>

            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mt-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                URI Redirect (Callback URL)
              </h4>
              <p className="text-xs text-blue-700 mb-2">
                Tambahkan URL ini ke daftar "Authorized redirect URIs" di Google Cloud Console Anda:
              </p>
              <code className="text-xs bg-white px-2 py-1 rounded border shadow-sm block w-fit">
                {typeof window !== "undefined" ? window.location.origin : "https://app.teamvora.web.id"}/api/auth/callback/google
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
