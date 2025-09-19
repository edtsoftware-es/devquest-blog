"use client";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { Category } from "@/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

const DEBOUNCE_TIME = 500;

export function SearchDialog({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const debouncedPrefetch = useDebouncedCallback((searchTerm: string) => {
    if (searchTerm.trim() !== "") {
      router.prefetch(`/search?q=${searchTerm}`);
    }
  }, DEBOUNCE_TIME);

  const handleSearch = () => {
    if (searchVal.trim() === "") {
      return;
    }
    setShowDialog(false);
    setSearchVal("");
    router.push(`/search?q=${searchVal}`);
  };

  useEffect(() => {
    debouncedPrefetch(searchVal);
  }, [searchVal, debouncedPrefetch]);

  return (
    <Dialog onOpenChange={setShowDialog} open={showDialog}>
      <DialogTrigger asChild>
        <Button
          aria-label="Buscar contenido"
          className="h-auto p-0 pr-4 xs:pr-8 text-neutral-900 md:pr-0"
          type="button"
          variant="link"
        >
          <SearchIcon size={16} />
          <span>Buscar</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="!w-[991px] !max-w-none top-[18%] px-14 py-10"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-heading-5">Search</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="flex gap-2">
            <Input
              className="h-full rounded-full px-5"
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="¿Qué estás buscando?"
              value={searchVal}
            />
            <Button
              className="rounded-full"
              onClick={handleSearch}
              variant={"secondary"}
            >
              Buscar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: Category) => (
              <Button
                className="w-fit"
                key={category._id}
                onClick={() => {
                  router.push(`/categories/${category.slug}`);
                  setShowDialog(false);
                  setSearchVal("");
                }}
                onMouseEnter={() =>
                  router.prefetch(`/categories/${category.slug}`)
                }
                size={"xs"}
              >
                {category.name}
                <Badge variant="tertiary">26</Badge>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
