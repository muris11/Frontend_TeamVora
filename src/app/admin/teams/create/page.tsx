"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/shared/page-title";

const teamSchema = z.object({
  name: z.string().min(1, "Nama tim wajib diisi"),
  description: z.string().optional(),
  leader_id: z.number().min(1, "Pilih leader tim"),
});

type TeamForm = z.infer<typeof teamSchema>;

export default function AdminTeamCreatePage() {
  const router = useRouter();

  const { data: users } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await api.get("/members");
      return res.data.users || [];
    },
  });

  const form = useForm<TeamForm>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: "", description: "", leader_id: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (data: TeamForm) => api.post("/teams", data),
    onSuccess: () => {
      toast.success("Tim berhasil dibuat");
      router.push("/admin/teams");
    },
    onError: () => toast.error("Gagal membuat tim"),
  });

  return (
    <div className="space-y-4">
      <PageTitle title="Buat Tim" />
      <div className="flex items-center gap-4">
        <Link href="/admin/teams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Buat Tim Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Tim</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => createMutation.mutate(d))}
              className="space-y-4 max-w-2xl"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Tim</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Tim Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deskripsi singkat tim..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leader_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leader Tim</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih leader" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(users || []).map((u: { id: number; name: string }) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Membuat..." : "Buat Tim"}
                </Button>
                <Link href="/admin/teams">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
