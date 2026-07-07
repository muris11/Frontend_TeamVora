"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "@/components/shared/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, FileText, CheckCircle2, Clock, AlertCircle, Ticket as TicketIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  attachment_path: string | null;
  created_at: string;
  team: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
  };
}

export default function AdminTicketsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const res = await api.get("/admin/tickets");
      return res.data.data as Ticket[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.put(`/admin/tickets/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Status tiket berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate status tiket");
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3"/> Terbuka</span>;
      case "in_progress":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3"/> Diproses</span>;
      case "resolved":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3"/> Selesai</span>;
      case "closed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Ditutup</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <span className="text-xs font-medium text-gray-500">Rendah</span>;
      case "medium":
        return <span className="text-xs font-medium text-amber-500">Sedang</span>;
      case "high":
        return <span className="text-xs font-medium text-red-500">Tinggi</span>;
      default:
        return null;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageTitle title="Manajemen Tiket | TeamVora Admin" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Tiket</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau seluruh tiket bantuan dari pengguna.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Semua Tiket</CardTitle>
              <CardDescription>Daftar tiket bantuan dari seluruh tim.</CardDescription>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input
                placeholder="Cari judul atau nama tim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[250px]"
              />
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="open">Terbuka</SelectItem>
                  <SelectItem value="in_progress">Diproses</SelectItem>
                  <SelectItem value="resolved">Selesai</SelectItem>
                  <SelectItem value="closed">Ditutup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <TicketIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Tidak ada tiket ditemukan</h3>
              <p className="text-sm text-muted-foreground">
                Tidak ada data tiket yang sesuai dengan filter pencarian.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Judul & Detail</th>
                    <th className="px-6 py-3 font-medium">Tim / Pengguna</th>
                    <th className="px-6 py-3 font-medium">Kategori & Prioritas</th>
                    <th className="px-6 py-3 font-medium">Tanggal Masuk</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="bg-card hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-base">{ticket.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 max-w-[300px] line-clamp-2">
                          {ticket.description}
                        </div>
                        {ticket.attachment_path && (
                          <div className="mt-2">
                            <a href={ticket.attachment_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                              <FileText className="w-3 h-3" /> Lampiran
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{ticket.team.name}</div>
                        <div className="text-xs text-muted-foreground">Oleh: {ticket.user.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="capitalize font-medium">{ticket.category}</div>
                        <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {format(new Date(ticket.created_at), "dd MMM yyyy")}
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(ticket.created_at), "HH:mm")}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Select 
                          defaultValue={ticket.status} 
                          onValueChange={(val) => val && updateStatus.mutate({ id: ticket.id, status: val })}
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Terbuka</SelectItem>
                            <SelectItem value="in_progress">Diproses</SelectItem>
                            <SelectItem value="resolved">Selesai</SelectItem>
                            <SelectItem value="closed">Ditutup</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
