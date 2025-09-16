import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function Home() {
  const posts = await fetchQuery(api.posts.getPublishedPosts, {});
  return (
    <main>
      <h1 className="font-bold text-3xl underline">Hello, DevQuest!</h1>
      {posts.page.map((post) => {
        return <p key={post._id}>{JSON.stringify(post)}</p>;
      })}
    </main>
  );
}
