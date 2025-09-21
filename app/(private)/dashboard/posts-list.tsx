"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import {
  Calendar,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

const MAX_VISIBLE_TAGS = 3;

export function PostsList({
  preloadedPosts,
}: {
  preloadedPosts: Preloaded<typeof api.posts.getPostsByUserRole>;
}) {
  const posts = usePreloadedQuery(preloadedPosts);
  const deletePost = useMutation(api.posts.deletePost).withOptimisticUpdate(
    (localStore, args) => {
      const existingPosts = localStore.getQuery(
        api.posts.getPostsByUserRole,
        {}
      );
      if (existingPosts !== undefined) {
        const updatedPosts = existingPosts.filter(
          (post) => post._id !== args.postId
        );
        localStore.setQuery(api.posts.getPostsByUserRole, {}, updatedPosts);
      }
    }
  );

  const togglePostPublished = useMutation(
    api.posts.togglePostPublished
  ).withOptimisticUpdate((localStore, args) => {
    const existingPosts = localStore.getQuery(api.posts.getPostsByUserRole, {});
    if (existingPosts !== undefined) {
      const updatedPosts = existingPosts.map((post) => {
        if (post._id === args.postId) {
          const now = Date.now();
          const newPublishedState = !post.published;
          return {
            ...post,
            published: newPublishedState,
            updatedAt: now,
            publishedAt: newPublishedState ? now : undefined,
          };
        }
        return post;
      });
      localStore.setQuery(api.posts.getPostsByUserRole, {}, updatedPosts);
    }
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-medium text-foreground text-lg">
            No hay posts
          </h3>
          <p className="text-muted-foreground text-sm">
            Crea tu primer post para comenzar
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
              key={post._id}
            >
              <div className="flex items-start gap-4">
                {post.image && (
                  <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      alt={post.title}
                      className="h-24 w-24 object-cover transition-transform hover:scale-105"
                      decoding={index < 4 ? "sync" : "async"}
                      height={96}
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 4}
                      src={post.image}
                      width={96}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="truncate font-semibold text-foreground text-lg">
                      {post.title}
                    </h3>
                    <Badge
                      className="flex items-center gap-1"
                      variant={post.published ? "default" : "secondary"}
                    >
                      {post.published ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Publicado
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Borrador
                        </>
                      )}
                    </Badge>
                  </div>

                  <p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-muted-foreground text-xs">
                    {post.authorName && post.authorName !== "" && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.authorName}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post._creationTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount} vistas
                    </div>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                        <Badge className="text-xs" key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > MAX_VISIBLE_TAGS && (
                        <Badge className="text-xs" variant="outline">
                          +{post.tags.length - MAX_VISIBLE_TAGS} más
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/posts/${post.slug}`} prefetch>
                    <Eye className="mr-1 h-3 w-3" />
                    Ver
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/posts/edit/${post._id}`} prefetch>
                    <Edit3 className="mr-1 h-3 w-3" />
                    Editar
                  </Link>
                </Button>

                <Button
                  onClick={() => {
                    void togglePostPublished({ postId: post._id });
                  }}
                  size="sm"
                  variant={post.published ? "secondary" : "default"}
                >
                  {post.published ? (
                    <>
                      <EyeOff className="mr-1 h-3 w-3" />
                      Despublicar
                    </>
                  ) : (
                    <>
                      <Globe className="mr-1 h-3 w-3" />
                      Publicar
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    void deletePost({ postId: post._id });
                  }}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Borrar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
