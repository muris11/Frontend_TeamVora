"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UploadCloud, Trash2, Image as ImageIcon, FileText, Database } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatBytes } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { getGoogleDriveStorageInfo, fetchGoogleDriveFiles, uploadToGoogleDrive, deleteGoogleDriveFile } from "@/lib/google-drive";

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

export function MediaGallery({ title, description, role, combined }: { title: string, description: string, role: 'admin' | 'lead' | 'member', combined?: boolean }) {
  const { data: session, status } = useSession();
  const accessToken = status === "authenticated" ? (session as any)?.accessToken : null;
  const isDriveConnected = !!accessToken && (session as any)?.error !== "RefreshAccessTokenError";

  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'documents'>('gallery');
  const [storageSource, setStorageSource] = useState<'default' | 'drive' | 'both'>(isDriveConnected ? 'both' : 'default');
  
  const [maxStorage, setMaxStorage] = useState<number>(10 * 1024 * 1024); // 10MB default
  
  // Update state when connection changes
  useEffect(() => {
    if (!isDriveConnected && storageSource !== 'default') {
      setStorageSource('default');
    } else if (isDriveConnected && storageSource === 'default') {
      setStorageSource('both');
    }
  }, [isDriveConnected]);

  const totalUsedStorage = media.reduce((acc, item) => acc + item.size, 0);
  const storagePercentage = Math.min(100, (totalUsedStorage / (storageSource === 'default' ? 10 * 1024 * 1024 : maxStorage)) * 100);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      let mappedDriveMedia: Media[] = [];
      let defaultMedia: Media[] = [];

      if (isDriveConnected && (storageSource === 'drive' || storageSource === 'both')) {
        const quota = await getGoogleDriveStorageInfo(accessToken);
        setMaxStorage(quota.limit);
        
        const driveFiles = await fetchGoogleDriveFiles(accessToken);
        mappedDriveMedia = driveFiles.map((f: any) => ({
          id: f.id,
          name: f.name,
          file_path: f.thumbnailLink || f.webViewLink || "",
          size: parseInt(f.size || "0", 10),
          mime_type: f.mimeType,
          type: f.mimeType.startsWith('image/') ? 'gallery' : 'document',
          user: { id: 0, name: session?.user?.name || "Drive User" },
          created_at: new Date().toISOString(),
        }));
      }

      if (storageSource === 'default' || storageSource === 'both') {
        const endpoint = combined ? '/media' : (activeTab === 'gallery' ? '/media/gallery' : '/media/documents');
        const response = await api.get(endpoint, { params: { role } });
        defaultMedia = response.data.data;
        if (storageSource === 'default') {
          setMaxStorage(10 * 1024 * 1024);
        }
      }

      let combinedMedia = [];
      if (storageSource === 'drive') combinedMedia = mappedDriveMedia;
      else if (storageSource === 'default') combinedMedia = defaultMedia;
      else combinedMedia = [...mappedDriveMedia, ...defaultMedia];

      if (!combined) {
        setMedia(combinedMedia.filter(m => activeTab === 'gallery' ? m.type === 'gallery' : m.type === 'document'));
      } else {
        setMedia(combinedMedia);
      }
    } catch (error) {
      toast.error("Gagal memuat media");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchMedia();
    }
  }, [activeTab, status, storageSource]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isUploadingToDrive = isDriveConnected && (storageSource === 'drive' || storageSource === 'both');
    const currentLimit = isUploadingToDrive ? maxStorage : (10 * 1024 * 1024);

    if (totalUsedStorage + file.size > currentLimit) {
      toast.error(`Sisa kapasitas penyimpanan tidak cukup. Maksimal: ${formatBytes(currentLimit)}`);
      return;
    }

    setIsUploading(true);
    try {
      if (isUploadingToDrive) {
        await uploadToGoogleDrive(accessToken, file);
        toast.success("File berhasil diunggah ke Google Drive");
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);
        let uploadType = activeTab === 'gallery' ? 'gallery' : 'document';
        if (combined) {
          uploadType = file.type.startsWith('image/') ? 'gallery' : 'document';
        }
        formData.append("type", uploadType);
        formData.append("role", role);

        await api.post('/media', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("File berhasil diunggah");
      }
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
      const isDriveId = isNaN(Number(id));
      if (isDriveId) {
        await deleteGoogleDriveFile(accessToken, id);
      } else {
        await api.delete(`/media/${id}`);
      }
      toast.success("File dihapus");
      setMedia(media.filter(m => m.id !== id));
    } catch (error) {
      toast.error("Gagal menghapus file");
      console.error(error);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL disalin ke clipboard!");
  };

  const renderMediaCard = (item: Media) => (
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
        {item.type === 'gallery' || item.mime_type?.startsWith('image/') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.file_path} alt={item.name} loading="lazy" className="object-cover w-full h-full rounded-md" />
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
  );

  return (
    <div className="space-y-6">
      {isDriveConnected && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-center justify-between text-sm shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full hidden sm:block"><Database className="w-4 h-4 text-green-600" /></div>
            <div>
              <p className="font-semibold text-green-800">Terkoneksi ke Google Drive</p>
              <p className="text-xs text-green-700/80 hidden sm:block">Sinkronisasi otomatis dengan {session?.user?.email}</p>
            </div>
          </div>
          <div className="flex bg-white rounded-md border border-green-200 shadow-sm p-1">
            <button 
              onClick={() => setStorageSource('default')} 
              className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${storageSource === 'default' ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground font-medium'}`}
            >Lokal</button>
            <button 
              onClick={() => setStorageSource('drive')} 
              className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${storageSource === 'drive' ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground font-medium'}`}
            >Drive</button>
            <button 
              onClick={() => setStorageSource('both')} 
              className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${storageSource === 'both' ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground font-medium'}`}
            >Keduanya</button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div className="flex flex-col gap-1.5 w-full md:max-w-md">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <Database className="w-3.5 h-3.5" /> Kapasitas 
                {storageSource === 'default' ? " (Lokal)" : storageSource === 'drive' ? " (Drive)" : " (Total Gabungan)"}
              </span>
              <span className="font-medium">
                {formatBytes(totalUsedStorage)} / {formatBytes(storageSource === 'default' ? 10 * 1024 * 1024 : maxStorage)}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${storagePercentage > 90 ? 'bg-destructive' : 'bg-primary'}`}
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          {!combined && (
            <div className="bg-muted p-1 rounded-lg flex gap-1 w-full lg:w-auto">
              <Button 
                variant={activeTab === 'gallery' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('gallery')}
                className="flex-1 lg:flex-none"
              >
                <ImageIcon className="w-4 h-4 mr-2" /> Gallery
              </Button>
              <Button 
                variant={activeTab === 'documents' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('documents')}
                className="flex-1 lg:flex-none"
              >
                <FileText className="w-4 h-4 mr-2" /> Dokumen
              </Button>
            </div>
          )}
          <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
            <div className="relative w-full">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileUpload}
                disabled={isUploading}
                accept={combined ? 'image/*,.pdf,.doc,.docx,.xls,.xlsx' : (activeTab === 'gallery' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx')}
              />
              <Button disabled={isUploading} className="w-full">
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                Upload File
              </Button>
            </div>
            <span className="text-[10px] text-muted-foreground mr-1 text-right w-full">
              {storageSource === 'default' ? "Disimpan ke Lokal (Maks 10MB)" : "Disimpan ke Google Drive"}
            </span>
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
        <div className="space-y-8">
          {combined ? (
            <>
              {media.some(m => m.type === 'gallery' || m.mime_type?.startsWith('image/')) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-muted-foreground"/> Gambar</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {media.filter(m => m.type === 'gallery' || m.mime_type?.startsWith('image/')).map(renderMediaCard)}
                  </div>
                </div>
              )}
              {media.some(m => m.type === 'document' && !m.mime_type?.startsWith('image/')) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 mt-8"><FileText className="w-5 h-5 text-muted-foreground"/> Dokumen</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {media.filter(m => m.type === 'document' && !m.mime_type?.startsWith('image/')).map(renderMediaCard)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {media.map(renderMediaCard)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
