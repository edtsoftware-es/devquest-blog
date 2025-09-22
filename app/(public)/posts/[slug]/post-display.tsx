"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Clock, Eye, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  AuthorCard,
  AuthorCardDescription,
  AuthorCardImageContainer,
  AuthorCardName,
  AuthorCardNickname,
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
import { Heading } from "@/components/headings";
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
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

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
  const incrementPostViewCount = useMutation(api.posts.incrementPostViewCount);
  const pathname = usePathname();

  useEffect(() => {
    incrementPostViewCount({ postId: post?._id as Id<"posts"> });
  }, [post?._id, incrementPostViewCount]);

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
              <span>{post.duration} min</span>
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
              <Image
                alt={post.title}
                className="aspect-video h-[300px] w-full rounded-xl object-cover sm:h-[400px] lg:h-[450px]"
                decoding="sync"
                height={1000}
                loading="eager"
                priority
                src={post.image}
                width={1000}
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

        <aside className="h-full w-full space-y-14 lg:col-span-1">
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
              <div className="flex flex-col items-center gap-1">
                <AuthorCardName>
                  {post.author.name ||
                    (post.author.role === "admin"
                      ? "Administrador"
                      : "Usuario")}
                </AuthorCardName>
                {post.author.nickname && (
                  <Link href={`/author/${post.author.nickname}`} prefetch>
                    <span className="absolute inset-0 z-50" />
                    <AuthorCardNickname>
                      @{post.author.nickname}
                    </AuthorCardNickname>
                  </Link>
                )}
              </div>
              <AuthorCardDescription>
                {post.author.bio || ""}
              </AuthorCardDescription>
            </AuthorCard>
          </div>
          <div className="top-8 block space-y-14 lg:sticky">
            <div>
              <Heading className="mb-6">Tendencias semanales</Heading>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {post.weeklyTrendingPosts.map((trendingPost, index) => (
                  <CompactCard
                    className="max-w-full"
                    key={post._id}
                    variant="reverse"
                  >
                    <CompactCardImageContainer>
                      <Image
                        alt={trendingPost.title}
                        className="h-full w-full rounded-[0.625rem]"
                        height={1000}
                        loading={index < 2 ? "eager" : "lazy"}
                        quality={65}
                        src={trendingPost.image}
                        width={1000}
                      />
                    </CompactCardImageContainer>
                    <CompactCardContent className="mr-0 xs:mr-0">
                      <Link href={`/posts/${trendingPost.slug}`} prefetch>
                        <span className="absolute inset-0 z-50" />
                        <CompactCardTitle>
                          {trendingPost.title}
                        </CompactCardTitle>
                      </Link>
                      <CompactCardFooter className="mr-0 xs:mr-0">
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
                <Heading className="mb-6">Popular tags</Heading>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Link href={`/search?q=${tag}`} key={tag} prefetch>
                      <Button className="w-fit" key={tag} size={"xs"}>
                        {tag}
                        <Badge variant="tertiary">26</Badge>
                      </Button>
                    </Link>
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
                className="h-8 w-8 rounded-sm bg-black p-0"
                onClick={shareOnTwitter}
                size="sm"
                variant="ghost"
              >
                <span className="font-bold text-sm text-white">X</span>
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button
                aria-label="Compartir en LinkedIn"
                className="h-8 w-8 rounded-sm bg-[#0a66c2] p-0"
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
