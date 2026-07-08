"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Lock, User as UserIcon, Camera, Loader2, ShieldCheck, Mail, Phone, Calendar, Database, CheckCircle, XCircle } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
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
import { MediaPicker } from "@/components/shared/media-picker";
import { formatBytes } from "@/lib/utils";
import { getGoogleDriveStorageInfo } from "@/lib/google-drive";

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
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  const isDriveConnected = status === "authenticated" && (session as any)?.accessToken && (session as any)?.error !== "RefreshAccessTokenError";
  const driveEmail = session?.user?.email;

  const { data: driveQuota, isLoading: quotaLoading } = useQuery({
    queryKey: ['drive-quota', (session as any)?.accessToken],
    queryFn: async () => {
      if (!(session as any)?.accessToken) return null;
      return await getGoogleDriveStorageInfo((session as any).accessToken);
    },
    enabled: !!isDriveConnected,
    retry: false,
  });

  const handleConnectDrive = async () => {
    await signIn("google");
  };

  const handleDisconnectDrive = async () => {
    await signOut({ redirect: false });
    toast.success("Koneksi Google Drive diputus");
  };

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

  const handleMediaSelect = (url: string) => {
    updateProfileMutation.mutate({
      name: profileForm.getValues("name"),
      email: profileForm.getValues("email"),
      phone: profileForm.getValues("phone"),
      avatar_url: url
    } as any);
  };

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data || res.data;
    },
    onSuccess: (updated) => {
      if (token) setAuth(updated, token);
      toast.success("Avatar berhasil diperbarui");
    },
    onError: () => toast.error("Gagal mengunggah avatar. Maksimal 2MB."),
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
      <PageTitle title="Pengaturan Profil | TeamVora Lead" />
      
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
              <div className="flex flex-col items-center -mt-12 mb-4">
                <div className="relative group cursor-pointer mb-4">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {user?.name?.charAt(0).toUpperCase()}
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
                    disabled={uploadAvatarMutation.isPending}
                  >
                    {uploadAvatarMutation.isPending ? "Mengunggah..." : "Upload Foto"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    disabled={uploadAvatarMutation.isPending}
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
                      uploadAvatarMutation.mutate(file);
                    }
                    e.target.value = '';
                  }}
                />
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
          
          {/* Google Drive Integration */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                Integrasi Google Drive
              </CardTitle>
              <CardDescription>Hubungkan akun Google Drive untuk menyimpan media tim langsung ke Drive Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-muted/30">
                <div className="flex flex-col mb-4 sm:mb-0">
                  <span className="font-medium flex items-center gap-2">
                    Status: 
                    {isDriveConnected ? (
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Terhubung</span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1"><XCircle className="w-4 h-4" /> Belum terhubung</span>
                    )}
                  </span>
                  {isDriveConnected && driveEmail && (
                    <span className="text-sm text-muted-foreground mt-1">Akun: {driveEmail}</span>
                  )}
                  <span className="text-xs text-muted-foreground mt-2">
                    {isDriveConnected ? (
                      quotaLoading ? "Memuat kapasitas media..." :
                      driveQuota ? `Kapasitas media ditingkatkan hingga ${formatBytes(driveQuota.limit)}.` : "Kapasitas media bergantung pada batas akun Google Anda."
                    ) : "Kapasitas media saat ini terbatas 10 MB."}
                  </span>
                </div>
                <div>
                  {isDriveConnected ? (
                    <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDisconnectDrive}>
                      Putuskan Koneksi
                    </Button>
                  ) : (
                    <Button onClick={handleConnectDrive} className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
                      Hubungkan Google Drive
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
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
                      <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={passwordForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Baru</FormLabel>
                        <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={passwordForm.control} name="password_confirmation" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Sandi Baru</FormLabel>
                        <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
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
      
      <MediaPicker 
        open={showMediaPicker} 
        onOpenChange={setShowMediaPicker} 
        onSelect={handleMediaSelect} 
      />
    </div>
  );
}
