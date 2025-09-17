import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Hero from "./components/hero";

const MAX_DEFAULT_POSTS = 5;

export default async function Home() {
  const posts = await fetchQuery(api.posts.getPublishedAuthorPosts, {});

  return (
    <main className="flex w-full justify-center">
      <Hero posts={posts.page.slice(0, MAX_DEFAULT_POSTS)} />
    </main>
  );
}
