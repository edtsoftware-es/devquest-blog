"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LAST_PROVIDER_KEY = "devquest-blog-last-auth-provider";

export function SignInOptions() {
  const { signIn } = useAuthActions();

  const getLastProvider = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LAST_PROVIDER_KEY);
    }
    return null;
  };

  const handleSignIn = (provider: "google" | "discord") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("devquest-blog-pending-provider", provider);
    }
    signIn(provider);
  };

  const lastProvider = getLastProvider();

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative">
        <Button
          className="w-full font-semibold text-sm"
          onClick={() => handleSignIn("google")}
          type="button"
        >
          <Image alt="Google" height={26} src="/google-icon.svg" width={26} />
          Iniciar sesión con Google
        </Button>
        {lastProvider === "google" && <LastUsedBadge />}
      </div>

      <div className="relative">
        <Button
          className="w-full font-semibold text-sm"
          onClick={() => handleSignIn("discord")}
          type="button"
        >
          <Image alt="Discord" height={26} src="/discord-icon.svg" width={26} />
          Iniciar sesión con Discord
        </Button>
        {lastProvider === "discord" && <LastUsedBadge />}
      </div>
    </div>
  );
}

function LastUsedBadge() {
  return (
    <Badge
      className="-right-2 -top-2 absolute bg-blue-100 px-2 py-1 text-blue-800 text-xs dark:bg-blue-900 dark:text-blue-200"
      variant="secondary"
    >
      Reciente
    </Badge>
  );
}
