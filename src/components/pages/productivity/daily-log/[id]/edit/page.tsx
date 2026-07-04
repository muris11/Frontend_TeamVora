"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { PageTitle } from "@/components/shared/page-title";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FileUpload } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function DailyLogEditPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [logDate, setLogDate] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: log, isLoading } = useQuery({
    queryKey: ["daily-log", id],
    queryFn: () => api.get(`/daily-logs/${id}`).then((r) => r.data.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (log) {
      setTitle(log.title || "");
      setLogDate(log.log_date ? log.log_date.split("T")[0] : "");
      setContent(log.content || "");
    }
  }, [log]);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      api.put(`/daily-logs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast.success("Daily log berhasil diperbarui");
      router.push(`${basePath}/productivity/daily-log`);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui daily log"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/daily-logs/${id}`),
    onSuccess: () => {
      toast.success("Daily log berhasil dihapus");
      router.push(`${basePath}/productivity/daily-log`);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Gagal menghapus daily log");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("log_date", logDate);
    formData.append("content", content);
    if (file) formData.append("attachment", file);
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageTitle title="Edit Daily Log" />
        <div className="flex items-center gap-4">
          <Link href={`${basePath}/productivity/daily-log`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Daily Log</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Edit Daily Log" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`${basePath}/productivity/daily-log`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Daily Log</h1>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus
        </Button>
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
              {log?.attachment_url && !file && (
                <p className="text-sm text-muted-foreground">
                  File saat ini: {log.attachment_url.split("/").pop()}
                </p>
              )}
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
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Hapus Daily Log"
        description="Apakah Anda yakin ingin menghapus daily log ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => deleteMutation.mutate()}
        confirmLabel="Hapus"
        variant="destructive"
      />
    </div>
  );
}
