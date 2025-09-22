"use client";
import { useConvexAuth } from "convex/react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";

const DEBOUNCE_TIME = 500;
const DESKTOP_RECOMMENDED_LIMIT = 4;
const MOBILE_RECOMMENDED_LIMIT = 6;

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

  const trimmedSearch = searchVal.trim();
  const debouncedPrefetch = useDebouncedCallback((searchTerm: string) => {
    if (searchTerm !== "") {
      router.prefetch(`/search?q=${searchTerm}`);
    }
  }, DEBOUNCE_TIME);

  const resetAndClose = () => {
    setOpen(false);
    setSearchVal("");
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/categories/${slug}`);
    resetAndClose();
  };

  const handleCategoryHover = (slug: string) => {
    router.prefetch(`/categories/${slug}`);
  };

  const handlePostClick = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    if (trimmedSearch === "") {
      return;
    }
    resetAndClose();
    router.push(`/search?q=${trimmedSearch}`);
  };

  useEffect(() => {
    debouncedPrefetch(trimmedSearch);
  }, [trimmedSearch, debouncedPrefetch]);

  const triggerButton = (
    <Button
      aria-label="Buscar contenido"
      className="h-auto p-0 pr-4 xs:pr-8 md:pr-0"
      type="button"
      variant="link"
    >
      <SearchIcon size={16} />
      <span>Buscar</span>
    </Button>
  );

  const postsToDisplay = recommendedPosts.slice(
    0,
    isDesktop ? DESKTOP_RECOMMENDED_LIMIT : MOBILE_RECOMMENDED_LIMIT
  );

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent
          className="!w-[991px] !max-w-none top-[42%] px-14 py-10"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-heading-5">Buscar</DialogTitle>
          </DialogHeader>
          <SearchContent
            categories={categories}
            isAuthenticated={isAuthenticated}
            isDesktop={isDesktop}
            onCategoryClick={handleCategoryClick}
            onCategoryHover={handleCategoryHover}
            onPostClick={handlePostClick}
            onSearch={handleSearch}
            onSearchValueChange={setSearchVal}
            posts={postsToDisplay}
            searchValue={searchVal}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-heading-5">Buscar</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <SearchContent
            categories={categories}
            className="gap-4"
            isAuthenticated={isAuthenticated}
            isDesktop={isDesktop}
            onCategoryClick={handleCategoryClick}
            onCategoryHover={handleCategoryHover}
            onPostClick={handlePostClick}
            onSearch={handleSearch}
            onSearchValueChange={setSearchVal}
            posts={postsToDisplay}
            searchValue={searchVal}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type SearchContentProps = {
  categories: Category[];
  className?: string;
  isAuthenticated: boolean;
  isDesktop: boolean;
  onCategoryClick: (slug: string) => void;
  onCategoryHover: (slug: string) => void;
  onPostClick: () => void;
  onSearch: () => void;
  onSearchValueChange: (value: string) => void;
  posts: Post[];
  searchValue: string;
};

function SearchContent({
  categories,
  className,
  isAuthenticated,
  isDesktop,
  onCategoryClick,
  onCategoryHover,
  onPostClick,
  onSearch,
  onSearchValueChange,
  posts,
  searchValue,
}: SearchContentProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className={cn("mt-4 flex gap-2", isDesktop ? "" : "flex-col")}>
        <Input
          className={cn("rounded-full px-5", isDesktop ? "h-full" : "h-12")}
          onChange={(event) => onSearchValueChange(event.target.value)}
          placeholder="¿Qué estás buscando?"
          value={searchValue}
        />
        <Button className="rounded-full" onClick={onSearch} variant="secondary">
          Buscar
        </Button>
      </div>
      <div
        className={cn(
          "mt-4 flex flex-wrap lg:mt-0",
          isDesktop ? "gap-2" : "gap-3"
        )}
      >
        {categories.map((category) => (
          <Button
            className="w-fit"
            key={category._id}
            onClick={() => onCategoryClick(category.slug)}
            onMouseEnter={() => onCategoryHover(category.slug)}
            size="xs"
          >
            {category.name}
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
          {posts.map((post) => (
            <CompactCard
              className="h-full w-full max-w-full border-transparent bg-background duration-300 hover:border-neutral-600"
              key={post._id}
            >
              <CompactCardImageContainer>
                {/* biome-ignore lint/performance/noImgElement: Using native img keeps card layout simple without extra Next.js config */}
                {/* biome-ignore lint/nursery/useImageSize: Images have responsive container sizing; explicit dimensions would break layout */}
                <img
                  alt={post.title}
                  className="h-full w-full rounded-[0.625rem] object-cover"
                  src={post.image}
                />
              </CompactCardImageContainer>
              <CompactCardContent className="mr-0 xs:mr-0">
                <Link
                  href={`/posts/${post.slug}`}
                  onClick={onPostClick}
                  prefetch
                >
                  <span className="absolute inset-0 z-50" />
                  <CompactCardTitle>{post.title}</CompactCardTitle>
                </Link>
                <CompactCardFooter className="mr-0 xs:mr-0">
                  <CompactCardPublishedAt>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post._creationTime).toLocaleDateString()}
                  </CompactCardPublishedAt>
                  <CompactCardReadingTime>
                    {post.duration} min
                  </CompactCardReadingTime>
                </CompactCardFooter>
              </CompactCardContent>
            </CompactCard>
          ))}
        </div>
      </div>
    </div>
  );
}
