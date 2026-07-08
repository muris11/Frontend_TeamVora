"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/shared/page-title";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useMarketingStore } from "@/stores/marketing-store";
import { toast } from "sonner";
import { MarketingSection, MarketingPageData } from "@/lib/marketing-defaults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MarketingPageEditor({ params }: { params: Promise<{ pageSlug: string }> }) {
  const router = useRouter();
  // Unwrap params per Next.js 16 dynamic route pattern
  const { pageSlug } = use(params);
  
  const { getPage, updatePage } = useMarketingStore();
  const [pageData, setPageData] = useState<MarketingPageData | null>(null);
  
  useEffect(() => {
    if (pageSlug) {
      setPageData(getPage(pageSlug));
    }
  }, [pageSlug, getPage]);

  if (!pageData) return null;

  const handleSave = () => {
    updatePage(pageSlug, pageData);
    toast.success(`Halaman ${pageSlug} berhasil disimpan`);
  };

  const updateSection = (idx: number, data: Partial<MarketingSection>) => {
    const updated = [...pageData.sections];
    updated[idx] = { ...updated[idx], ...data };
    setPageData({ ...pageData, sections: updated });
  };

  const addSection = (type: MarketingSection['type']) => {
    const newSection: MarketingSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: "Judul Baru",
      order: pageData.sections.length + 1
    };
    setPageData({ ...pageData, sections: [...pageData.sections, newSection] });
  };

  const removeSection = (idx: number) => {
    const updated = pageData.sections.filter((_, i) => i !== idx);
    setPageData({ ...pageData, sections: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <PageTitle title={`Edit ${pageSlug} | TeamVora Admin`} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/settings/marketing")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">{pageSlug}</h1>
            <p className="text-muted-foreground">Kelola section untuk halaman ini.</p>
          </div>
        </div>
        <Button onClick={handleSave} className="rounded-xl">
          <Save className="w-4 h-4 mr-2" />
          Simpan Halaman
        </Button>
      </div>

      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border">
        <div>
          <h3 className="font-semibold">Status Halaman</h3>
          <p className="text-sm text-muted-foreground">Tentukan apakah halaman ini dapat diakses publik.</p>
        </div>
        <Button 
          variant={pageData.enabled ? "default" : "outline"} 
          className={pageData.enabled ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          onClick={() => setPageData({ ...pageData, enabled: !pageData.enabled })}
        >
          {pageData.enabled ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Aktif</> : "Nonaktif"}
        </Button>
      </div>

      <Tabs defaultValue="sections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="sections" className="space-y-6">
          <div className="space-y-6">
            {pageData.sections.map((section, idx) => (
              <Card key={section.id} className="border-border/50 shadow-sm relative overflow-hidden group">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => removeSection(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <CardHeader className="bg-muted/30 border-b pb-4">
                  <CardTitle className="text-base uppercase tracking-wider text-muted-foreground">
                    Section: {section.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Judul</label>
                    <Input 
                      value={section.title || ""} 
                      onChange={(e) => updateSection(idx, { title: e.target.value })} 
                    />
                  </div>
                  
                  {section.type !== 'text' && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Subjudul</label>
                      <Input 
                        value={section.subtitle || ""} 
                        onChange={(e) => updateSection(idx, { subtitle: e.target.value })} 
                      />
                    </div>
                  )}
                  
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Konten Text</label>
                    <Textarea 
                      value={section.content || ""} 
                      onChange={(e) => updateSection(idx, { content: e.target.value })} 
                      rows={4}
                    />
                  </div>

                  {(section.type === 'hero' || section.type === 'features') && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">URL Gambar</label>
                      <Input 
                        value={section.imageUrl || ""} 
                        onChange={(e) => updateSection(idx, { imageUrl: e.target.value })} 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/30 p-6 rounded-xl border border-dashed flex flex-col items-center justify-center gap-4 text-center">
            <div>
              <h3 className="font-semibold">Tambah Section Baru</h3>
              <p className="text-sm text-muted-foreground">Pilih tipe section untuk ditambahkan ke halaman ini.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['hero', 'features', 'testimonials', 'text', 'pricing', 'faq'].map(type => (
                <Button key={type} variant="outline" size="sm" onClick={() => addSection(type as any)}>
                  <Plus className="w-4 h-4 mr-2" /> {type}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">SEO Title</label>
                <Input 
                  value={pageData.seo.title} 
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, title: e.target.value } })} 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">SEO Description</label>
                <Textarea 
                  value={pageData.seo.description} 
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, description: e.target.value } })} 
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">SEO Keywords</label>
                <Input 
                  value={pageData.seo.keywords} 
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, keywords: e.target.value } })} 
                  placeholder="marketing, manajemen, tim"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Open Graph Image (URL)</label>
                <Input 
                  value={pageData.seo.ogImage} 
                  onChange={(e) => setPageData({ ...pageData, seo: { ...pageData.seo, ogImage: e.target.value } })} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
