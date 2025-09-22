import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import {
  AuthorCard,
  AuthorCardDescription,
  AuthorCardImageContainer,
  AuthorCardName,
  AuthorCardNickname,
} from "@/components/cards/author-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import AuthorPostList from "./author-post-list";

export const DEFAULT_AUTHOR_POSTS_LIMIT = 8;

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ nickname: string }>;
}) {
  const { nickname } = await params;

  const preloaded = await preloadQuery(api.posts.getPostsAndAuthorByNickname, {
    nickname,
    paginationOpts: { numItems: DEFAULT_AUTHOR_POSTS_LIMIT, cursor: null },
  });

  const data = preloadedQueryResult(preloaded);

  return (
    <main className="flex flex-col items-center px-4 sm:px-8">
      <section className="flex w-full max-w-6xl justify-center">
        <AuthorCard className="max-w-136 gap-y-6 border-none bg-background">
          <AuthorCardImageContainer>
            <Avatar className="size-full">
              <AvatarImage src={data.author.avatarUrl} />
              <AvatarFallback>
                {data.author.username?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
          </AuthorCardImageContainer>
          <div className="flex flex-col items-center gap-1">
            <AuthorCardName className="text-[2.375rem] leading-[1.2]">
              {data.author.username}
            </AuthorCardName>
            {data.author.nickname && (
              <AuthorCardNickname>
                {`@${data.author.nickname}`}
              </AuthorCardNickname>
            )}
          </div>
          <AuthorCardDescription>{data.author.bio}</AuthorCardDescription>
        </AuthorCard>
      </section>

      <AuthorPostList nickname={nickname} preloaded={preloaded} />
    </main>
  );
}
