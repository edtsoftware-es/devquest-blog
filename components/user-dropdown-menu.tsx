"use client";

import type { User } from "@auth/core/types";
import { LogInIcon, PcCaseIcon, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export function UserDropDownMenu({
  currentUser,
}: {
  currentUser: User | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Menú de usuario"
          className="h-auto p-0 text-neutral-900"
          type="button"
          variant="ghost"
        >
          {currentUser?.image ? (
            <Image
              alt={currentUser.name || "Usuario"}
              className="h-6 w-6 rounded-full"
              height={24}
              src={currentUser.image}
              width={24}
            />
          ) : (
            <>
              <User2Icon size={16} />
              <span className="ml-1 hidden md:block">Perfil</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            className="flex h-10 w-full items-center justify-between gap-4 text-primary-foreground"
            href="/dashboard"
            prefetch
          >
            <PcCaseIcon size={16} />
            <span className="w-full text-center">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <Separator className="bg-neutral-300" />
        <DropdownMenuItem hidden={!currentUser}>
          <SignOutButton />
        </DropdownMenuItem>
        <DropdownMenuItem hidden={currentUser !== null}>
          <Link
            className="flex h-10 w-full items-center justify-between gap-4 text-primary-foreground"
            href="/auth"
            prefetch
          >
            <LogInIcon size={16} />
            <span className="w-full text-center">Iniciar sesión</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
