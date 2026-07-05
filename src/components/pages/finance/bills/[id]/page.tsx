"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Upload } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { SplitBill, BillItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FileUpload } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function BillDetailPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [payingItemId, setPayingItemId] = useState<number | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const { data: bill, isLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: async () => {
      const res = await api.get(`/split-bills/${id}`);
      return (res.data.data ?? res.data) as SplitBill;
    },
  });

  const uploadProofMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: number }) => {
      const formData = new FormData();
      if (proofFile) formData.append("proof", proofFile);
      const res = await api.post(`/bill-items/${itemId}/pay`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Bukti pembayaran berhasil dikirim");
      setPayingItemId(null);
      setProofFile(null);
      queryClient.invalidateQueries({ queryKey: ["bill", id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal mengirim bukti");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ itemId }: { itemId: number }) => {
      const res = await api.put(`/bill-items/${itemId}/verify`, { status: "paid" });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pembayaran berhasil diverifikasi");
      queryClient.invalidateQueries({ queryKey: ["bill", id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal verifikasi");
    },
  });

  const items = bill?.items ?? [];

  const columns = [
    {
      key: "user",
      header: "Nama",
      render: (item: BillItem) => item.user?.name ?? "-",
    },
    {
      key: "amount",
      header: "Jumlah",
      render: (item: BillItem) => (
        <span className="font-medium">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: BillItem) => <StatusBadge status={item.status} />,
    },
    {
      key: "proof",
      header: "Bukti",
      render: (item: BillItem) => {
        if (item.proof_url) {
          return (
            <a
              href={item.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline text-sm"
            >
              Lihat
            </a>
          );
        }
        return "-";
      },
    },
    {
      key: "actions",
      header: "",
      render: (item: BillItem) => {
        if (item.status === "pending_verification" && user?.role === "team_leader") {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                verifyMutation.mutate({ itemId: item.id });
              }}
              disabled={verifyMutation.isPending}
            >
              Verifikasi
            </Button>
          );
        }
        return null;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <EmptyState
        title="Tagihan tidak ditemukan"
        description="Tagihan yang Anda cari mungkin sudah dihapus."
        action={
          <Button asChild>
            <Link href={`${basePath}/finance/bills`}>Kembali ke Daftar</Link>
          </Button>
        }
      />
    );
  }

  const myUnpaidItem = items.find(
    (i) =>
      i.status === "unpaid" &&
      i.user?.id === user?.id
  );

  return (
    <div className="space-y-6">
      <PageTitle title={bill.title} />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/finance/bills`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{bill.title}</h1>
          <p className="text-sm text-muted-foreground">Detail tagihan</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`${basePath}/finance/bills/${id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Bill Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(bill.total_amount)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Jatuh Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{formatDate(bill.due_date)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={bill.status} />
          </CardContent>
        </Card>
      </div>

      {bill.description && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Keterangan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{bill.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-muted-foreground">
        Dibuat oleh: {bill.creator?.name ?? "-"}
      </div>

      {/* Bayar Button */}
      {myUnpaidItem && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Upload Bukti Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payingItemId === myUnpaidItem.id ? (
              <div className="space-y-3">
                <FileUpload
                  value={proofFile}
                  onFileSelect={setProofFile}
                  onClear={() => setProofFile(null)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      uploadProofMutation.mutate({ itemId: myUnpaidItem.id })
                    }
                    disabled={!proofFile || uploadProofMutation.isPending}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadProofMutation.isPending ? "Mengirim..." : "Kirim"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPayingItemId(null);
                      setProofFile(null);
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setPayingItemId(myUnpaidItem.id)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Bayar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Items Table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Item Tagihan</h2>
        {items.length === 0 ? (
          <EmptyState title="Belum ada item" />
        ) : (
          <DataTable columns={columns} data={items} />
        )}
      </div>
    </div>
  );
}
