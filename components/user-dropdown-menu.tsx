"use client";

import { useConvexAuth } from "convex/react";
import { LogInIcon, PcCaseIcon, User2Icon } from "lucide-react";
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

export function UserDropDownMenu() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Menú de usuario"
          className="h-auto p-0 text-neutral-900"
          type="button"
          variant="ghost"
        >
          <User2Icon size={16} />
          <span className="ml-1 hidden md:block">Perfil</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            className="flex h-10 w-full items-center justify-between gap-4 text-white"
            href="/dashboard"
            prefetch
          >
            <PcCaseIcon size={16} />
            <span className="w-full text-center">Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <Separator className="bg-neutral-300" />
        <DropdownMenuItem hidden={!isAuthenticated}>
          <SignOutButton />
        </DropdownMenuItem>
        <DropdownMenuItem hidden={isAuthenticated}>
          <Link
            className="flex h-10 w-full items-center justify-between gap-4 text-white"
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
