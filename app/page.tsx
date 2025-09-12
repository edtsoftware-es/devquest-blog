import { fetchQuery } from "convex/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { api } from "@/convex/_generated/api";

export default async function Home() {
  const posts = await fetchQuery(api.posts.getPublishedPosts, { limit: 10 });
  return (
    <main>
      <ModeToggle />
      <h1 className="font-bold text-3xl underline">Hello, DevQuest!</h1>
      {posts.map((post) => {
        return <p key={post._id}>{JSON.stringify(post)}</p>;
      })}
    </main>
  );
}
