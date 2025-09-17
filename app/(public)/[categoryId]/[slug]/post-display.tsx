"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Clock, Eye, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { api } from "@/convex/_generated/api";

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type PostDisplayProps = {
  preloadedPost: Preloaded<typeof api.posts.getPostBySlugWithAuthor>;
  preloadedCategory: Preloaded<typeof api.categories.getCategoryById>;
};

export function PostDisplay({
  preloadedPost,
  preloadedCategory,
}: PostDisplayProps) {
  const post = usePreloadedQuery(preloadedPost);
  const category = usePreloadedQuery(preloadedCategory);

  if (!post) {
    return null;
  }

  return (
    <article className="space-y-6">
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="border-none shadow-none">
        <div className="space-y-4 px-0 pb-4">
          <div className="flex items-center gap-6">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Badge className="text-xs" key={tag} variant="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 text-body-8 text-neutral-600">
              <Clock className="size-4" />
              <span>{post.duration} min read</span>
            </div>
          </div>
          <h1 className="w-[60%] text-heading-3">{post.title}</h1>

          <div className="mt-[30px] flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage src={post.authorImage} />
                <AvatarFallback>
                  {post.authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-body-7 text-neutral-900">
                {post.authorName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-body-7 text-neutral-600">
                {post.publishedAt
                  ? formatDate(post.publishedAt)
                  : formatDate(post._creationTime)}
              </span>
            </div>

            <div className="ml-14 flex items-center gap-5">
              <div className="flex items-center gap-2 text-body-7 text-neutral-600">
                <MessageCircle className="size-4" />
                <span>{post.commentsCount} comentarios</span>
              </div>

              <div className="flex items-center gap-2 text-body-7 text-neutral-600">
                <Eye className="size-4" />
                <span>{post.viewCount} vistas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {post.image && (
        <div className="overflow-hidden rounded-lg">
          <img
            alt={post.title}
            className="aspect-video h-[450px] w-full object-cover"
            src={post.image}
          />
        </div>
      )}

      <div className="border-none shadow-none">
        <div className="px-0 py-0">
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-code:rounded-md prose-pre:rounded-lg prose-blockquote:border-l-primary prose-code:bg-muted prose-pre:bg-muted prose-pre:p-4 prose-code:px-1.5 prose-code:py-0.5 prose-h1:font-bold prose-h2:font-semibold prose-h3:font-semibold prose-h4:font-medium prose-a:text-primary prose-blockquote:text-muted-foreground prose-code:text-sm prose-p:text-muted-foreground prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Post content is from trusted source
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </article>
  );
}
