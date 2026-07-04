"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, User } from "lucide-react";
import api from "@/lib/api";
import { Blog } from "@/types";
import { formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";
import { SEOHead } from "@/components/shared/seo-head";

export default function PublicBlogPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["public-blogs", page],
    queryFn: async () => {
      const res = await api.get("/blogs/public", { params: { page, per_page: 9 } });
      return res.data;
    },
  });

  const blogs: Blog[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="pt-24 pb-16">
      <SEOHead
        title="Blog - TeamVora"
        description="Artikel, panduan, dan wawasan terbaru seputar manajemen tim dan produktivitas bisnis dari TeamVora."
        keywords="blog TeamVora, artikel manajemen tim, tips produktivitas, panduan bisnis"
        ogUrl="https://teamvora.coded.my.id/blog"
      />
      <PageTitle title="Blog TeamVora" />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Artikel, panduan, dan wawasan terbaru seputar manajemen tim dan produktivitas bisnis.
          </p>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/50 bg-card overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Belum ada artikel blog.</p>
          </div>
        ) : (
          <>
            {/* Featured blog */}
            {blogs[0] && (
              <div className="mb-16">
                <Link
                  href={`/blog/${blogs[0].slug}`}
                  className="group flex flex-col md:flex-row gap-8 items-center bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
                >
                  {blogs[0].featured_image && (
                    <div className="w-full md:w-1/2 h-64 md:h-96 relative overflow-hidden">
                      <Image
                        src={blogs[0].featured_image}
                        alt={blogs[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className={`w-full ${blogs[0].featured_image ? "md:w-1/2" : ""} p-8 md:pr-12`}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {blogs[0].title}
                    </h2>
                    {blogs[0].excerpt && (
                      <p className="text-muted-foreground text-lg mb-6 line-clamp-3">{blogs[0].excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {blogs[0].author && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{blogs[0].author.name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(blogs[0].published_at || blogs[0].created_at)}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center text-primary font-medium">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Article Grid */}
            <h3 className="text-2xl font-bold mb-8">Artikel Terbaru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(blogs[0]?.featured_image ? 1 : 0).map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors flex flex-col"
                >
                  {blog.featured_image && (
                    <div className="h-48 relative overflow-hidden">
                      <Image
                        src={blog.featured_image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    {blog.excerpt && (
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">{blog.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                      <span>{blog.author?.name || "Admin"}</span>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(blog.published_at || blog.created_at)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="mt-16 flex justify-center gap-2">
                {Array.from({ length: meta.last_page }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
