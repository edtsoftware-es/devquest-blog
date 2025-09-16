"use client";

import { Moon, PcCaseIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto hover:text-white" size="icon" variant="link">
          <Sun className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={cn("cursor-pointer", {
            "border border-neutral-400 bg-neutral-300": theme === "light",
          })}
          onClick={() => setTheme("light")}
        >
          <Sun className="mr-2" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer", {
            "border border-neutral-400 bg-neutral-300": theme === "dark",
          })}
          onClick={() => setTheme("dark")}
        >
          <Moon className="mr-2" />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn("cursor-pointer", {
            "border border-neutral-400 bg-neutral-300": theme === "system",
          })}
          onClick={() => setTheme("system")}
        >
          <PcCaseIcon className="mr-2" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
