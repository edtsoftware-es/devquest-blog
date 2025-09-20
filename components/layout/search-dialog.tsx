"use client";
import { useConvexAuth } from "convex/react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { Category, Post } from "@/types";
import {
  CompactCard,
  CompactCardContent,
  CompactCardFooter,
  CompactCardImageContainer,
  CompactCardPublishedAt,
  CompactCardReadingTime,
  CompactCardTitle,
} from "../cards/compact-card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";

const DEBOUNCE_TIME = 500;

export function SearchDialog({
  categories,
  recommendedPosts,
}: {
  categories: Category[];
  recommendedPosts: Post[];
}) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const debouncedPrefetch = useDebouncedCallback((searchTerm: string) => {
    if (searchTerm.trim() !== "") {
      router.prefetch(`/search?q=${searchTerm}`);
    }
  }, DEBOUNCE_TIME);

  const handleSearch = () => {
    if (searchVal.trim() === "") {
      return;
    }
    setOpen(false);
    setSearchVal("");
    router.push(`/search?q=${searchVal}`);
  };

  useEffect(() => {
    debouncedPrefetch(searchVal);
  }, [searchVal, debouncedPrefetch]);

  const SearchContent = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className={cn("mt-4 flex gap-2", isDesktop ? "" : "flex-col")}>
        <Input
          className={cn("rounded-full px-5", isDesktop ? "h-full" : "h-12")}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="¿Qué estás buscando?"
          value={searchVal}
        />
        <Button
          className="rounded-full"
          onClick={handleSearch}
          variant={"secondary"}
        >
          Buscar
        </Button>
      </div>
      <div
        className={cn(
          "mt-4 flex flex-wrap lg:mt-0",
          isDesktop ? "gap-2" : "gap-3"
        )}
      >
        {categories.map((category: Category) => (
          <Button
            className="w-fit"
            key={category._id}
            onClick={() => {
              router.push(`/categories/${category.slug}`);
              setOpen(false);
              setSearchVal("");
            }}
            onMouseEnter={() => router.prefetch(`/categories/${category.slug}`)}
            size={"xs"}
          >
            {category.name}
            <Badge variant="tertiary">26</Badge>
          </Button>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <p className="text-heading-5">
          {isAuthenticated ? "Recomendado para ti" : "Últimos artículos"}
        </p>
        <div
          className={cn(
            "grid gap-3",
            isDesktop ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {recommendedPosts.slice(0, isDesktop ? 4 : 6).map((post: Post) => (
            <CompactCard
              className="h-full w-full border-none bg-background"
              key={post._id}
              onClick={() => {
                router.push(`/posts/${post.categoryId}/${post.slug}`);
                setOpen(false);
              }}
            >
              <CompactCardImageContainer>
                <img
                  alt={post.title}
                  className="h-full w-full rounded-[0.625rem] object-cover"
                  src={post.image}
                />
              </CompactCardImageContainer>
              <CompactCardContent>
                <CompactCardTitle>{post.title}</CompactCardTitle>
                <CompactCardFooter>
                  <CompactCardPublishedAt>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post._creationTime).toLocaleDateString()}
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
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button
            aria-label="Buscar contenido"
            className="h-auto p-0 pr-4 xs:pr-8 text-neutral-900 md:pr-0"
            type="button"
            variant="link"
          >
            <SearchIcon size={16} />
            <span>Buscar</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="!w-[991px] !max-w-none top-[35%] px-14 py-10"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-heading-5">Buscar</DialogTitle>
          </DialogHeader>
          <SearchContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button
          aria-label="Buscar contenido"
          className="h-auto p-0 pr-4 xs:pr-8 text-neutral-900 md:pr-0"
          type="button"
          variant="link"
        >
          <SearchIcon size={16} />
          <span>Buscar</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-heading-5">Buscar</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <SearchContent className="gap-4" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
