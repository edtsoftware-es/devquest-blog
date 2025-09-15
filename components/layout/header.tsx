import { fetchQuery } from "convex/nextjs";
import { SearchIcon, User2Icon } from "lucide-react";
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

export default async function Header() {
  const categories = await fetchQuery(api.categories.getAllCategories, {});

  return (
    <header className="flex w-full items-center justify-center px-7">
      <div className="mt-7 flex h-20 w-full max-w-6xl items-center justify-between rounded-2xl bg-neutral-200 px-7">
        <section className="flex items-center gap-9">
          <div className="flex items-center">
            <Image
              alt="Convex Logo"
              height={32}
              src="/devi-laptop.svg"
              width={32}
            />
            <Image
              alt="DevQuest Logo"
              className="ml-3 inline-block pt-[1px]"
              height={100}
              src="/logo-white.svg"
              width={100}
            />
          </div>
          <nav>
            <ul className="flex gap-10">
              <li>
                <Button
                  className="h-auto p-0 font-light text-neutral-900"
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
                  className="h-auto p-0 font-light text-neutral-900"
                  variant="link"
                >
                  <Link href="https://cursos.devtalles.com/" target="_blank">
                    Cursos
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        </section>
        <section className="flex items-center gap-4">
          <Button className="h-auto p-0 text-neutral-900" variant="link">
            <SearchIcon size={16} />
            <Link href="/search">Buscar</Link>
          </Button>
          <ModeToggle />
          <Button className="h-auto p-0 text-neutral-900" variant="link">
            <User2Icon size={16} />
            <Link href="/profile">Perfil</Link>
          </Button>
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
          className="h-auto p-0 font-light text-neutral-900"
          variant="link"
        >
          Categorías
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {categories.map((category: Category) => (
          <DropdownMenuItem key={category._id}>
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
