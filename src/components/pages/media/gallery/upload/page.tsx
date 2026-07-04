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

export function GalleryUploadPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("type", "gallery");
      formData.append("name", name);
      if (file) formData.append("file", file);
      const res = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Gambar berhasil diupload.");
      router.push(`${basePath}/media/gallery`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal mengupload gambar.");
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
      <PageTitle title="Upload Gambar" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/media/gallery`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Gambar</h1>
          <p className="text-sm text-muted-foreground">Unggah gambar baru ke galeri tim.</p>
        </div>
      </div>

      <Card className="max-w-lg border-border/50">
        <CardHeader>
          <CardTitle>Detail Gambar</CardTitle>
          <CardDescription>Isi informasi gambar yang akan diupload.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Gambar</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama gambar"
            />
          </div>
          <div className="space-y-2">
            <Label>File Gambar</Label>
            <FileUpload
              accept="image/*"
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
            {isPending ? "Mengupload..." : "Upload Gambar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
