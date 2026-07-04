"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { PageTitle } from "@/components/shared/page-title";
import { FileUpload } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function DailyLogCreatePage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/daily-logs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast.success("Daily log berhasil dibuat");
      router.push(`${basePath}/productivity/daily-log`);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Gagal membuat daily log");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("log_date", logDate);
    formData.append("content", content);
    if (file) formData.append("attachment", file);
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Buat Daily Log" />

      <div className="flex items-center gap-4">
        <Link href={`${basePath}/productivity/daily-log`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Buat Daily Log Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Daily Log</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul daily log"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="log_date">Tanggal</Label>
              <Input
                id="log_date"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis konten daily log di sini..."
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Lampiran</Label>
              <FileUpload
                value={file}
                onFileSelect={setFile}
                onClear={() => setFile(null)}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link href={`${basePath}/productivity/daily-log`}>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
