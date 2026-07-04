"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Lock, User as UserIcon, Camera, Loader2, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageTitle } from "@/components/shared/page-title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  current_password: z.string().min(1, "Password lama wajib diisi"),
  password: z.string().min(8, "Password baru minimal 8 karakter"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Password tidak cocok",
  path: ["password_confirmation"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name || "", email: user?.email || "", phone: user?.phone || "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileForm) => api.put("/profile", data),
    onSuccess: (res) => {
      const updated = res.data.data || res.data;
      if (token) setAuth(updated, token);
      toast.success("Profil berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui profil"),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: PasswordForm) => api.put("/password", data),
    onSuccess: () => {
      toast.success("Password berhasil diubah");
      passwordForm.reset();
    },
    onError: () => toast.error("Gagal mengubah password. Pastikan password lama benar."),
  });

  const joinedDate = user?.created_at ? format(new Date(user.created_at), "dd MMMM yyyy", { locale: id }) : "Baru saja";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageTitle title="Pengaturan Profil | TeamVora Admin" />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Profil</h1>
        <p className="text-muted-foreground">Kelola informasi pribadi dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Profile Card */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/80 to-primary"></div>
            <CardContent className="pt-0 relative px-6 pb-6 text-center">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="relative group cursor-pointer">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Future enhancement: add avatar upload */}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground text-sm mb-3">{user?.email}</p>
              
              <div className="flex justify-center mb-6">
                <Badge variant="secondary" className="px-3 py-1 text-xs capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  {user?.roles?.[0] || "User"}
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-3 text-foreground/70" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-3 text-foreground/70" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-3 text-foreground/70" />
                  <span>Bergabung {joinedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Profile Form */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Informasi Dasar
              </CardTitle>
              <CardDescription>Perbarui nama, email, dan nomor telepon Anda.</CardDescription>
            </CardHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit((d) => updateProfileMutation.mutate(d))}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Email</FormLabel>
                        <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl><Input placeholder="+62 812..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t border-border/50 flex justify-end py-4">
                  <Button type="submit" disabled={updateProfileMutation.isPending} className="rounded-xl px-6">
                    {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Simpan Perubahan
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          {/* Password Form */}
          <Card className="border-border/50 shadow-sm border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-destructive" />
                Keamanan & Sandi
              </CardTitle>
              <CardDescription>Pastikan akun Anda menggunakan kata sandi yang kuat.</CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit((d) => updatePasswordMutation.mutate(d))}>
                <CardContent className="space-y-4">
                  <FormField control={passwordForm.control} name="current_password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kata Sandi Saat Ini</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={passwordForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Baru</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={passwordForm.control} name="password_confirmation" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Sandi Baru</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
                <CardFooter className="bg-destructive/5 border-t border-destructive/10 flex justify-end py-4">
                  <Button type="submit" variant="destructive" disabled={updatePasswordMutation.isPending} className="rounded-xl px-6">
                    {updatePasswordMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                    Perbarui Sandi
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

        </div>
      </div>
    </div>
  );
}
