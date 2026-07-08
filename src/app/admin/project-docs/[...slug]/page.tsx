import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import { PageTitle } from "@/components/shared/page-title";
import { ProjectDocStatusBadge } from "@/components/project-docs/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  flattenedProjectDocPages,
  getPagesForCategory,
  getProjectDocBySegments,
  getProjectDocCategory,
  getProjectDocHref,
  projectDocStatusMeta,
  type ProjectDocPage,
} from "@/lib/project-docs";

export default async function ProjectDocsCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (!slug?.length) {
    notFound();
  }

  if (slug.length === 1) {
    const category = getProjectDocCategory(slug[0]);
    if (!category) notFound();

    const pages = getPagesForCategory(category.slug);

    return (
      <div className="space-y-8">
        <PageTitle title={`${category.title} | Dokumentasi Project`} />

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardContent className="relative p-8 md:p-10">
            <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l from-primary/5 to-transparent md:block" />
            <div className="relative z-10 max-w-4xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <category.icon className="h-3.5 w-3.5" />
                Category Page
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{category.title}</h1>
                <p className="text-muted-foreground md:text-base">{category.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{pages.length} halaman detail</Badge>
                <Badge variant="outline">Granular docs</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          {pages.map((page) => (
            <Link key={page.id} href={getProjectDocHref(page)} className="group">
              <Card className="h-full border-border/50 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <CardDescription className="mt-1">{page.summary}</CardDescription>
                    </div>
                    <ProjectDocStatusBadge status={page.overallStatus} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {page.audience.map((audience) => (
                      <Badge key={audience} variant="outline">
                        {audience}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {page.facts.slice(0, 4).map((fact) => (
                      <div key={fact.label} className="rounded-lg border bg-muted/20 p-3">
                        <div className="text-xs text-muted-foreground">{fact.label}</div>
                        <div className="mt-1 text-sm font-medium leading-snug">{fact.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                    Buka halaman detail
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const page = getProjectDocBySegments(slug);
  if (!page) {
    notFound();
  }

  const category = getProjectDocCategory(page.category);
  const currentIndex = flattenedProjectDocPages.findIndex((item) => item.id === page.id);
  const previousPage = currentIndex > 0 ? flattenedProjectDocPages[currentIndex - 1] : null;
  const nextPage = currentIndex < flattenedProjectDocPages.length - 1 ? flattenedProjectDocPages[currentIndex + 1] : null;
  const relatedPages = page.relatedPageIds
    .map((id) => flattenedProjectDocPages.find((item) => item.id === id))
    .filter((item): item is ProjectDocPage => Boolean(item));

  return (
    <div className="space-y-8">
      <PageTitle title={`${page.title} | Dokumentasi Project`} />

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="relative p-8 md:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l from-primary/5 to-transparent md:block" />
          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {category ? (
                <Link
                  href={`/admin/project-docs/${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  <category.icon className="h-3.5 w-3.5" />
                  {category.title}
                </Link>
              ) : null}
              <ProjectDocStatusBadge status={page.overallStatus} />
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {page.audience.map((audience) => (
                  <Badge key={audience} variant="outline">
                    {audience}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{page.title}</h1>
              <p className="text-muted-foreground md:text-base">{page.summary}</p>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-primary" />
                Status halaman
              </div>
              <p className="text-sm text-muted-foreground">{page.statusNote}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {page.facts.map((fact) => (
          <Card key={fact.label} className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>{fact.label}</CardDescription>
              <CardTitle className="text-base leading-snug">{fact.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Tanggung Jawab Modul</CardTitle>
            <CardDescription>Apa yang harus dipahami dan dijaga saat menyentuh area ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {page.responsibilities.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Dependensi Utama</CardTitle>
            <CardDescription>Komponen, layanan, atau layer lain yang selalu ikut terpengaruh.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {page.dependencies.map((dependency) => (
                <div key={dependency} className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                  {dependency}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>File Utama</CardTitle>
          <CardDescription>Path konkret yang menjadi sumber kebenaran atau titik sentuh utama untuk topik ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 xl:grid-cols-2">
            {page.keyFiles.map((file) => (
              <div key={file.path} className="rounded-xl border bg-muted/20 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    <code className="text-xs sm:text-sm">{file.path}</code>
                  </div>
                  <ProjectDocStatusBadge status={file.status} />
                </div>
                <p className="text-sm text-muted-foreground">{file.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Flow Data & Operasi</CardTitle>
          <CardDescription>Urutan kerja utama yang perlu dipahami sebelum debugging atau refactor.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-2">
            {page.flows.map((flow) => (
              <div key={flow.title} className="rounded-xl border bg-muted/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{flow.title}</h3>
                  <ProjectDocStatusBadge status={flow.status} />
                </div>
                <div className="space-y-3">
                  {flow.steps.map((step, index) => (
                    <div key={step} className="flex gap-3 text-sm text-muted-foreground">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Area Sensitif
            </CardTitle>
            <CardDescription>Bagian yang berpotensi menimbulkan bug, kebocoran akses, atau drift perilaku bila disentuh tanpa audit.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {page.sensitiveAreas.map((risk) => (
                <div key={risk.title} className="rounded-xl border bg-muted/20 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{risk.title}</h3>
                    <ProjectDocStatusBadge status={risk.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{risk.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Cara Mengubah dengan Aman</CardTitle>
            <CardDescription>Urutan kerja yang direkomendasikan saat melakukan perubahan di area ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {page.safeChangeGuide.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Checklist Validasi</CardTitle>
            <CardDescription>Minimum checks setelah perubahan agar efek samping tidak lolos ke lingkungan lain.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {page.validationChecklist.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Permukaan yang Terdampak</CardTitle>
            <CardDescription>Folder, feature, atau area UI/API yang biasanya harus ikut dicek bila topik ini berubah.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {page.affectedSurfaces.map((surface) => (
                <Badge key={surface} variant="outline" className="py-1.5">
                  <code className="text-[11px] sm:text-xs">{surface}</code>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {relatedPages.length ? (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Halaman Terkait</CardTitle>
            <CardDescription>Pindah ke topik yang biasanya perlu dibaca bersama halaman ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 xl:grid-cols-2">
              {relatedPages.map((related) => (
                <Link
                  key={related.id}
                  href={getProjectDocHref(related)}
                  className="group rounded-xl border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{related.title}</h3>
                    <div className="flex items-center gap-2 text-primary">
                      <ProjectDocStatusBadge status={related.overallStatus} />
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{related.summary}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" asChild>
          <Link href={category ? `/admin/project-docs/${category.slug}` : "/admin/project-docs"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {category ? `Kembali ke ${category.title}` : "Kembali ke Overview"}
          </Link>
        </Button>

        <div className="flex flex-wrap gap-3">
          {previousPage ? (
            <Button variant="outline" asChild>
              <Link href={getProjectDocHref(previousPage)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {previousPage.title}
              </Link>
            </Button>
          ) : null}
          {nextPage ? (
            <Button asChild>
              <Link href={getProjectDocHref(nextPage)}>
                {nextPage.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Status Vocabulary</CardTitle>
          <CardDescription>Gunakan legend ini saat membaca halaman detail dan saat memperluas docs berikutnya.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Object.values(projectDocStatusMeta).map((status) => (
              <div key={status.label} className="rounded-xl border bg-muted/20 p-4">
                <div className="mb-2">
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{status.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
