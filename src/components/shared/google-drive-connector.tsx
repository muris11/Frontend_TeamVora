"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { HardDrive, Unplug, Loader2 } from "lucide-react";

export function GoogleDriveConnector() {
  const { data: session, status } = useSession();
  
  const isConnected = status === "authenticated" && (session as any)?.accessToken;
  const email = session?.user?.email;

  const handleConnect = async () => {
    await signIn("google");
  };

  const handleDisconnect = async () => {
    await signOut({ redirect: false });
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
          <Button onClick={handleConnect} disabled={status === "loading"} size="sm">
            {status === "loading" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <HardDrive className="w-4 h-4 mr-2" />}
            Hubungkan Drive
          </Button>
        )}
      </div>
    </div>
  );
}
