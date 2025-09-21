import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PopularTag } from "@/convex/lib/types";
import { cn } from "@/lib/utils";

export default function TagList({
  tags,
  className,
}: {
  tags: PopularTag[];
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-wrap gap-2", className)}>
      {tags.map((tag: PopularTag) => (
        <Button asChild className="w-fit" key={tag.tag} size={"xs"}>
          <Link href={`search?q=${tag.tag}`}>
            {tag.tag}
            <Badge variant="tertiary">{tag.count}</Badge>
          </Link>
        </Button>
      ))}
    </div>
  );
}
