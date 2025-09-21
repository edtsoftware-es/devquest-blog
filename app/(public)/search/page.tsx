import { preloadQuery } from "convex/nextjs";
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
import SearchList from "./search-list";

export const DEFAULT_SEARCH_POSTS_LIMIT = 8;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const preloaded = await preloadQuery(api.posts.getSearchPosts, {
    q,
    paginationOpts: { numItems: DEFAULT_SEARCH_POSTS_LIMIT, cursor: null },
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
              <BreadcrumbPage>Resultados de búsqueda</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="line-clamp-2 break-words pb-8 font-semibold text-3xl xs:text-4xl leading-[1.2] md:text-6xl">
          {q
            ? `“${q}”`
            : "Introduce un término de búsqueda para encontrar posts"}
        </h1>
      </div>

      <SearchList preloaded={preloaded} q={q} />
    </main>
  );
}
