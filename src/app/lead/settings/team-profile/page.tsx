"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Users, Camera, Loader2, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageTitle } from "@/components/shared/page-title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MediaPicker } from "@/components/shared/media-picker";

const teamSchema = z.object({
  name: z.string().min(2, "Nama tim minimal 2 karakter"),
  description: z.string().optional(),
});

type TeamForm = z.infer<typeof teamSchema>;

export default function TeamProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const queryClient = useQueryClient();

  const teamForm = useForm<TeamForm>({
    resolver: zodResolver(teamSchema),
    values: { name: user?.team?.name || "", description: user?.team?.description || "" },
  });

  const updateTeamMutation = useMutation({
    mutationFn: (data: TeamForm & { logo_url?: string }) => api.put("/teams/settings", data),
    onSuccess: (res) => {
      const updatedTeam = res.data.data || res.data;
      if (user && token) {
        setAuth({ ...user, team: updatedTeam }, token);
      }
      toast.success("Profil tim berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui profil tim"),
  });

  const handleMediaSelect = (url: string) => {
    updateTeamMutation.mutate({
      name: teamForm.getValues("name"),
      description: teamForm.getValues("description"),
      logo_url: url
    });
  };

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);
      const res = await api.post("/teams/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data || res.data;
    },
    onSuccess: (updatedTeam) => {
      if (user && token) {
        setAuth({ ...user, team: updatedTeam }, token);
      }
      toast.success("Logo tim berhasil diperbarui");
    },
    onError: () => toast.error("Gagal mengunggah logo tim. Maksimal 5MB."),
  });

  if (!user?.team) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const joinedDate = user.team.created_at ? format(new Date(user.team.created_at), "dd MMMM yyyy", { locale: id }) : "Baru saja";
  const initials = user.team.name.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageTitle title="Pengaturan Tim | TeamVora Lead" />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Tim</h1>
        <p className="text-muted-foreground">Kelola identitas dan informasi tim Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Info Singkat */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-8 relative px-6 pb-6 text-center">
              <div className="flex flex-col items-center mb-4">
                <div className="relative group cursor-pointer mb-4">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-sm rounded-xl">
                    <AvatarImage src={user?.team?.logo_url || ""} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary rounded-xl">
                      {user?.team?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="rounded-full shadow-sm w-8 h-8 relative"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadLogoMutation.isPending}
                  >
                    {uploadLogoMutation.isPending ? "Mengunggah..." : "Upload Logo"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    disabled={uploadLogoMutation.isPending}
                  >
                    Pilih dari Media
                  </Button>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadLogoMutation.mutate(file);
                    }
                    e.target.value = '';
                  }}
                />
              </div>
              <h2 className="text-xl font-bold">{user?.team?.name}</h2>
              <p className="text-muted-foreground text-sm mb-3">ID: {user?.team?.id}</p>
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 mr-1 text-primary" />
                Ketua: {user.name}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Slug: {user.team.slug}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Dibuat: {joinedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Form Edit */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>
                Perbarui nama dan deskripsi tim Anda. Nama ini akan terlihat oleh semua anggota.
              </CardDescription>
            </CardHeader>
            <Form {...teamForm}>
              <form onSubmit={teamForm.handleSubmit((d) => updateTeamMutation.mutate(d))}>
                <CardContent className="space-y-4">
                  <FormField
                    control={teamForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Tim</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama tim" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Singkat (Opsional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Fokus atau tujuan tim Anda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6 bg-muted/20">
                  <Button 
                    type="submit" 
                    disabled={updateTeamMutation.isPending || !teamForm.formState.isDirty}
                  >
                    {updateTeamMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
      
      <MediaPicker 
        open={showMediaPicker} 
        onOpenChange={setShowMediaPicker} 
        onSelect={handleMediaSelect} 
      />
    </div>
  );
}
