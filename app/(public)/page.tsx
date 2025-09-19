import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Explore, { MockCategories } from "./components/explore";
import Hero from "./components/hero";
import Trending from "./components/trending";

const MAX_DEFAULT_POSTS = 5;

export default async function Home() {
  const posts = await fetchQuery(api.posts.getPublishedAuthorPosts, {});

  return (
    <main className="flex w-full flex-col items-center">
      <Hero posts={posts.page.slice(0, MAX_DEFAULT_POSTS)} />
      <Explore categories={MockCategories} className="mt-8 px-4" />
      <div className="mt-10 flex w-full flex-col items-center justify-center px-4 xl:max-w-[1200px]">
        <Trending />
      </div>
      <div className="flex h-96 items-center justify-center">hola</div>
    </main>
  );
}
