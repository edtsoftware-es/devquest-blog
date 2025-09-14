import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { RoleButton } from "./role-button";
import { PostsList } from "./posts-list";

export default async function DashboardPage() {
  const token = await convexAuthNextjsToken();
  const [preloadedPosts, preloadedUserRole] = await Promise.all([
    preloadQuery(api.posts.getPostsByUserRole, {}, { token }),
    preloadQuery(api.users.getUserRole, {}, { token }),
  ]);
  return (
    <div>
      <RoleButton preloadedUserRole={preloadedUserRole} />
      <h1>Posts</h1>
      <PostsList preloadedPosts={preloadedPosts} />
    </div>

  )
}
