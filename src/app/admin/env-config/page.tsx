"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileKey,
  Save,
  Pencil,
  X,
  Shield,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { PageTitle } from "@/components/shared/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface EnvVar {
  value: string;
  masked: boolean;
  line: number;
}

type EnvConfig = Record<string, EnvVar>;

const categories: Record<string, string[]> = {
  "App & Environment": ["APP_", "APP_ENV", "APP_DEBUG", "APP_URL", "APP_NAME", "LOG_", "BCRYPT"],
  Database: ["DB_", "DATABASE"],
  Cache: ["CACHE_", "REDIS_", "MEMCACHED"],
  Session: ["SESSION_"],
  Queue: ["QUEUE_"],
  Mail: ["MAIL_"],
  "AWS / S3": ["AWS_", "FILESYSTEM"],
  Broadcasting: ["BROADCAST_", "REVERB_", "PUSHER_"],
  Storage: ["S3_", "R2_"],
};

function categorizeKey(key: string): string {
  for (const [cat, prefixes] of Object.entries(categories)) {
    for (const prefix of prefixes) {
      if (key.toUpperCase().startsWith(prefix) || key.toUpperCase().includes(prefix)) return cat;
    }
  }
  return "Lainnya";
}

export default function AdminEnvConfigPage() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const { data: config, isLoading } = useQuery({
    queryKey: ["env-config"],
    queryFn: async () => {
      const res = await api.get("/admin/env-config");
      return res.data.data as EnvConfig;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (settings: Record<string, string>) =>
      api.put("/admin/env-config", { settings }),
    onSuccess: () => {
      toast.success("Konfigurasi .env berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["env-config"] });
      setEditMode(false);
      setEditedValues({});
    },
    onError: () => toast.error("Gagal memperbarui konfigurasi .env"),
  });

  const handleValueChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(editedValues);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedValues({});
  };

  const groupedConfig: Record<string, Array<{ key: string; env: EnvVar }>> = {};
  if (config) {
    for (const [key, env] of Object.entries(config)) {
      const cat = categorizeKey(key);
      if (!groupedConfig[cat]) groupedConfig[cat] = [];
      groupedConfig[cat].push({ key, env });
    }
  }
  for (const cat of Object.keys(groupedConfig)) {
    groupedConfig[cat].sort((a, b) => a.key.localeCompare(b.key));
  }

  const categoryOrder = [
    "App & Environment",
    "Database",
    "Cache",
    "Session",
    "Queue",
    "Mail",
    "AWS / S3",
    "Broadcasting",
    "Storage",
    "Lainnya",
  ];

  const hasChanges = Object.keys(editedValues).length > 0;

  return (
    <div className="space-y-8 pb-10">
      <PageTitle title="Konfigurasi .env" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-amber-500" />
            <span>SEMUA DATA DITAMPILKAN TERMASUK SENSITIF</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel} className="rounded-xl">
                <X className="h-4 w-4" />
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || updateMutation.isPending}
                className="rounded-xl"
              >
                {updateMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 h-4" />
                )}
                {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="rounded-xl">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border/50 shadow-sm">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {categoryOrder.map((cat) => {
            const items = groupedConfig[cat];
            if (!items || items.length === 0) return null;
            return (
              <Card key={cat} className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileKey className="h-4 w-4 text-muted-foreground" />
                    {cat}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {items.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map(({ key, env }) => (
                      <div key={key} className="grid gap-1.5">
                        <Label htmlFor={`env-${key}`} className="text-xs font-mono text-muted-foreground">
                          {key}
                        </Label>
                        <Input
                          id={`env-${key}`}
                          value={editMode && editedValues[key] !== undefined ? editedValues[key] : env.value}
                          readOnly={!editMode}
                          onChange={(e) => handleValueChange(key, e.target.value)}
                          className={`font-mono text-sm h-9 ${
                            editMode && editedValues[key] !== undefined
                              ? "border-primary/50 bg-background"
                              : "bg-muted/30"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {editMode && hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="border-amber-500/20 bg-amber-500/5 shadow-lg">
            <CardContent className="px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-700 dark:text-amber-500">
                {Object.keys(editedValues).length} perubahan belum disimpan.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
