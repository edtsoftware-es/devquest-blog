"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function AuthPage() {
  const { signIn } = useAuthActions();
  return (
    <div>
      <button onClick={() => signIn("discord")} type="button">
        Sign in with Discord
      </button>
    </div>
  );
}
