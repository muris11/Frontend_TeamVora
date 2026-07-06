"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { TeamMedia } from "@/types";

interface MediaPickerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (url: string) => void;
  type?: string;
  // Input mode props
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export function MediaPicker({ 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange, 
  onSelect, 
  type,
  value,
  onChange,
  placeholder 
}: MediaPickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isInputMode = value !== undefined && onChange !== undefined;
  
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const onOpenChange = externalOnOpenChange || setInternalOpen;

  const { data, isLoading } = useQuery({
    queryKey: ["media", "gallery"],
    queryFn: async () => {
      const res = await api.get("/media/gallery");
      return res.data.data || res.data;
    },
    enabled: open,
  });

  const mediaList = (Array.isArray(data) ? data : []) as TeamMedia[];

  const handleSelect = (url: string) => {
    if (onSelect) onSelect(url);
    if (onChange) onChange(url);
    onOpenChange(false);
  };

  const dialogContent = (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pilih dari Media Tim</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : mediaList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Galeri tim masih kosong.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {mediaList.map((media) => (
              <div 
                key={media.id} 
                className="group relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => handleSelect(media.file_path || "")}
              >
                <img 
                  src={media.file_path || ""} 
                  alt={media.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-sm font-medium px-2 text-center line-clamp-1">{media.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (isInputMode) {
    return (
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Pilih media..."}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(true)}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Pilih
        </Button>
        {dialogContent}
      </div>
    );
  }

  return dialogContent;
}
