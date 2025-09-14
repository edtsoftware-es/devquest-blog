'use client'

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export function RoleButton({ preloadedUserRole }: { preloadedUserRole: Preloaded<typeof api.users.getUserRole> }) {
    const role = usePreloadedQuery(preloadedUserRole);
    const changeRole = useMutation(api.users.changeRole);
  return <div><p>Your role is {role}</p>
  <Button onClick={() => changeRole()}>
    Change role to {role === "admin" ? "user" : "admin"}
  </Button>
  </div>;
}