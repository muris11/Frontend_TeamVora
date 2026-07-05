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
      const res = await api.get("/blogs/public", { params: { page, per_page: 10 } });
      return res.data;
    },
  });

  const blogs: Blog[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog - TeamVora"
        description="Artikel, panduan, dan wawasan terbaru seputar manajemen tim dan produktivitas bisnis dari TeamVora."
        keywords="blog TeamVora, artikel manajemen tim, tips produktivitas, panduan bisnis"
        ogUrl="https://teamvora.coded.my.id/blog"
      />
      <PageTitle title="Blog TeamVora" />
      
      {/* Premium Header Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(var(--primary),0.15)_0%,_transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
              Wawasan & Panduan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Temukan artikel terbaru seputar manajemen tim, produktivitas, dan strategi bisnis untuk membawa tim Anda ke level berikutnya.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/40 bg-card overflow-hidden animate-pulse shadow-sm">
                  <div className="h-56 bg-muted/60" />
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-muted/60 rounded w-3/4" />
                    <div className="h-4 bg-muted/60 rounded w-full" />
                    <div className="h-4 bg-muted/60 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-32 bg-muted/10 rounded-3xl border border-border/40">
              <p className="text-muted-foreground text-lg">Belum ada artikel blog yang diterbitkan.</p>
            </div>
          ) : (
            <>
              {/* Featured Blog */}
              {blogs[0] && page === 1 && (
                <div className="mb-20">
                  <Link
                    href={`/blog/${blogs[0].slug}`}
                    className="group flex flex-col lg:flex-row items-center bg-card rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {blogs[0].featured_image && (
                      <div className="w-full lg:w-1/2 h-72 lg:h-[450px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                        <Image
                          src={blogs[0].featured_image}
                          alt={blogs[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          priority
                        />
                      </div>
                    )}
                    <div className={`w-full ${blogs[0].featured_image ? "lg:w-1/2" : ""} p-8 lg:p-14 flex flex-col justify-center`}>
                      <div className="flex items-center gap-4 text-sm font-medium text-primary mb-6">
                        <span className="bg-primary/10 px-3 py-1 rounded-full">Pilihan Editor</span>
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors leading-tight">
                        {blogs[0].title}
                      </h2>
                      {blogs[0].excerpt && (
                        <p className="text-muted-foreground text-lg mb-8 line-clamp-3 leading-relaxed">
                          {blogs[0].excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                        <div className="flex items-center gap-3">
                          {blogs[0].author?.avatar_path ? (
                            <Image src={blogs[0].author.avatar_path} alt={blogs[0].author.name} width={32} height={32} className="rounded-full" />
                          ) : (
                            <div className="bg-muted p-2 rounded-full"><User className="w-4 h-4" /></div>
                          )}
                          <span className="font-medium text-foreground">{blogs[0].author?.name || "Tim Editorial"}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5" />
                          {formatDate(blogs[0].published_at || blogs[0].created_at)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Latest Articles Grid */}
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-bold text-foreground">Artikel Terbaru</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.slice(blogs[0]?.featured_image && page === 1 ? 1 : 0).map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {blog.featured_image && (
                      <div className="h-56 relative overflow-hidden">
                        <Image
                          src={blog.featured_image}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h4>
                      {blog.excerpt && (
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-5 border-t border-border/40 mt-auto">
                        <div className="flex items-center gap-2">
                          {blog.author?.avatar_path ? (
                            <Image src={blog.author.avatar_path} alt={blog.author.name} width={24} height={24} className="rounded-full" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          <span className="font-medium">{blog.author?.name || "Tim Editorial"}</span>
                        </div>
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
                <div className="mt-20 flex justify-center items-center gap-2">
                  {Array.from({ length: meta.last_page }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                        page === i + 1
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
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
      </section>
    </div>
  );
}
