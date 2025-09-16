"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { api } from "@/convex/_generated/api";
import { LikeButton } from "./like-button";

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type PostDisplayProps = {
  preloadedPost: Preloaded<typeof api.posts.getPostBySlug>;
  preloadedCategory: Preloaded<typeof api.categories.getCategoryById>;
  preloadedHasLiked: Preloaded<typeof api.likes.hasUserLikedPost>;
  slug: string;
};

export function PostDisplay({
  preloadedPost,
  preloadedCategory,
  preloadedHasLiked,
  slug,
}: PostDisplayProps) {
  const post = usePreloadedQuery(preloadedPost);
  const category = usePreloadedQuery(preloadedCategory);

  if (!post) {
    return null;
  }

  return (
    <article className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-4 px-0 pb-4">
          <h1 className="font-bold text-4xl leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>

          <p className="text-muted-foreground text-xl leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>
                {post.publishedAt
                  ? formatDate(post.publishedAt)
                  : formatDate(post._creationTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{post.duration} min read</span>
            </div>

            {category && (
              <Badge className="font-medium" variant="secondary">
                {category.name}
              </Badge>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Badge className="text-xs" key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {post.image && (
        <div className="overflow-hidden rounded-lg">
          <img
            alt={post.title}
            className="aspect-video h-auto w-full object-cover"
            decoding="sync"
            height={450}
            loading="eager"
            src={post.image}
            width={800}
          />
        </div>
      )}

      <Card className="border-none shadow-none">
        <CardContent className="px-0 py-0">
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-code:rounded-md prose-pre:rounded-lg prose-blockquote:border-l-primary prose-code:bg-muted prose-pre:bg-muted prose-pre:p-4 prose-code:px-1.5 prose-code:py-0.5 prose-h1:font-bold prose-h2:font-semibold prose-h3:font-semibold prose-h4:font-medium prose-a:text-primary prose-blockquote:text-muted-foreground prose-code:text-sm prose-p:text-muted-foreground prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Post content is from trusted source
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
    </article>
  );
}
