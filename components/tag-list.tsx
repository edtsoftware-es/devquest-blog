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
        <Button className="w-fit" key={tag.tag} size={"xs"}>
          {tag.tag}
          <Badge variant="tertiary">{tag.count}</Badge>
        </Button>
      ))}
    </div>
  );
}
