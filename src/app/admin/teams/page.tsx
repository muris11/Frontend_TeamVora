"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Users, Pencil, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { Team } from "@/types";
import { formatDate } from "@/lib/format";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTitle } from "@/components/shared/page-title";

export default function AdminTeamsPage() {
  const queryClient = useQueryClient();
  const [deleteItem, setDeleteItem] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const res = await api.get("/teams");
      return res.data.data || [];
    },
  });

  const { data: users } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await api.get("/members");
      return res.data.users || [];
    },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["team-members", selectedTeam?.id],
    queryFn: async () => {
      if (!selectedTeam) return [];
      const res = await api.get(`/teams/${selectedTeam.id}/members`);
      return res.data.data || [];
    },
    enabled: !!selectedTeam,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/teams/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Tim berhasil dihapus");
      setDeleteItem(null);
    },
    onError: () => toast.error("Gagal menghapus tim"),
  });

  const inviteMutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      api.post(`/teams/${teamId}/invite`, { user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Anggota berhasil ditambahkan");
    },
    onError: () => toast.error("Gagal menambahkan anggota"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
      api.delete(`/teams/${teamId}/members/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Anggota berhasil dihapus");
    },
    onError: () => toast.error("Gagal menghapus anggota"),
  });

  const columns = [
    {
      key: "name",
      header: "Nama Tim",
      render: (item: Team) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.description || "-"}</p>
        </div>
      ),
    },
    {
      key: "leader",
      header: "Leader",
      render: (item: Team) => item.leader?.name || "-",
    },
    {
      key: "members_count",
      header: "Anggota",
      render: (item: Team) => (
        <Badge variant="secondary">{item.members_count || 0} orang</Badge>
      ),
    },
    {
      key: "created_at",
      header: "Dibuat",
      render: (item: Team) => formatDate(item.created_at),
    },
    {
      key: "actions",
      header: "",
      render: (item: Team) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => setSelectedTeam(item)}>
            <Users className="mr-1 h-3 w-3" /> Kelola
          </Button>
          <Link
            href={`/admin/teams/${item.id}/edit`}
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Button size="icon" variant="ghost" onClick={() => setDeleteItem(item)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Kelola Tim" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Tim</h1>
          <p className="text-sm text-muted-foreground">Buat dan kelola seluruh tim dalam platform</p>
        </div>
        <Link
          href="/admin/teams/create"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />Buat Tim
        </Link>
      </div>

      <DataTable columns={columns} data={teams || []} isLoading={isLoading} emptyMessage="Belum ada tim" />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        title="Hapus Tim"
        description={`Hapus tim "${deleteItem?.name}"? Semua anggota akan dilepas dari tim.`}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        confirmLabel="Hapus"
        variant="destructive"
      />

      <Dialog open={!!selectedTeam} onOpenChange={(v) => { if (!v) setSelectedTeam(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Anggota Tim — {selectedTeam?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select
                onValueChange={(v) => {
                  if (v && selectedTeam) {
                    inviteMutation.mutate({ teamId: selectedTeam.id, userId: Number(v) });
                  }
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Tambah anggota..." />
                </SelectTrigger>
                <SelectContent>
                  {(users || [])
                    .filter((u: { id: number }) =>
                      !(teamMembers || []).some((m: { id: number }) => m.id === u.id)
                    )
                    .map((u: { id: number; name: string }) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {(teamMembers || []).map(
                (member: { id: number; name: string; email: string; role: string }) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "team_leader" ? "default" : "secondary"}>
                        {member.role === "team_leader" ? "Leader" : "Member"}
                      </Badge>
                      {member.role !== "team_leader" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => {
                            if (selectedTeam) {
                              removeMemberMutation.mutate({
                                teamId: selectedTeam.id,
                                userId: member.id,
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
              {(!teamMembers || teamMembers.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada anggota</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
