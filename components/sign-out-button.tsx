"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/auth");
    } catch {
      // no-op; optionally surface a toast
    }
  };

  return (
    <div className="mt-10 flex w-full justify-end">
      <Button type="button" onClick={handleSignOut}>Cerrar sesión</Button>
    </div>
  );
}
