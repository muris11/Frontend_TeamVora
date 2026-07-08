import { projectDocPages } from "./data";
import { ProjectDocPage, ProjectDocCategory } from "./types";
import { projectDocCategories } from "./categories";

export const flattenedProjectDocPages: ProjectDocPage[] = projectDocPages;

export const projectDocPageMap: Record<string, ProjectDocPage> = {};
for (const page of projectDocPages) {
  projectDocPageMap[page.id] = page;
}

export function getProjectDocHrefFromSegments(slug: string[]): string {
  return `/admin/project-docs/${slug.join("/")}`;
}

export function getProjectDocHref(page: ProjectDocPage | string): string {
  if (typeof page === "string") {
    const p = projectDocPageMap[page];
    if (!p) return "#";
    return getProjectDocHrefFromSegments(p.slug);
  }
  return getProjectDocHrefFromSegments(page.slug);
}

export function getPagesForCategory(categorySlug: string): ProjectDocPage[] {
  return flattenedProjectDocPages.filter((p) => p.category === categorySlug);
}

export function getProjectDocCategory(slug: string): ProjectDocCategory | undefined {
  return projectDocCategories.find((c) => c.slug === slug);
}

export function getProjectDocBySegments(slug: string[]): ProjectDocPage | undefined {
  return flattenedProjectDocPages.find(
    (p) => p.slug.length === slug.length && p.slug.every((s, i) => s === slug[i])
  );
}
