"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, ImageIcon, X, Search, Check } from "lucide-react";
import api from "@/lib/api";
import { TeamMedia } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatFileSize } from "@/lib/format";

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  type?: "gallery" | "document";
}

export function MediaPicker({ open, onOpenChange, onSelect, type = "gallery" }: MediaPickerProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["media-picker", type],
    queryFn: async () => {
      const endpoint = type === "gallery" ? "/media/gallery" : "/media/documents";
      const res = await api.get(endpoint);
      return res.data.data || res.data || [];
    },
    enabled: open,
  });

  const items = (Array.isArray(data) ? data : []) as TeamMedia[];
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = () => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected) {
      onSelect(selected.file_path || selected.file_url || "");
      onOpenChange(false);
      setSelectedId(null);
      setSearch("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih dari Media</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px]">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm">Belum ada media</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                    selectedId === item.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                >
                  {type === "gallery" && item.file_path ? (
                    <img
                      src={item.file_path}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {selectedId === item.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{item.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSelect} disabled={!selectedId}>
            Pilih
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
