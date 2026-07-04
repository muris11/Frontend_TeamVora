"use client";

import { useCallback, useRef } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  value?: File | null;
  onClear?: () => void;
}

export function FileUpload({
  onFileSelect,
  accept = "*",
  maxSize = 10 * 1024 * 1024,
  className,
  value,
  onClear,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.size <= maxSize) {
        onFileSelect(file);
      }
    },
    [onFileSelect, maxSize]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size <= maxSize) {
        onFileSelect(file);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [onFileSelect, maxSize]
  );

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (value) {
    return (
      <div className={cn("flex items-center gap-2 rounded-md border p-3", className)}>
        <FileIcon className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 truncate text-sm">{value.name}</span>
        {onClear && (
          <Button variant="ghost" size="icon" onClick={onClear} className="h-6 w-6">
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer hover:border-primary/50 hover:bg-muted/30",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="mb-1 text-sm font-medium">Drag & drop file di sini</p>
      <p className="mb-3 text-xs text-muted-foreground">atau klik untuk memilih</p>
      <Button variant="outline" size="sm" type="button" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
        Pilih File
      </Button>
    </div>
  );
}
