"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { SheetClose } from "../ui/sheet";

type MobileCategoriesProps = {
  categories: Category[];
};

export function MobileCategories({ categories }: MobileCategoriesProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          className="relative w-full items-center justify-center border-b-1 p-0 text-neutral-900"
          onClick={() => setOpen(!open)}
          type="button"
          variant="link"
        >
          <span>Categorías</span>
          <ChevronDown
            className={cn(
              "absolute right-11 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180",
              { "rotate-180": open }
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-b-1">
        <ul className="flex flex-col py-2">
          {categories.map((category: Category) => (
            <li key={category._id}>
              <SheetClose asChild>
                <Button
                  asChild
                  className="w-full justify-start p-0 pl-6"
                  variant="link"
                >
                  <Link href={`/categories/${category.slug}`} prefetch>
                    {category.name}
                  </Link>
                </Button>
              </SheetClose>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
