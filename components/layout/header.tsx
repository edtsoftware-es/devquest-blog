import { fetchQuery } from "convex/nextjs";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import type { Category } from "@/types";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { UserDropDownMenu } from "../user-dropdown-menu";
import { SearchDialog } from "./search-dialog";

export default async function Header() {
  const categories = await fetchQuery(api.categories.getAllCategories, {});
  const recommendedPosts = await fetchQuery(api.posts.recommendedPosts, {});

  return (
    <header className="flex w-full items-center justify-center px-3 md:px-7">
      <div className="mt-7 flex h-20 w-full max-w-6xl flex-row-reverse items-center justify-between rounded-2xl bg-primary px-3 md:flex-row md:px-7">
        <section className="hidden items-center gap-9 md:flex">
          <div className="flex items-center">
            <Image
              alt="Convex Logo"
              height={32}
              src="/devi-laptop.svg"
              width={32}
            />
            <Image
              alt="DevQuest Logo"
              className="ml-3 inline-block pt-[1px] dark:hidden"
              height={100}
              src="/logo-black.svg"
              width={100}
            />
            <Image
              alt="DevQuest Logo"
              className="ml-3 hidden pt-[1px] dark:inline-block"
              height={100}
              src="/logo-white.svg"
              width={100}
            />
          </div>
          <nav>
            <ul className="flex gap-10">
              <li>
                <Button
                  asChild
                  className="h-auto p-0 text-neutral-900"
                  variant="link"
                >
                  <Link href="/">Inicio</Link>
                </Button>
              </li>
              <li>
                <CategoriesDropdown categories={categories} />
              </li>
              <li>
                <Button
                  asChild
                  className="h-auto p-0 text-neutral-900"
                  variant="link"
                >
                  <Link
                    href="https://cursos.devtalles.com/"
                    rel="noopener"
                    target="_blank"
                  >
                    Cursos
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </section>
        <div className="flex items-center md:hidden">
          <MobileMenu />
        </div>
        <section className="flex h-3/5 w-full items-center justify-between gap-4 md:w-auto md:border-neutral-300 md:border-l-2 md:pl-4">
          <div className="flex items-center md:hidden">
            <Image
              alt="Convex Logo"
              height={32}
              src="/devi-laptop.svg"
              width={32}
            />
            <Image
              alt="DevQuest Logo"
              className="ml-3 inline-block pt-[1px] dark:hidden"
              height={100}
              src="/logo-black.svg"
              width={100}
            />
            <Image
              alt="DevQuest Logo"
              className="ml-3 hidden pt-[1px] dark:inline-block"
              height={100}
              src="/logo-white.svg"
              width={100}
            />
          </div>
          <SearchDialog
            categories={categories}
            recommendedPosts={recommendedPosts}
          />
          <div className="hidden items-center md:flex">
            <ModeToggle />
          </div>
          <div className="hidden items-center md:flex">
            <UserDropDownMenu />
          </div>
        </section>
      </div>
    </header>
  );
}

function CategoriesDropdown({ categories }: { categories: Category[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-auto p-0 text-neutral-900"
          type="button"
          variant="link"
        >
          Categorías
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {categories.map((category: Category) => (
          <DropdownMenuItem asChild key={category._id}>
            <Link href={`/categories/${category.slug}`} prefetch>
              {category.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Abrir menú de navegación"
          size="icon"
          type="button"
          variant="ghost"
        >
          <MenuIcon className="text-neutral-900" size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between">
        <SheetHeader className="sr-only">
          <SheetTitle>Menú</SheetTitle>
          <SheetDescription>Menú de navegación</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col pt-20">
          <ul className="flex flex-col">
            <li>
              <SheetClose asChild>
                <Button
                  asChild
                  className="w-full border-y-1 border-b-1 p-0 text-neutral-900"
                  variant="link"
                >
                  <Link href="/">Inicio</Link>
                </Button>
              </SheetClose>
            </li>
            <li>
              <SheetClose asChild>
                <Button
                  asChild
                  className="w-full border-b-1 p-0 text-neutral-900"
                  variant="link"
                >
                  <Link href="/categories">Categorías</Link>
                </Button>
              </SheetClose>
            </li>
            <li>
              <SheetClose asChild>
                <Button
                  asChild
                  className="w-full border-b-1 p-0 text-neutral-900"
                  variant="link"
                >
                  <Link
                    href="https://cursos.devtalles.com/"
                    rel="noopener"
                    target="_blank"
                  >
                    Cursos
                  </Link>
                </Button>
              </SheetClose>
            </li>
          </ul>
        </nav>
        <div className="flex w-full items-center justify-between border-t-1 p-4">
          <ModeToggle />
          <SheetClose asChild>
            <UserDropDownMenu />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
