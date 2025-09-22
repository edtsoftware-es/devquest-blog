import { fetchQuery, preloadQuery } from "convex/nextjs";
import CompactPostList from "@/components/compact-post-list";
import { Heading, SectionHeading } from "@/components/headings";
import StandardPostList from "@/components/standard-post-list";
import TagList from "@/components/tag-list";
import { api } from "@/convex/_generated/api";
import { HOME_POSTS_LIMIT } from "@/convex/posts";
import Explore from "./components/explore";
import Hero from "./components/hero";
import Trending from "./components/trending";

export const DEFAULT_LATEST_POSTS_LIMIT = 5;

export default async function Home() {
  const posts = await fetchQuery(api.posts.getHomePosts, {});
  const preloaded = await preloadQuery(api.posts.getLatestPosts, {
    paginationOpts: { numItems: DEFAULT_LATEST_POSTS_LIMIT, cursor: null },
  });

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <Hero posts={posts.mainPosts.slice(0, HOME_POSTS_LIMIT)} />
      <Explore categories={posts.categories} className="px-4" />
      <section className="flex w-full flex-col items-center justify-center px-4 xl:max-w-[1200px]">
        <Trending
          compactPosts={posts.compactPosts}
          highLightPosts={posts.highLightPosts}
          mainPopularPost={posts.mainPopularPost}
        />
      </section>
      <section className="flex w-full max-w-[1200px] flex-col-reverse gap-12 px-4 lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <SectionHeading
            subtitle="Mantente siempre al día"
            title="Últimas novedades"
          />
          <StandardPostList preloaded={preloaded} />
        </div>

        <aside className="flex h-full w-full flex-col lg:col-span-1">
          <div className="sticky top-0 flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Heading className="border border-transparent py-4">
                Tendencias semanales
              </Heading>
              <CompactPostList posts={posts.weeklys} />
            </div>
            <div className="flex flex-col gap-2">
              <Heading className="border border-transparent py-4">
                Popular Tags
              </Heading>
              <TagList tags={posts.popularTags} />
            </div>
          </div>
        </aside>
      </section>
      <section />
    </div>
  );
}
