"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { User, Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  teams: Team[];
}

export function UserDialog({ open, onOpenChange, user, teams }: UserDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    team_id: "none",
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        role: user.role || "member",
        team_id: user.team_id ? String(user.team_id) : "none",
      });
    } else if (open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "member",
        team_id: "none",
      });
    }
  }, [user, open]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data };
      if (payload.team_id === "none") {
        payload.team_id = null;
      }
      if (isEditing) {
        if (!payload.password) delete payload.password;
        return api.put(`/members/${user.id}`, payload);
      } else {
        return api.post("/members", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(isEditing ? "User berhasil diperbarui" : "User berhasil ditambahkan");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Tambah User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ubah informasi pengguna di sini."
              : "Tambahkan pengguna baru ke sistem."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Opsional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {isEditing && <span className="text-xs text-muted-foreground">(Kosongkan jika tidak diubah)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              required={!isEditing}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => val && setFormData({ ...formData, role: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="team_leader">Team Leader</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_id">Tim (Opsional)</Label>
            <Select
              value={formData.team_id}
              onValueChange={(val) => val && setFormData({ ...formData, team_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tim" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tanpa Tim</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={String(team.id)}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
