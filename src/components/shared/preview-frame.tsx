"use client";

import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PreviewFrameProps {
  url: string;
  title: string;
}

export function PreviewFrame({ url, title }: PreviewFrameProps) {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setKey((k) => k + 1)}
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => window.open(url, "_blank")}
            title="Buka di tab baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <div className="border rounded-xl overflow-hidden bg-background shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono truncate flex-1">{url}</span>
        </div>
        <iframe
          key={key}
          src={url}
          title={title}
          className="w-full h-[500px] border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
