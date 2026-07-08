import Link from "next/link";
import { ArrowRight, BookOpen, Database, FolderKanban, Layers3, Wrench } from "lucide-react";
import { PageTitle } from "@/components/shared/page-title";
import { ProjectDocStatusBadge } from "@/components/project-docs/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  flattenedProjectDocPages,
  getProjectDocHref,
  getPagesForCategory,
  projectDocCategories,
} from "@/lib/project-docs";

const readingPaths = [
  {
    title: "Onboarding Developer",
    description: "Mulai dari gambaran sistem lalu masuk ke backend, frontend, database, dan operasi internal.",
    pages: [
      "architecture/system-landscape",
      "backend/overview",
      "frontend/overview",
      "database/overview",
      "operations/superadmin-handbook",
    ],
  },
  {
    title: "Audit Platform Admin",
    description: "Fokus ke auth, settings, environment, support, dan storage yang paling sensitif untuk superadmin.",
    pages: [
      "backend/auth-rbac",
      "backend/config-integrations",
      "operations/settings-environment",
      "operations/media-storage",
      "operations/email-notifications-support",
    ],
  },
  {
    title: "Tracing Data Flow",
    description: "Ikuti alur dari schema sampai route dan consumer frontend untuk mempercepat debugging.",
    pages: [
      "database/schema-map",
      "database/users-teams",
      "database/finance",
      "frontend/providers-stores-api",
      "backend/api-surface",
    ],
  },
];

export default function ProjectDocsOverviewPage() {
  const totalPages = flattenedProjectDocPages.length;
  const totalCategories = projectDocCategories.length;

  return (
    <div className="space-y-8">
      <PageTitle title="Dokumentasi Project | TeamVora Admin" />

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="relative p-8 md:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-linear-to-l from-primary/5 to-transparent md:block" />
          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Documentation Hub Internal
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dokumentasi Project TeamVora</h1>
              <p className="text-muted-foreground md:text-base">
                Hub dokumentasi internal superadmin untuk backend, frontend, database, theme, integrasi, dan operasi
                platform. Setiap concern dipisah ke category page dan subpage detail supaya pembacaan, onboarding, audit
                perubahan, dan troubleshooting lebih terstruktur.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{totalCategories} kategori</Badge>
              <Badge variant="outline">{totalPages} halaman detail</Badge>
              <Badge variant="outline">Hybrid curated</Badge>
              <Badge variant="outline">Codebase-grounded</Badge>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/admin/project-docs/architecture">
                  Mulai dari Architecture
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin">Kembali ke Dashboard Admin</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Architecture", value: "workspace split, boundaries, integrations", icon: Layers3 },
          { label: "Frontend", value: "routes, role surfaces, providers, theme", icon: FolderKanban },
          { label: "Database", value: "overview, schema map, domain tables", icon: Database },
          { label: "Operations", value: "superadmin, env, email, storage, support", icon: Wrench },
        ].map((item) => (
          <Card key={item.label} className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-base leading-snug">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Kategori Dokumentasi</h2>
          <p className="text-muted-foreground">
            Setiap kategori punya halaman overview sendiri dan sub-halaman detail yang saling terhubung.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {projectDocCategories.map((category) => {
            const pages = getPagesForCategory(category.slug);
            return (
              <Card key={category.slug} className="border-border/50 shadow-sm h-full">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="mt-1">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{pages.length} halaman detail</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/project-docs/${category.slug}`}>Buka kategori</Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {pages.slice(0, 3).map((page) => (
                      <Link
                        key={page.id}
                        href={getProjectDocHref(page)}
                        className="block rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="font-medium">{page.title}</span>
                          <ProjectDocStatusBadge status={page.overallStatus} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{page.summary}</p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Reading Paths</h2>
          <p className="text-muted-foreground">
            Jalur baca cepat untuk onboarding, audit platform, atau tracing data flow lintas backend-frontend-database.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {readingPaths.map((path) => (
            <Card key={path.title} className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {path.pages.map((id, index) => {
                  const page = flattenedProjectDocPages.find((item) => item.id === id);
                  if (!page) return null;
                  return (
                    <Link
                      key={id}
                      href={getProjectDocHref(page)}
                      className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{page.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{page.summary}</div>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
