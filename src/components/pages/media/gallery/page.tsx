"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Upload, ImageIcon, X, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { TeamMedia } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export function GalleryPage({ basePath }: { basePath: string }) {
  const [lightbox, setLightbox] = useState<TeamMedia | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["media", "gallery"],
    queryFn: async () => {
      const res = await api.get("/media/gallery");
      return res.data.data || res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => api.delete(`/media/${id}`),
    onSuccess: () => {
      toast.success("Gambar berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["media", "gallery"] });
    },
    onError: () => toast.error("Gagal menghapus gambar"),
  });

  const handleDelete = (id: string | number) => {
    if (confirm("Yakin ingin menghapus gambar ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCopyUrl = (url: string | null) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success("URL disalin ke clipboard!");
  };

  const images = (Array.isArray(data) ? data : []) as TeamMedia[];
  const validImages = images.filter((img) => !!img.file_path);

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Galeri" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Galeri</h1>
          <p className="text-sm text-muted-foreground">Koleksi gambar tim Anda.</p>
        </div>
        <Button asChild>
          <Link href={`${basePath}/media/gallery/upload`}>
            <Upload className="w-4 h-4 mr-2" /> Upload
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <EmptyState
          title="Belum ada gambar"
          description="Upload gambar pertama Anda untuk mulai mengisi galeri tim."
          icon={<ImageIcon className="h-12 w-12" />}
          action={
            <Button asChild>
              <Link href={`${basePath}/media/gallery/upload`}>
                <Upload className="w-4 h-4 mr-2" /> Upload Gambar
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {validImages.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 hover:ring-2 hover:ring-primary/50 transition-all"
            >
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => setLightbox(img)}
              >
                <img
                  src={img.file_path ?? ""}
                  alt={img.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 bg-black/50 text-white hover:bg-black/70 border-0"
                  onClick={(e) => { e.stopPropagation(); handleCopyUrl(img.file_path); }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="w-8 h-8"
                  onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <p className="text-white text-sm font-medium truncate">{img.name}</p>
                <p className="text-white/70 text-xs">{formatDate(img.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:text-white/80"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <img
              src={lightbox.file_path ?? ""}
              alt={lightbox.name}
              className="max-h-[80vh] mx-auto rounded-lg object-contain"
            />
            <div className="mt-3 text-center">
              <p className="text-white font-medium">{lightbox.name}</p>
              <p className="text-white/60 text-sm">{lightbox.user?.name} &middot; {formatDate(lightbox.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
