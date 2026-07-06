"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import api from "@/lib/api";
import { Blog } from "@/types";
import { formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";
import { SEOHead } from "@/components/shared/seo-head";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

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
    <div className="min-h-screen bg-background pt-32 pb-24">
      <SEOHead
        title="Blog - TeamVora"
        description="Artikel, panduan, dan wawasan terbaru seputar manajemen tim dan produktivitas bisnis dari TeamVora."
        keywords="blog TeamVora, artikel manajemen tim, tips produktivitas, panduan bisnis"
        ogUrl="https://teamvora.coded.my.id/blog"
      />
      <PageTitle title="Blog TeamVora" />
      
      {/* Header Section */}
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto"
        >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 text-foreground">
              Wawasan & Panduan
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Temukan artikel terbaru seputar manajemen tim, produktivitas, dan strategi bisnis untuk membawa tim Anda ke level berikutnya.
            </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border/50 bg-card overflow-hidden animate-pulse shadow-sm h-[400px]" />
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-24"
              >
                <Link
                  href={`/blog/${blogs[0].slug}`}
                  className="group flex flex-col lg:flex-row items-center bg-card rounded-[2rem] overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {blogs[0].featured_image && (
                    <div className="w-full lg:w-1/2 h-72 lg:h-[500px] relative overflow-hidden">
                      <Image
                        src={blogs[0].featured_image}
                        alt={blogs[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        priority
                      />
                    </div>
                  )}
                  <div className={`w-full ${blogs[0].featured_image ? "lg:w-1/2" : ""} p-8 lg:p-16 flex flex-col justify-center`}>
                    <Badge className="mb-6 w-fit rounded-full px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20">Pilihan Editor</Badge>
                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-6 text-foreground group-hover:text-primary transition-colors leading-tight">
                      {blogs[0].title}
                    </h2>
                    {blogs[0].excerpt && (
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed line-clamp-3">
                        {blogs[0].excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-base text-muted-foreground mt-auto pt-6 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        {blogs[0].author?.avatar_url ? (
                          <Image src={blogs[0].author.avatar_url} alt={blogs[0].author.name} width={40} height={40} className="rounded-full shadow-sm" />
                        ) : (
                          <div className="bg-muted p-2.5 rounded-full"><User className="w-5 h-5" /></div>
                        )}
                        <span className="font-bold text-foreground">{blogs[0].author?.name || "Tim Editorial"}</span>
                      </div>
                      <div className="flex items-center font-semibold">
                        <Clock className="h-5 w-5 mr-2" />
                        {formatDate(blogs[0].published_at || blogs[0].created_at)}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Latest Articles Grid */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold tracking-tight text-foreground">Artikel Terbaru</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(blogs[0]?.featured_image && page === 1 ? 1 : 0).map((blog, index) => (
                <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="group bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                    >
                      {blog.featured_image && (
                        <div className="h-64 relative overflow-hidden">
                          <Image
                            src={blog.featured_image}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>
                      )}
                      <div className="p-8 flex flex-col flex-grow">
                        <h4 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors leading-tight">
                          {blog.title}
                        </h4>
                        {blog.excerpt && (
                          <p className="text-muted-foreground text-base mb-8 line-clamp-3 leading-relaxed flex-grow">
                            {blog.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-6 border-t border-border/50 mt-auto font-medium">
                          <div className="flex items-center gap-2">
                            {blog.author?.avatar_url ? (
                              <Image src={blog.author.avatar_url} alt={blog.author.name} width={32} height={32} className="rounded-full shadow-sm" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span className="font-semibold">{blog.author?.name || "Tim Editorial"}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            {formatDate(blog.published_at || blog.created_at)}
                          </div>
                        </div>
                      </div>
                    </Link>
                </motion.div>
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
                    className={`h-12 w-12 flex items-center justify-center rounded-2xl text-base font-bold transition-all ${
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
    </div>
  );
}
