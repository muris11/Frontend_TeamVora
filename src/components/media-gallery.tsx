"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UploadCloud, Trash2, Image as ImageIcon, FileText } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatBytes } from "@/lib/utils";

type Media = {
  id: string;
  name: string;
  file_path: string;
  size: number;
  mime_type: string;
  type: 'document' | 'gallery';
  user: {
    id: number;
    name: string;
  };
  created_at: string;
};

export function MediaGallery({ title, description, role }: { title: string, description: string, role: 'admin' | 'lead' }) {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'documents'>('gallery');

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === 'gallery' ? '/media/gallery' : '/media/documents';
      const response = await api.get(endpoint, { params: { role } });
      setMedia(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [activeTab]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", activeTab === 'gallery' ? 'gallery' : 'document');
    formData.append("role", role);

    setIsUploading(true);
    try {
      await api.post('/media', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("File berhasil diunggah");
      fetchMedia();
    } catch (error) {
      toast.error("Gagal mengunggah file");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus file ini?")) return;
    
    try {
      await api.delete(`/media/${id}`);
      toast.success("File dihapus");
      setMedia(media.filter(m => m.id !== id));
    } catch (error) {
      toast.error("Gagal menghapus file");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL disalin ke clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-muted p-1 rounded-lg flex gap-1">
            <Button 
              variant={activeTab === 'gallery' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('gallery')}
            >
              <ImageIcon className="w-4 h-4 mr-2" /> Gallery
            </Button>
            <Button 
              variant={activeTab === 'documents' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('documents')}
            >
              <FileText className="w-4 h-4 mr-2" /> Dokumen
            </Button>
          </div>
          <div className="relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isUploading}
              accept={activeTab === 'gallery' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx'}
            />
            <Button disabled={isUploading}>
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
              Upload File
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
          <UploadCloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Belum ada file</h3>
          <p className="text-muted-foreground">Silakan upload file pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden group relative">
              <div 
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-center items-center gap-2 cursor-pointer"
                onClick={() => handleCopyUrl(item.file_path)}
              >
                <span className="text-white font-medium text-sm">Salin URL</span>
              </div>
              <div className="absolute top-2 right-2 z-20">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="aspect-square bg-muted flex items-center justify-center p-2 relative overflow-hidden">
                {activeTab === 'gallery' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.file_path} alt={item.name} className="object-cover w-full h-full rounded-md" />
                ) : (
                  <FileText className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate" title={item.name}>{item.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{formatBytes(item.size)}</span>
                  <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                    {item.user.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
