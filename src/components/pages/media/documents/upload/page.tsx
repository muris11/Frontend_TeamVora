"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/shared/file-upload";
import { PageTitle } from "@/components/shared/page-title";

export function DocumentsUploadPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("type", "document");
      formData.append("name", name);
      if (file) formData.append("file", file);
      const res = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Dokumen berhasil diupload.");
      router.push(`${basePath}/media/documents`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal mengupload dokumen.");
    },
  });

  const handleFileSelect = (f: File) => {
    setFile(f);
    if (!name) {
      setName(f.name.replace(/\.[^/.]+$/, ""));
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Upload Dokumen" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/media/documents`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Dokumen</h1>
          <p className="text-sm text-muted-foreground">Unggah file dokumen baru untuk tim.</p>
        </div>
      </div>

      <Card className="max-w-lg border-border/50">
        <CardHeader>
          <CardTitle>Detail Dokumen</CardTitle>
          <CardDescription>Isi informasi dokumen yang akan diupload.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Dokumen</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama dokumen"
            />
          </div>
          <div className="space-y-2">
            <Label>File</Label>
            <FileUpload
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              value={file}
              onFileSelect={handleFileSelect}
              onClear={() => setFile(null)}
            />
          </div>
          <Button
            onClick={() => mutate()}
            disabled={!name || !file || isPending}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isPending ? "Mengupload..." : "Upload Dokumen"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
