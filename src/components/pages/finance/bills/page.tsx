"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { SplitBill } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillsPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["bills", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      const res = await api.get(`/split-bills?${params.toString()}`);
      return res.data.data ?? res.data;
    },
  });

  const items = (data ?? []) as SplitBill[];

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (item: SplitBill) => (
        <span className="font-medium">{item.title}</span>
      ),
    },
    {
      key: "total_amount",
      header: "Total",
      render: (item: SplitBill) => (
        <span className="font-medium">{formatCurrency(item.total_amount)}</span>
      ),
    },
    {
      key: "due_date",
      header: "Jatuh Tempo",
      render: (item: SplitBill) => formatDate(item.due_date),
    },
    {
      key: "status",
      header: "Status",
      render: (item: SplitBill) => <StatusBadge status={item.status} />,
    },
    {
      key: "creator",
      header: "Dibuat Oleh",
      render: (item: SplitBill) => item.creator?.name ?? "-",
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Split Bill" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Split Bill</h1>
          <p className="text-sm text-muted-foreground">
            Kelola tagihan dan pembagian biaya
          </p>
        </div>
        {basePath !== "/member" && (
          <Button asChild className="rounded-xl">
            <Link href={`${basePath}/finance/bills/create`}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Baru
            </Link>
          </Button>
        )}
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
        {/* Unpaid Column */}
        <div className="flex-1 min-w-[300px] snap-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Belum Bayar</h3>
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
              {items.filter(i => i.user_status === 'unpaid').length}
            </span>
          </div>
          <div className="space-y-4">
            {items.filter(i => i.user_status === 'unpaid').map(item => (
              <Card key={item.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => router.push(`${basePath}/finance/bills/${item.id}`)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
                  </div>
                  <div className="text-xl font-bold text-primary mb-2">
                    {formatCurrency(item.total_amount)}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-3 border-t">
                    <span>{formatDate(item.due_date)}</span>
                    <span className="truncate max-w-[100px]">{item.creator?.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {items.filter(i => i.user_status === 'unpaid').length === 0 && (
              <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-sm">
                Kosong
              </div>
            )}
          </div>
        </div>

        {/* Pending Verification Column */}
        <div className="flex-1 min-w-[300px] snap-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Verifikasi</h3>
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
              {items.filter(i => i.user_status === 'pending_verification').length}
            </span>
          </div>
          <div className="space-y-4">
            {items.filter(i => i.user_status === 'pending_verification').map(item => (
              <Card key={item.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => router.push(`${basePath}/finance/bills/${item.id}`)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
                  </div>
                  <div className="text-xl font-bold text-primary mb-2">
                    {formatCurrency(item.total_amount)}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-3 border-t">
                    <span>{formatDate(item.due_date)}</span>
                    <span className="truncate max-w-[100px]">{item.creator?.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {items.filter(i => i.user_status === 'pending_verification').length === 0 && (
              <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-sm">
                Kosong
              </div>
            )}
          </div>
        </div>

        {/* Paid Column */}
        <div className="flex-1 min-w-[300px] snap-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Lunas</h3>
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
              {items.filter(i => i.user_status === 'paid').length}
            </span>
          </div>
          <div className="space-y-4">
            {items.filter(i => i.user_status === 'paid').map(item => (
              <Card key={item.id} className="cursor-pointer hover:border-primary/50 opacity-75 transition-colors" onClick={() => router.push(`${basePath}/finance/bills/${item.id}`)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm line-clamp-2">{item.title}</h4>
                  </div>
                  <div className="text-xl font-bold text-primary mb-2">
                    {formatCurrency(item.total_amount)}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-3 border-t">
                    <span>{formatDate(item.due_date)}</span>
                    <span className="truncate max-w-[100px]">{item.creator?.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {items.filter(i => i.user_status === 'paid').length === 0 && (
              <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-sm">
                Kosong
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
