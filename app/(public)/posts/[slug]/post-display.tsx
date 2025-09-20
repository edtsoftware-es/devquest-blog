"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Clock, Eye, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  AuthorCard,
  AuthorCardDescription,
  AuthorCardImageContainer,
  AuthorCardName,
} from "@/components/cards/author-card";
import {
  CompactCard,
  CompactCardContent,
  CompactCardFooter,
  CompactCardImageContainer,
  CompactCardPublishedAt,
  CompactCardReadingTime,
  CompactCardTitle,
} from "@/components/cards/compact-card";
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
import { Button } from "@/components/ui/button";
import type { api } from "@/convex/_generated/api";

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type PostDisplayProps = {
  preloadedPost: Preloaded<typeof api.posts.getPdpPost>;
};

export function PostDisplay({ preloadedPost }: PostDisplayProps) {
  const post = usePreloadedQuery(preloadedPost);
  const pathname = usePathname();

  if (!post) {
    return null;
  }

  const shareUrl = `${window.location.origin}${pathname}`;
  const shareText = `${post.title}`;

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="border-none shadow-none">
        <div className="space-y-4 px-0 pb-4">
          <div className="flex items-center gap-6">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag: string) => (
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
          <h1 className="text-heading-3">{post.title}</h1>

          <div className="mt-[30px] flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage src={post.author.image} />
                <AvatarFallback>
                  {post.author.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-body-7 text-neutral-900">
                {post.author.name ||
                  (post.author.role === "admin" ? "Administrador" : "Usuario")}
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

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          {post.image && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                alt={post.title}
                className="aspect-video h-[300px] w-full rounded-xl object-cover sm:h-[400px] lg:h-[450px]"
                src={post.image}
              />
            </div>
          )}
          <article className="border-none shadow-none">
            <div>
              <div
                className="prose dark:prose-invert prose-img:w-full max-w-none prose-img:rounded-lg prose-img:object-cover"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Post content is from trusted source
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>
        </div>

        <aside className="w-full space-y-14 lg:col-span-1">
          <div>
            <AuthorCard className="max-w-none">
              <AuthorCardImageContainer>
                <Avatar className="h-full w-full">
                  <AvatarImage src={post.author.image} />
                  <AvatarFallback>
                    {post.author.name?.charAt(0).toUpperCase() ||
                      (post.author.role === "admin" ? "A" : "U")}
                  </AvatarFallback>
                </Avatar>
              </AuthorCardImageContainer>
              <AuthorCardName>
                {post.author.name ||
                  (post.author.role === "admin" ? "Administrador" : "Usuario")}
              </AuthorCardName>
              <AuthorCardDescription>
                {post.author.role === "admin"
                  ? "Administrador del sistema"
                  : "Usuario registrado"}
              </AuthorCardDescription>
            </AuthorCard>
          </div>
          <div className="space-y-14">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <svg
                  fill="none"
                  height="23"
                  viewBox="0 0 24 23"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.5818 11.7288C8.79426 13.4715 10.2517 14.8616 12.1247 22.7374C13.8064 14.8771 15.2306 13.4995 23.4016 11.8281C15.1891 10.0854 13.7317 8.69528 11.8587 0.819485C10.1767 8.67981 8.75282 10.0574 0.5818 11.7288Z"
                    fill="#F3F4F6"
                  />
                </svg>

                <h5 className="text-heading-5">Tendencias semanales</h5>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {post.weeklyTrendingPosts.map((trendingPost) => (
                  <CompactCard key={post._id} variant="reverse">
                    <CompactCardImageContainer>
                      <img
                        alt={trendingPost.title}
                        className="h-full w-full rounded-[0.625rem]"
                        src={trendingPost.image}
                      />
                    </CompactCardImageContainer>
                    <CompactCardContent className="mr-0">
                      <CompactCardTitle>{trendingPost.title}</CompactCardTitle>
                      <CompactCardFooter className="mr-0">
                        <CompactCardPublishedAt>
                          {post.publishedAt
                            ? formatDate(post.publishedAt)
                            : formatDate(post._creationTime)}
                        </CompactCardPublishedAt>
                        <CompactCardReadingTime>
                          {post.duration} mins
                        </CompactCardReadingTime>
                      </CompactCardFooter>
                    </CompactCardContent>
                  </CompactCard>
                ))}
              </div>
            </div>
            <div>
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <svg
                    fill="none"
                    height="23"
                    viewBox="0 0 24 23"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5818 11.7288C8.79426 13.4715 10.2517 14.8616 12.1247 22.7374C13.8064 14.8771 15.2306 13.4995 23.4016 11.8281C15.1891 10.0854 13.7317 8.69528 11.8587 0.819485C10.1767 8.67981 8.75282 10.0574 0.5818 11.7288Z"
                      fill="#F3F4F6"
                    />
                  </svg>

                  <h5 className="text-heading-5">Popular tags</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Button className="w-fit" key={tag} size={"xs"}>
                      {tag}
                      <Badge variant="tertiary">26</Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <hr className="mt-12 mb-8" />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="flex items-center justify-between lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag: string) => (
              <Badge className="text-xs" key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-body-6 text-neutral-900">Compartir:</span>
            <div className="flex items-center gap-1 rounded-lg border bg-muted px-3 py-2">
              <Button
                aria-label="Compartir en Twitter"
                className="h-8 w-8 p-0"
                onClick={shareOnTwitter}
                size="sm"
                variant="ghost"
              >
                <span className="font-bold text-sm text-white">X</span>
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button
                aria-label="Compartir en LinkedIn"
                className="h-8 w-8 p-0"
                onClick={shareOnLinkedIn}
                size="sm"
                variant="ghost"
              >
                <span className="font-bold text-sm text-white">in</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
