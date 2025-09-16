"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { User } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";

export function UserInfo({
  preloadedCurrentUser,
}: {
  preloadedCurrentUser: Preloaded<typeof api.users.getCurrentUser>;
}) {
  const currentUser = usePreloadedQuery(preloadedCurrentUser);

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      {currentUser.image ? (
        <Image
          alt={currentUser.name || "Usuario"}
          className="h-8 w-8 rounded-full"
          height={32}
          src={currentUser.image}
          width={32}
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground text-sm">
          {currentUser.name || "Usuario"}
        </p>
        <p className="truncate text-muted-foreground text-xs">
          {currentUser.email}
        </p>
      </div>
      <Badge variant={currentUser.role === "admin" ? "default" : "secondary"}>
        {currentUser.role}
      </Badge>
    </div>
  );
}
