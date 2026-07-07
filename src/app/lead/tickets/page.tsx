"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { Plus, Ticket as TicketIcon, Loader2, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  attachment_path: string | null;
  created_at: string;
}

export default function LeadTicketsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["lead-tickets"],
    queryFn: async () => {
      const res = await api.get("/lead/tickets");
      return res.data.data as Ticket[];
    },
  });

  const createTicket = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      if (selectedFile) {
        formData.set("attachment", selectedFile);
      }
      const res = await api.post("/lead/tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tiket berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["lead-tickets"] });
      setIsDialogOpen(false);
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat tiket");
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageTitle title="Ticketing | TeamVora" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticketing</h1>
          <p className="text-muted-foreground">
            Kelola tiket bantuan dan pelaporan untuk tim Anda.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Buat Tiket Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tiket</CardTitle>
          <CardDescription>Semua tiket pelaporan yang pernah Anda buat.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <TicketIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Belum ada tiket</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Anda belum pernah membuat tiket bantuan.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                Buat Tiket Sekarang
              </Button>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Judul</th>
                    <th className="px-6 py-3 font-medium">Kategori</th>
                    <th className="px-6 py-3 font-medium">Prioritas</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Dibuat Pada</th>
                    <th className="px-6 py-3 font-medium text-right">Lampiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="bg-card hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {ticket.title}
                        <div className="text-xs text-muted-foreground font-normal line-clamp-1 mt-1">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">{ticket.category}</td>
                      <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                      <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                      <td className="px-6 py-4">
                        {format(new Date(ticket.created_at), "dd MMM yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {ticket.attachment_path ? (
                          <a href={ticket.attachment_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                            <FileText className="w-3 h-3" /> Lihat
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Buat Tiket Baru</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk membuat tiket bantuan atau pelaporan bug.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => createTicket.mutate(e)} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Tiket</Label>
              <Input id="title" name="title" required placeholder="Contoh: Gagal mengupload logo" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select name="category" defaultValue="bug" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug / Error</SelectItem>
                    <SelectItem value="feature">Fitur Baru</SelectItem>
                    <SelectItem value="billing">Billing / Tagihan</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritas</Label>
                <Select name="priority" defaultValue="medium" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea 
                id="description" 
                name="description" 
                required 
                placeholder="Jelaskan secara detail masalah atau pertanyaan Anda..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Lampiran (Opsional)</Label>
              <Input 
                id="attachment" 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept="image/*,.pdf,.doc,.docx"
              />
              <p className="text-xs text-muted-foreground">Maksimal 10MB. Format: Gambar atau Dokumen.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={createTicket.isPending}>
                {createTicket.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Kirim Tiket
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
