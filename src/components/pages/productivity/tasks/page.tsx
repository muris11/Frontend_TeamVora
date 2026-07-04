"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import { Task } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TasksPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") queryParams.set("status", statusFilter);
  if (priorityFilter !== "all") queryParams.set("priority", priorityFilter);
  const queryString = queryParams.toString();

  const { data: response, isLoading } = useQuery({
    queryKey: ["tasks", statusFilter, priorityFilter],
    queryFn: () => api.get(`/tasks?${queryString}`).then((r) => r.data),
  });

  const tasks = response?.data ?? [];

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (item: Task) => (
        <span className="font-medium">{item.title}</span>
      ),
    },
    {
      key: "assignee",
      header: "Penanggung Jawab",
      render: (item: Task) => item.assignee?.name ?? "-",
    },
    {
      key: "priority",
      header: "Prioritas",
      render: (item: Task) => <StatusBadge status={item.priority} />,
    },
    {
      key: "status",
      header: "Status",
      render: (item: Task) => <StatusBadge status={item.status} />,
    },
    {
      key: "due_date",
      header: "Jatuh Tempo",
      render: (item: Task) => formatDate(item.due_date),
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Tugas" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tugas</h1>
        <Link href={`${basePath}/productivity/tasks/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Baru
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">Proses</SelectItem>
            <SelectItem value="done">Selesai</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prioritas</SelectItem>
            <SelectItem value="low">Rendah</SelectItem>
            <SelectItem value="medium">Sedang</SelectItem>
            <SelectItem value="high">Tinggi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {tasks.length === 0 && !isLoading ? (
        <EmptyState
          title="Belum ada tugas"
          description="Tugas akan muncul di sini setelah ditambahkan."
          action={
            <Link href={`${basePath}/productivity/tasks/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Tugas
              </Button>
            </Link>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={tasks}
          isLoading={isLoading}
          onRowClick={(item) =>
            router.push(`${basePath}/productivity/tasks/${item.id}/edit`)
          }
        />
      )}
    </div>
  );
}
