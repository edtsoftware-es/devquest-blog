"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";
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
    <div className="flex w-full justify-end">
      <Button
        className="flex h-10 gap-4 p-0 text-primary-foreground"
        onClick={handleSignOut}
        type="button"
        variant="link"
      >
        <LogOut size={16} />
        <span className="w-full text-center">Cerrar sesión</span>
      </Button>
    </div>
  );
}
