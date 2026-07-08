"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface BlogPreviewProps {
  title: string;
  category: string;
  content: string;
  coverUrl?: string;
  authorName?: string;
}

export function BlogPreview({ title, category, content, coverUrl, authorName = "Author Name" }: BlogPreviewProps) {
  return (
    <article className="max-w-3xl mx-auto py-10 bg-background rounded-xl border p-8 shadow-sm">
      <div className="space-y-4 text-center mb-10">
        {category && (
          <Badge variant="secondary" className="mb-4">
            {category}
          </Badge>
        )}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {title || "Judul Artikel"}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
              {authorName.substring(0, 2).toUpperCase()}
            </div>
            <span>{authorName}</span>
          </div>
          <span>•</span>
          <time dateTime={new Date().toISOString()}>
            {format(new Date(), "dd MMMM yyyy", { locale: id })}
          </time>
        </div>
      </div>

      {coverUrl && (
        <div className="mb-10 rounded-2xl overflow-hidden bg-muted aspect-video relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={coverUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-img:rounded-xl prose-img:shadow-md mx-auto"
        dangerouslySetInnerHTML={{ __html: content || "<p class='text-muted-foreground italic text-center'>Konten kosong</p>" }}
      />
    </article>
  );
}
