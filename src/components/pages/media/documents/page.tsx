"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { FileText, Upload, Download, Search, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { TeamMedia } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFileSize, formatDate } from "@/lib/format";

export function DocumentsPage({ basePath }: { basePath: string }) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["media", "document"],
    queryFn: async () => {
      const res = await api.get("/media/documents");
      return res.data.data || res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => api.delete(`/media/${id}`),
    onSuccess: () => {
      toast.success("Dokumen berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["media", "document"] });
    },
    onError: () => toast.error("Gagal menghapus dokumen"),
  });

  const handleDelete = (id: string | number) => {
    if (confirm("Yakin ingin menghapus dokumen ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCopyUrl = (url: string | null) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success("URL disalin ke clipboard!");
  };

  const documents = (Array.isArray(data) ? data : []) as TeamMedia[];
  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Dokumen" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dokumen</h1>
          <p className="text-sm text-muted-foreground">Kelola file dokumen tim Anda.</p>
        </div>
        <Button asChild>
          <Link href={`${basePath}/media/documents/upload`}>
            <Upload className="w-4 h-4 mr-2" /> Upload
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari dokumen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-transparent pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5">
                <Skeleton className="h-10 w-10 rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "Tidak ada dokumen ditemukan" : "Belum ada dokumen"}
          description={
            search
              ? "Coba kata kunci pencarian yang berbeda."
              : "Upload dokumen pertama Anda untuk mulai berbagi dengan tim."
          }
          action={
            !search ? (
              <Button asChild>
                <Link href={`${basePath}/media/documents/upload`}>
                  <Upload className="w-4 h-4 mr-2" /> Upload Dokumen
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <Card
              key={doc.id}
              className="border-border/50 hover:shadow-md transition-all cursor-pointer group relative"
              onClick={() => { if (doc.file_path) window.open(doc.file_path, "_blank"); }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.user?.name || "Unknown"} &middot; {formatFileSize(doc.size)} &middot; {doc.mime_type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 shrink-0 hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(doc.file_path);
                    }}
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
