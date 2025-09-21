import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  StandardCard,
  StandardCardAuthor,
  StandardCardAuthorContainer,
  StandardCardAuthorName,
  StandardCardContent,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardHeader,
  StandardCardImageContainer,
  StandardCardPublishedAt,
  StandardCardReadingTime,
  StandardCardShell,
  StandardCardStats,
  StandardCardTags,
  StandardCardTitle,
} from "@/components/cards/standard-card";
import { PaginationNavigation } from "@/components/pagination-navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/utils";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const currentSearchQuery = q || "";
  const pageNumber = Number(page) || 1;

  const {
    posts,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    totalPosts,
    searchQuery,
  } = await fetchQuery(api.posts.getPaginatedSearchResults, {
    query: currentSearchQuery,
    page: pageNumber,
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
              <BreadcrumbPage>Search results</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <SearchQueryResults searchQuery={searchQuery} totalPosts={totalPosts} />
      </div>

      {posts.length > 0 && (
        <section className="my-8 flex w-full max-w-6xl flex-col justify-center">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 [@media(min-width:936px)]:grid-cols-2">
            {posts.map((post) => (
              <StandardCard key={post._id} variant="compact">
                <StandardCardImageContainer className="lg:w-full">
                  <Image
                    alt={post.title}
                    className="h-full w-full object-cover"
                    fill
                    src={"/images/galaxia.jpg"}
                  />
                  <StandardCardTags
                    className="absolute bottom-3 left-3 z-10 xs:hidden"
                    tags={post.tags}
                  />
                </StandardCardImageContainer>
                <StandardCardShell>
                  <StandardCardTags
                    className="xs:flex hidden"
                    tags={post.tags}
                  />
                  <StandardCardContent>
                    <StandardCardHeader>
                      <Link href={`/posts/${post.slug}`} prefetch>
                        <span className="absolute inset-0 z-50" />
                        <StandardCardTitle>{post.title}</StandardCardTitle>
                      </Link>
                      <StandardCardReadingTime>
                        {`${post.duration} mins`}
                      </StandardCardReadingTime>
                    </StandardCardHeader>
                    <StandardCardDescription>
                      {post.excerpt}
                    </StandardCardDescription>
                  </StandardCardContent>
                  <StandardCardFooter>
                    <StandardCardAuthorContainer>
                      <StandardCardAuthor>
                        <Avatar className="size-8 xs:size-10">
                          <AvatarImage src={post.authorImage} />
                          <AvatarFallback>
                            {post.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <StandardCardAuthorName>
                          {post.authorName}
                        </StandardCardAuthorName>
                      </StandardCardAuthor>
                      <StandardCardPublishedAt>
                        {formatDate(post.publishedAt)}
                      </StandardCardPublishedAt>
                    </StandardCardAuthorContainer>
                    <StandardCardStats
                      commentsCount={post.commentsCount}
                      viewsCount={post.viewCount}
                    />
                  </StandardCardFooter>
                </StandardCardShell>
              </StandardCard>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex w-full max-w-6xl justify-center">
              <PaginationNavigation
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </section>
      )}
    </main>
  );
}

type SearchQueryResultsProps = {
  searchQuery: string;
  totalPosts: number;
};

function SearchQueryResults({
  searchQuery,
  totalPosts,
}: SearchQueryResultsProps) {
  if (!searchQuery) {
    return (
      <p className="py-8 font-normal text-base text-neutral-600">
        Introduce un término de búsqueda para encontrar posts
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-y-4 pb-8">
      <h1 className="line-clamp-2 break-words font-semibold text-3xl xs:text-4xl leading-[1.2] md:text-6xl">{`“${searchQuery}”`}</h1>
      <p className="font-normal text-neutral-600 text-sm">
        {`Se han encontrado ${totalPosts} resultado${totalPosts !== 1 ? "s" : ""} para “${searchQuery}”`}
      </p>
    </section>
  );
}
