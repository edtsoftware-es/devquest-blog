import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  AuthorCard,
  AuthorCardDescription,
  AuthorCardImageContainer,
  AuthorCardName,
  AuthorCardNickname,
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
import { formatDate } from "@/lib/utils";

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
        <AuthorCard className="max-w-136 gap-y-6 border-none bg-background">
          <AuthorCardImageContainer>
            <Avatar className="size-full">
              <AvatarImage src={author.avatarUrl} />
              <AvatarFallback>
                {author.username?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
          </AuthorCardImageContainer>
          <div className="flex flex-col items-center gap-1">
            <AuthorCardName className="text-[2.375rem] leading-[1.2]">
              {author.username}
            </AuthorCardName>
            <AuthorCardNickname>
              {author.nickname ? `@${author.nickname}` : ""}
            </AuthorCardNickname>
          </div>
          <AuthorCardDescription>{author.bio}</AuthorCardDescription>
        </AuthorCard>
      </section>

      {posts.length > 0 && (
        <section className="mb-8 flex w-full max-w-6xl flex-col justify-center">
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
