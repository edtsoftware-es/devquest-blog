"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function SignOutButton() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth");
  };

  return (
    <div className="mt-10 flex w-full justify-end">
      <Button onClick={handleSignOut} type="button">
        Cerrar sesión
      </Button>
    </div>
  );
}
