import { fetchQuery, preloadQuery } from "convex/nextjs";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import PostList from "./post-list";

export const DEFAULT_CATEGORY_POSTS_LIMIT = 8;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await fetchQuery(api.categories.getCategoryBySlug, {
    slug,
  });

  return (
    <main className="flex flex-col items-center px-4 sm:px-8">
      <div className="flex w-full max-w-6xl flex-col justify-center">
        <Breadcrumb className="py-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" prefetch>
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category?.name || slug}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex w-full max-w-6xl flex-col justify-center">
        <CategoryPageContent
          categoryId={category?._id}
          categoryName={category?.name}
          slug={slug}
        />
      </div>
    </main>
  );
}

async function CategoryPageContent({
  slug,
  categoryId,
  categoryName,
}: {
  slug: string;
  categoryId?: Id<"categories">;
  categoryName?: string;
}) {
  if (!categoryId) {
    return (
      <h1 className="line-clamp-2 break-words pb-8 font-semibold text-3xl xs:text-4xl leading-[1.2] md:text-6xl">
        {`No se ha encontrado la categoría “${slug}”`}
      </h1>
    );
  }

  const preloaded = await preloadQuery(api.posts.getPostsByCategoryId, {
    categoryId,
    paginationOpts: { numItems: DEFAULT_CATEGORY_POSTS_LIMIT, cursor: null },
  });

  return (
    <>
      <h1 className="line-clamp-2 break-words pb-8 font-semibold text-3xl xs:text-4xl leading-[1.2] md:text-6xl">
        {categoryName}
      </h1>

      <PostList categoryId={categoryId} preloaded={preloaded} />
    </>
  );
}
