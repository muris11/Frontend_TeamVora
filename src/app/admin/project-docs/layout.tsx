"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen } from "lucide-react";
import {
  getProjectDocHref,
  getProjectDocHrefFromSegments,
  projectDocCategories,
  projectDocPageMap,
  projectDocStatusMeta,
} from "@/lib/project-docs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectDocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] pb-10">
      <aside className="lg:sticky lg:top-24 h-fit space-y-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              Internal Docs Hub
            </div>
            <CardTitle className="text-xl">Dokumentasi Project</CardTitle>
            <CardDescription>
              Dokumentasi internal superadmin yang dipisah dari docs pengguna. Setiap concern punya category page dan
              halaman detail sendiri.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/admin/project-docs"
              className={`block rounded-lg border px-3 py-2 text-sm transition-colors ${
                pathname === "/admin/project-docs"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-transparent hover:border-border hover:bg-muted/40"
              }`}
            >
              <div className="font-medium">Overview</div>
              <div className="text-xs text-muted-foreground">Hub utama dan reading paths</div>
            </Link>

            <div className="space-y-3">
              {projectDocCategories.map((category) => {
                const categoryHref = getProjectDocHrefFromSegments([category.slug]);
                const isCategoryActive = pathname === categoryHref || pathname?.startsWith(`${categoryHref}/`);

                return (
                  <div key={category.slug} className="rounded-xl border bg-muted/10 p-3">
                    <Link
                      href={categoryHref}
                      className={`block rounded-lg px-2 py-2 transition-colors ${
                        pathname === categoryHref ? "bg-primary/10 text-primary" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <category.icon
                          className={`h-4 w-4 ${isCategoryActive ? "text-primary" : "text-muted-foreground"}`}
                        />
                        {category.title}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{category.description}</div>
                    </Link>

                    <div className="mt-2 space-y-1 pl-2">
                      {category.pageIds.map((id) => {
                        const page = projectDocPageMap[id];
                        const href = getProjectDocHref(page);
                        const active = pathname === href;

                        return (
                          <Link
                            key={id}
                            href={href}
                            className={`block rounded-lg px-2 py-2 text-sm transition-colors ${
                              active
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                          >
                            {page.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Status Legend</CardTitle>
            <CardDescription className="text-xs">Penanda tingkat kepastian dokumentasi internal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.values(projectDocStatusMeta).map((status) => (
              <div key={status.label} className="rounded-lg border bg-muted/20 p-3">
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
                <p className="mt-2 text-xs text-muted-foreground">{status.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Batas Dokumentasi</CardTitle>
            <CardDescription className="text-xs">
              Internal docs ini berbeda dari docs pengguna yang public-facing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border bg-muted/20 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-medium">Dokumentasi Project</span>
                <Badge variant="outline">Internal</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Arsitektur, database, backend, frontend, operasi superadmin, dan keputusan teknis.
              </p>
            </div>
            <a
              href="https://docs.teamvora.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Docs pengguna</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </CardContent>
        </Card>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
