"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User } from "lucide-react";
import api from "@/lib/api";
import { Blog } from "@/types";
import { formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return (res.data.data || res.data) as Blog;
    },
  });

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-48" />
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
          <Link href="/blog" className="text-primary hover:underline">
            Kembali ke blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <PageTitle title="Blog" />
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke blog
        </Link>

        {/* Article */}
        <article>
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {blog.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(blog.published_at || blog.created_at)}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">{blog.title}</h1>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="relative rounded-2xl overflow-hidden mb-8 h-64 md:h-96">
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
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {blog.content}
            </div>
          </div>
        </article>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat artikel lainnya
          </Link>
        </div>
      </div>
    </div>
  );
}
