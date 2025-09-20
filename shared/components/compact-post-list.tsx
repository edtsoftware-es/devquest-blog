import Image from "next/image";
import {
  CompactCard,
  CompactCardContent,
  CompactCardFooter,
  CompactCardImageContainer,
  CompactCardPublishedAt,
  CompactCardReadingTime,
  CompactCardTitle,
} from "@/components/cards/compact-card";
import type { Post } from "@/convex/lib/types";
import { cn, getPublishedDate } from "@/lib/utils";

export default function CompactPostList({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {posts.map((post) => (
        <CompactCard key={post._id} variant="reverse">
          <CompactCardImageContainer>
            <Image
              alt={`Image for ${post.title}`}
              className="rounded-[0.625rem]"
              fill
              src={post.image || ""}
            />
          </CompactCardImageContainer>
          <CompactCardContent className="mr-0">
            <CompactCardTitle>{post.title}</CompactCardTitle>
            <CompactCardFooter className="mr-0">
              <CompactCardPublishedAt>
                {getPublishedDate(post.publishedAt ?? post._creationTime)}
              </CompactCardPublishedAt>
              <CompactCardReadingTime>
                {post.duration} mins
              </CompactCardReadingTime>
            </CompactCardFooter>
          </CompactCardContent>
        </CompactCard>
      ))}
    </div>
  );
}
