"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, UserPlus, Trash2, Mail } from "lucide-react";
import api from "@/lib/api";
import { User } from "@/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTitle } from "@/components/shared/page-title";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

export function TeamMembersPage({ basePath }: { basePath: string }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["team-members", user?.team_id],
    queryFn: async () => {
      if (!user?.team_id) return [];
      const res = await api.get(`/teams/${user.team_id}/members`);
      return res.data.data || [];
    },
    enabled: !!user?.team_id,
  });

  const members = (Array.isArray(data) ? data : []) as User[];

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.team_id) throw new Error("No team");
      const res = await api.post(`/teams/${user.team_id}/invitations`, { email: inviteEmail });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Undangan berhasil dikirim.");
      setInviteEmail("");
      setShowInvite(false);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal mengirim undangan.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!user?.team_id) throw new Error("No team");
      await api.delete(`/teams/${user.team_id}/members/${id}`);
    },
    onSuccess: () => {
      toast.success("Anggota berhasil dihapus.");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal menghapus anggota.");
    },
  });

  const isLeader = user?.role === "team_leader" || user?.role === "super_admin";

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Anggota Tim" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/dashboard`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Anggota Tim</h1>
          <p className="text-sm text-muted-foreground">Kelola anggota dalam tim Anda.</p>
        </div>
        {isLeader && (
          <Button onClick={() => setShowInvite(!showInvite)}>
            <UserPlus className="w-4 h-4 mr-2" /> Undang
          </Button>
        )}
      </div>

      {showInvite && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Undang Anggota</CardTitle>
            <CardDescription>Masukkan email untuk mengundang anggota baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@contoh.com"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={() => inviteMutation.mutate()}
                  disabled={!inviteEmail || inviteMutation.isPending}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {inviteMutation.isPending ? "Mengirim..." : "Kirim Undangan"}
                </Button>
                <Button variant="outline" onClick={() => { setShowInvite(false); setInviteEmail(""); }}>
                  Batal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={[
          {
            key: "name",
            header: "Nama",
            render: (item: User) => (
              <div className="flex items-center gap-3">
                {item.avatar_url ? (
                  <img src={item.avatar_url} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{item.name}</span>
              </div>
            ),
          },
          { key: "email", header: "Email" },
          {
            key: "role",
            header: "Role",
            render: (item: User) => (
              <StatusBadge status={item.role === "team_leader" ? "active" : item.role === "super_admin" ? "high" : "inactive"} />
            ),
          },
          {
            key: "created_at",
            header: "Bergabung",
            render: (item: User) => formatDate(item.created_at),
          },
          ...(isLeader
            ? [
                {
                  key: "actions",
                  header: "",
                  render: (item: User) => (
                    item.id !== user?.id ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDeleteId(item.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : null
                  ),
                },
              ]
            : []),
        ]}
        data={members}
        isLoading={isLoading}
        emptyMessage="Belum ada anggota tim"
      />

      {!isLoading && members.length === 0 && (
        <EmptyState
          title="Belum ada anggota"
          description="Undang anggota pertama untuk memulai kerja sama tim."
          action={
            isLeader ? (
              <Button onClick={() => setShowInvite(true)}>
                <UserPlus className="w-4 h-4 mr-2" /> Undang Anggota
              </Button>
            ) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Hapus Anggota"
        description="Apakah Anda yakin ingin menghapus anggota ini dari tim?"
        onConfirm={() => deleteId && removeMutation.mutate(deleteId)}
        variant="destructive"
        confirmLabel="Hapus"
      />
    </div>
  );
}
