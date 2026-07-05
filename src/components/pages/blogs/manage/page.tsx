"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { Blog } from "@/types";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";
import { useRouter } from "next/navigation";

export function BlogManagePage({ basePath }: { basePath: string }) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs/manage");
      return res.data.data || res.data;
    },
  });

  const blogs = (Array.isArray(data) ? data : []) as Blog[];

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Kelola Blog" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground">Kelola postingan blog tim Anda.</p>
        </div>
        <Button asChild>
          <Link href={`${basePath}/blogs/manage/create`}>
            <Plus className="w-4 h-4 mr-2" /> Tulis Baru
          </Link>
        </Button>
      </div>

      <DataTable
        columns={[
          {
            key: "title",
            header: "Judul",
            render: (item: Blog) => (
              <span className="font-medium line-clamp-1">{item.title}</span>
            ),
          },
          {
            key: "author",
            header: "Penulis",
            render: (item: Blog) => item.author?.name || "-",
          },
          {
            key: "status",
            header: "Status",
            render: (item: Blog) => <StatusBadge status={item.status} />,
          },
          {
            key: "published_at",
            header: "Diterbitkan",
            render: (item: Blog) => formatDate(item.published_at),
          },
          {
            key: "created_at",
            header: "Dibuat",
            render: (item: Blog) => formatDate(item.created_at),
          },
        ]}
        data={blogs}
        isLoading={isLoading}
        emptyMessage="Belum ada blog"
        onRowClick={(item) => router.push(`${basePath}/blogs/manage/${item.id}/edit`)}
      />

      {!isLoading && blogs.length === 0 && (
        <EmptyState
          title="Belum ada postingan"
          description="Mulai tulis postingan blog pertama untuk tim Anda."
          action={
            <Button asChild>
              <Link href={`${basePath}/blogs/manage/create`}>
                <Plus className="w-4 h-4 mr-2" /> Tulis Baru
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
