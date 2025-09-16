import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CommentSkeleton({ level = 0 }: { level?: number }) {
  return (
    <Card className={level > 0 ? "bg-muted/20" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar skeleton */}
          <Skeleton className="size-8 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            {/* Header skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      <CommentSkeleton />
      <div className="ml-4 sm:ml-6">
        <CommentSkeleton level={1} />
      </div>
      <CommentSkeleton />
      <CommentSkeleton />
    </div>
  );
}
