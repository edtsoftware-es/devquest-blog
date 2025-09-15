"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export function RoleButton({
  preloadedUserRole,
}: {
  preloadedUserRole: Preloaded<typeof api.users.getUserRole>;
}) {
  const role = usePreloadedQuery(preloadedUserRole);
  const changeRole = useMutation(api.users.changeRole);

  return (
    <Button onClick={() => changeRole()} size="sm" variant="outline">
      <RotateCcw className="mr-2 h-3 w-3" />
      {role === "admin" ? "Admin" : "User"}
    </Button>
  );
}
