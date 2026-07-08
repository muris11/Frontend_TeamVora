"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  connectGoogleDrive, 
  disconnectGoogleDrive, 
  isGoogleDriveConnected, 
  getConnectedEmail 
} from "@/lib/google-drive";
import { toast } from "sonner";
import { Loader2, HardDrive, Unplug } from "lucide-react";

export function GoogleDriveConnector() {
  const [isConnected, setIsConnected] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsConnected(isGoogleDriveConnected());
    setEmail(getConnectedEmail());
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectGoogleDrive();
      setIsConnected(true);
      setEmail(getConnectedEmail());
      toast.success("Berhasil terhubung ke Google Drive");
    } catch (e) {
      toast.error("Gagal terhubung ke Google Drive");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectGoogleDrive();
    setIsConnected(false);
    setEmail(null);
    toast.info("Terputus dari Google Drive");
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${isConnected ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500"}`}>
          <HardDrive className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Integrasi Google Drive</h3>
          {isConnected ? (
            <p className="text-xs text-muted-foreground mt-0.5">
              Terhubung sebagai <span className="font-medium text-foreground">{email}</span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              Hubungkan akun untuk akses file tim langsung dari Drive.
            </p>
          )}
        </div>
      </div>
      <div>
        {isConnected ? (
          <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            <Unplug className="w-4 h-4 mr-2" />
            Putuskan
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={loading} size="sm">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <HardDrive className="w-4 h-4 mr-2" />}
            Hubungkan Drive
          </Button>
        )}
      </div>
    </div>
  );
}
