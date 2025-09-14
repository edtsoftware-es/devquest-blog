"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { signIn } = useAuthActions();
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <h1 className="font-bold text-3xl underline">Bienvenido</h1>
        <Button onClick={() => signIn("discord")} type="button">
          Sign in with Discord
        </Button>
        <Button onClick={() => signIn("google")} type="button">
          Sign in with Google
        </Button>
      </div>
    </main>
  );
}
