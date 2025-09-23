import type { User } from "@auth/core/types";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { GraduationCap, MenuIcon } from "lucide-react";
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
import { MobileCategories } from "./mobile-categories";
import { SearchDialog } from "./search-dialog";

export default async function Header() {
  const token = await convexAuthNextjsToken();

  const [categories, recommendedPosts, currentUser] = await Promise.all([
    fetchQuery(api.categories.getAllCategories, {}),
    fetchQuery(api.posts.recommendedPosts, {}),
    fetchQuery(api.users.getCurrentUserOptional, {}, { token }),
  ]);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-center md:static md:px-7">
      <div className="flex h-16 w-full max-w-6xl flex-row-reverse items-center justify-between border border-neutral-200 bg-primary/90 px-4 backdrop-blur-lg md:mt-7 md:h-20 md:flex-row md:rounded-2xl md:bg-primary md:px-7 md:backdrop-blur-none">
        <section className="hidden items-center gap-9 md:flex">
          <Link
            aria-label="Ir al inicio de DevQuest"
            className="flex items-center"
            href="/"
          >
            <Image
              alt="Logotipo de DevQuest"
              height={32}
              src="/devi-laptop.svg"
              width={32}
              loading="eager"
              
            />
            <Image
              alt="Logotipo de DevQuest"
              className="ml-3 inline-block pt-[1px] dark:hidden"
              height={100}
              src="/logo-black.svg"
              width={100}
              loading="eager"
            />
            <Image
              alt="Logotipo de DevQuest"
              className="ml-3 hidden pt-[1px] dark:inline-block"
              height={100}
              src="/logo-white.svg"
              width={100}
              loading="eager"
            />
          </Link>
          <nav>
            <ul className="flex gap-10">
              <li>
                <Button asChild className="h-auto p-0" variant="link">
                  <Link href="/">Inicio</Link>
                </Button>
              </li>
              <li>
                <CategoriesDropdown categories={categories} />
              </li>
              <li>
                <Button asChild className="h-auto p-0" variant="link">
                  <Link
                    className="relative"
                    href="https://cursos.devtalles.com/"
                    rel="noopener"
                    target="_blank"
                  >
                    <span className="z-50">Cursos</span>
                    <GraduationCap className="-right-[-1px] -top-[10px] absolute size-5 rotate-[15deg] bg-primary" />
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </section>
        <div className="flex items-center md:hidden">
          <MobileMenu categories={categories} currentUser={currentUser} />
        </div>
        <section className="flex h-3/5 w-full items-center justify-between gap-4 md:w-auto md:border-neutral-300 md:border-l-2 md:pl-4">
          <Link
            aria-label="Ir al inicio de DevQuest"
            className="flex items-center md:hidden"
            href="/"
          >
            <Image
              alt="Logotipo de DevQuest"
              height={32}
              src="/devi-laptop.svg"
              width={32}
            />
            <Image
              alt="Logotipo de DevQuest"
              className="ml-3 inline-block pt-[1px] dark:hidden"
              height={100}
              src="/logo-black.svg"
              width={100}
            />
            <Image
              alt="Logotipo de DevQuest"
              className="ml-3 hidden pt-[1px] dark:inline-block"
              height={100}
              src="/logo-white.svg"
              width={100}
            />
          </Link>
          <SearchDialog
            categories={categories}
            recommendedPosts={recommendedPosts}
          />
          <div className="hidden items-center md:flex">
            <ModeToggle />
          </div>
          <div className="hidden items-center md:flex">
            <UserDropDownMenu currentUser={currentUser} />
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
        <Button className="h-auto p-0" type="button" variant="link">
          Categorías
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {categories.map((category: Category) => (
          <DropdownMenuItem asChild key={category._id}>
            <Link
              className="cursor-pointer"
              href={`/categories/${category.slug}`}
              prefetch
            >
              {category.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({
  currentUser,
  categories,
}: {
  currentUser: User | null;
  categories: Category[];
}) {
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
              <MobileCategories categories={categories} />
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
            <UserDropDownMenu currentUser={currentUser} />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
