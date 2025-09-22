import Image from "next/image";
import Link from "next/link";
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
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {posts.map((post) => (
        <CompactCard className="max-w-full" key={post._id} variant="reverse">
          <CompactCardImageContainer>
            <Image
              alt={`Image for ${post.title}`}
              className="rounded-[0.625rem]"
              fill
              quality={65}
              src={post.image || ""}
            />
          </CompactCardImageContainer>
          <CompactCardContent className="mr-0 xs:mr-0">
            <Link href={`/posts/${post.slug}`} prefetch>
              <span className="absolute inset-0 z-50" />
              <CompactCardTitle>{post.title}</CompactCardTitle>
            </Link>
            <CompactCardFooter className="mr-0 xs:mr-0">
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
