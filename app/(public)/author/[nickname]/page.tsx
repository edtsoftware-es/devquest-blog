import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import {
  AuthorCard,
  AuthorCardDescription,
  AuthorCardImageContainer,
  AuthorCardName,
} from "@/components/cards/author-card";
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
import { api } from "@/convex/_generated/api";

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ nickname: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { nickname } = await params;
  const { page } = await searchParams;

  const pageNumber = Number(page) || 1;

  const {
    author,
    posts,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
  } = await fetchQuery(api.posts.getPaginatedPostsWithAuthorByNickname, {
    nickname,
    page: pageNumber,
  });

  return (
    <main className="flex flex-col items-center px-4 sm:px-8">
      <section className="flex w-full max-w-6xl justify-center">
        <AuthorCard className="max-w-136 gap-y-3 border-none bg-background">
          <AuthorCardImageContainer className="mb-3">
            <Avatar className="size-full">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </AuthorCardImageContainer>
          <AuthorCardName className="text-[2.375rem]">
            {author.username}
          </AuthorCardName>
          <AuthorCardDescription>{author.bio}</AuthorCardDescription>
        </AuthorCard>
      </section>

      <section className="my-8 flex w-full max-w-6xl flex-col justify-center">
        <div className="flex flex-col gap-y-6">
          {posts.map((post) => (
            <StandardCard key={post._id}>
              <StandardCardImageContainer>
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
                <StandardCardTags className="xs:flex hidden" tags={post.tags} />
                <StandardCardContent>
                  <StandardCardHeader>
                    <StandardCardTitle>{post.title}</StandardCardTitle>
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
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AF</AvatarFallback>
                      </Avatar>
                      <StandardCardAuthorName>
                        {post.authorName}
                      </StandardCardAuthorName>
                    </StandardCardAuthor>
                    <StandardCardPublishedAt>
                      {post.publishedAt}
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
    </main>
  );
}
