"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function SignInOptions() {
  const { signIn } = useAuthActions();
  return (
    <div className="flex w-full flex-col gap-4">
      <Button
        className="font-semibold text-sm"
        onClick={() => signIn("google")}
        type="button"
      >
        <Image alt="Google" height={26} src="/google-icon.svg" width={26} />
        Iniciar sesión con Google
      </Button>
      <Button
        className="font-semibold text-sm"
        onClick={() => signIn("discord")}
        type="button"
      >
        <Image alt="Discord" height={26} src="/discord-icon.svg" width={26} />
        Iniciar sesión con Discord
      </Button>
    </div>
  );
}
