import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { PostsList } from "./posts-list";
import { RoleButton } from "./role-button";
import { UserInfo } from "./user-info";

export default async function DashboardPage() {
  const token = await convexAuthNextjsToken();
  const [preloadedPosts, preloadedUserRole, preloadedCurrentUser] =
    await Promise.all([
      preloadQuery(api.posts.getPostsByUserRole, {}, { token }),
      preloadQuery(api.users.getUserRole, {}, { token }),
      preloadQuery(api.users.getCurrentUser, {}, { token }),
    ]);
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-medium text-2xl text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Gestiona tu contenido
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <RoleButton preloadedUserRole={preloadedUserRole} />
                <UserInfo preloadedCurrentUser={preloadedCurrentUser} />
              </div>
              <Button asChild>
                <Link href="/dashboard/posts/create" prefetch>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Post
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-medium text-foreground text-lg">Posts</h2>
          </div>

          <PostsList preloadedPosts={preloadedPosts} />
        </div>
      </div>
    </div>
  );
}
