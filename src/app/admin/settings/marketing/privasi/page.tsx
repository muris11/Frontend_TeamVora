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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function PrivasiPage() {
  const queryClient = useQueryClient();
  const [privacyContent, setPrivacyContent] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { marketing?: { privacy_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.privacy_content) {
      setPrivacyContent(settings.marketing.privacy_content);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Privasi berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Privasi"),
  });

  const handleSave = () => {
    saveMutation.mutate({ privacy_content: privacyContent });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Kebijakan Privasi | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kebijakan Privasi</h1>
          <p className="text-muted-foreground">Edit konten halaman Kebijakan Privasi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/privasi", "_blank")} className="rounded-xl">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="rounded-xl">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan
          </Button>
        </div>
      </div>

      <div className="max-w-3xl">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Kebijakan Privasi</CardTitle>
            <CardDescription>Konten halaman kebijakan privasi dalam format teks panjang. Mendukung baris baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label>Konten</Label>
              <Textarea
                value={privacyContent}
                onChange={(e) => setPrivacyContent(e.target.value)}
                placeholder="Tuliskan konten kebijakan privasi di sini..."
                className="min-h-[500px] font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Kosongkan untuk menggunakan konten hardcoded default.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
