"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";

export function SignOutButton() {
  const { signOut } = useAuthActions();

  function handleSignOut() {
    signOut();
    window.location.href = "/auth";
  }

  return (
    <div className="mt-10 flex w-full justify-end">
      <Button onClick={handleSignOut}>Cerrar sesión</Button>
    </div>
  );
}
