"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import { DailyLog } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DailyLogPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const queryParams = new URLSearchParams();
  if (startDate) queryParams.set("start_date", startDate);
  if (endDate) queryParams.set("end_date", endDate);
  const queryString = queryParams.toString();

  const { data: response, isLoading } = useQuery({
    queryKey: ["daily-logs", startDate, endDate],
    queryFn: () => api.get(`/daily-logs?${queryString}`).then((r) => r.data),
  });

  const logs = response?.data ?? [];

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (item: DailyLog) => (
        <span className="font-medium">{item.title}</span>
      ),
    },
    {
      key: "user",
      header: "Pengguna",
      render: (item: DailyLog) => item.user?.name ?? "-",
    },
    {
      key: "log_date",
      header: "Tanggal",
      render: (item: DailyLog) => formatDate(item.log_date),
    },
    {
      key: "content",
      header: "Konten",
      render: (item: DailyLog) => (
        <span className="line-clamp-1 max-w-[300px] text-sm text-muted-foreground">
          {item.content}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Daily Log" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daily Log</h1>
        <Link href={`${basePath}/productivity/daily-log/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Baru
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Dari Tanggal</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-[200px]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Sampai Tanggal</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-[200px]"
          />
        </div>
      </div>

      {logs.length === 0 && !isLoading ? (
        <EmptyState
          title="Belum ada daily log"
          description="Daily log akan muncul di sini setelah ditambahkan."
          action={
            <Link href={`${basePath}/productivity/daily-log/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Daily Log
              </Button>
            </Link>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          onRowClick={(item) =>
            router.push(`${basePath}/productivity/daily-log/${item.id}/edit`)
          }
        />
      )}
    </div>
  );
}
