"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, ChevronRight } from "lucide-react";
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

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Fetch current blog
  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return (res.data.data || res.data) as Blog;
    },
  });

  // Fetch latest blogs for sidebar
  const { data: latestBlogsData } = useQuery({
    queryKey: ["latest-blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs/public", { params: { per_page: 5 } });
      return res.data;
    },
  });

  const latestBlogs: Blog[] = (latestBlogsData?.data || []).filter((b: Blog) => b.slug !== slug).slice(0, 4);

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 animate-pulse space-y-8">
              <div className="h-6 bg-muted/60 rounded w-32" />
              <div className="h-16 bg-muted/60 rounded w-3/4" />
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-muted/60 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted/60 rounded w-32" />
                  <div className="h-4 bg-muted/60 rounded w-24" />
                </div>
              </div>
              <div className="h-[400px] bg-muted/60 rounded-3xl" />
              <div className="space-y-4 pt-8">
                <div className="h-4 bg-muted/60 rounded" />
                <div className="h-4 bg-muted/60 rounded w-5/6" />
                <div className="h-4 bg-muted/60 rounded w-4/6" />
              </div>
            </div>
            <div className="lg:col-span-4 hidden lg:block">
              <div className="h-[600px] bg-muted/30 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center p-12 bg-card rounded-3xl border border-border/40 max-w-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Artikel tidak ditemukan</h1>
          <p className="text-muted-foreground mb-8">Maaf, artikel yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
          <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">
            Kembali ke Beranda Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEOHead
        title={`${blog.title} - TeamVora Blog`}
        description={blog.excerpt || `Baca artikel ${blog.title} dari TeamVora.`}
        ogUrl={`https://teamvora.coded.my.id/blog/${blog.slug}`}
      />
      <PageTitle title={blog.title} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/20 border-b border-border/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-8">
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{blog.title}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 leading-[1.1] text-foreground">
                {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-base">
                <div className="flex items-center gap-3">
                {blog.author?.avatar_url ? (
                    <Image src={blog.author.avatar_url} alt={blog.author.name} width={48} height={48} className="rounded-full shadow-sm border border-border/50" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                    </div>
                )}
                <div>
                    <p className="font-semibold text-foreground">{blog.author?.name || "Tim Editorial"}</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                </div>
                </div>
                
                <div className="h-8 w-px bg-border hidden sm:block" />
                
                <div>
                <div className="flex items-center text-muted-foreground font-medium mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDate(blog.published_at || blog.created_at)}
                </div>
                <p className="text-sm text-muted-foreground">Dipublikasikan</p>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pt-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Article Content */}
            <div className="lg:col-span-8">
              <motion.article
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariant}
              >
                {/* Featured Image */}
                {blog.featured_image && (
                  <div className="relative rounded-3xl overflow-hidden mb-16 h-[300px] sm:h-[400px] md:h-[500px] shadow-lg border border-border/20">
                    <Image
                      src={blog.featured_image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-md">
                  <div className="whitespace-pre-wrap text-muted-foreground leading-loose" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
              </motion.article>

              {/* Footer Actions */}
              <div className="mt-16 pt-8 border-t border-border/40 flex items-center justify-between">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary font-bold transition-all hover:bg-muted px-6 py-3 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Kembali ke Artikel
                </Link>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Related / Latest Blogs */}
                <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm">
                  <h3 className="text-xl font-bold mb-8 text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-primary inline-block"></span>
                    Artikel Terbaru
                  </h3>
                  
                  <div className="space-y-8">
                    {latestBlogs.length > 0 ? (
                      latestBlogs.map((latestBlog) => (
                        <Link 
                          href={`/blog/${latestBlog.slug}`} 
                          key={latestBlog.id}
                          className="group block"
                        >
                          <div className="flex gap-5">
                            {latestBlog.featured_image && (
                              <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 border border-border/20 group-hover:border-primary/30 transition-colors shadow-sm">
                                <Image
                                  src={latestBlog.featured_image}
                                  alt={latestBlog.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="flex flex-col justify-center">
                              <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                                {latestBlog.title}
                              </h4>
                              <div className="flex items-center text-xs text-muted-foreground font-medium">
                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                {formatDate(latestBlog.published_at || latestBlog.created_at)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Belum ada artikel terbaru.</p>
                    )}
                  </div>

                  {latestBlogs.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-border/50">
                      <Link href="/blog" className="text-base font-bold text-primary hover:underline flex items-center justify-center gap-2">
                        Lihat Semua Artikel <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* CTA Widget */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/20 p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                  <h3 className="text-xl font-bold mb-3 text-foreground">Tingkatkan Produktivitas Tim Anda</h3>
                  <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                    Mulai gunakan TeamVora hari ini dan ubah cara tim Anda bekerja.
                  </p>
                  <Link href="/register" className="inline-block w-full bg-primary text-primary-foreground font-bold rounded-2xl py-4 shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    Coba Gratis Sekarang
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
