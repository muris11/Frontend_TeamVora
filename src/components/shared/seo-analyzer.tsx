"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { analyzeSeo, type SeoInput, type SeoStatus, seoScoreTone } from "@/lib/seo";

interface SeoAnalyzerCardProps {
  values: SeoInput;
  onChange: (patch: Partial<SeoInput>) => void;
}

const statusIcon: Record<SeoStatus, React.ReactNode> = {
  good: <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />,
  yellow: <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />,
  red: <XCircle className="h-4 w-4 text-red-600 shrink-0" />,
  na: <MinusCircle className="h-4 w-4 text-muted-foreground shrink-0" />,
};

const statusText: Record<SeoStatus, string> = {
  good: "text-green-700",
  yellow: "text-yellow-700",
  red: "text-red-700",
  na: "text-muted-foreground",
};

export function SeoAnalyzerCard({ values, onChange }: SeoAnalyzerCardProps) {
  const { score, checks } = useMemo(() => analyzeSeo(values), [values]);
  const tone = seoScoreTone(score);
  const toneColor = tone === "good" ? "text-green-600" : tone === "yellow" ? "text-yellow-600" : "text-red-600";

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>SEO & Analisis</span>
          <span className={cn("text-2xl font-bold tabular-nums", toneColor)}>{score}</span>
        </CardTitle>
        <CardDescription>Skor 0-100, semakin tinggi semakin optimal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full transition-all",
              tone === "good" && "bg-green-600",
              tone === "yellow" && "bg-yellow-500",
              tone === "red" && "bg-red-600"
            )}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="focus_keyword">Focus Keyword</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="focus_keyword"
                className="pl-8"
                value={values.focus_keyword ?? ""}
                onChange={(e) => onChange({ focus_keyword: e.target.value })}
                placeholder="contoh: manajemen tim"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO Title (SERP)</Label>
            <Input
              id="seo_title"
              value={values.seo_title ?? ""}
              onChange={(e) => onChange({ seo_title: e.target.value })}
              placeholder="Judul untuk hasil pencarian"
              maxLength={70}
            />
            <p className="text-xs text-muted-foreground">{(values.seo_title || "").length}/60 karakter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description">Meta Description</Label>
            <Textarea
              id="seo_description"
              value={values.seo_description ?? ""}
              onChange={(e) => onChange({ seo_description: e.target.value })}
              placeholder="Deskripsi singkat yang tampil di Google"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{(values.seo_description || "").length}/155 karakter</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical_url">Canonical URL (opsional)</Label>
            <Input
              id="canonical_url"
              type="url"
              value={values.canonical_url ?? ""}
              onChange={(e) => onChange({ canonical_url: e.target.value })}
              placeholder="https://example.com/blog/artikel-asli"
            />
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <p className="text-sm font-medium">Checklist</p>
          <ul className="space-y-1.5">
            {checks.map((c) => (
              <li key={c.id} className="flex items-start gap-2 text-sm">
                {statusIcon[c.status]}
                <div className="flex-1 min-w-0">
                  <span className={cn("font-medium", statusText[c.status])}>{c.label}</span>
                  <p className="text-xs text-muted-foreground leading-snug">{c.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
