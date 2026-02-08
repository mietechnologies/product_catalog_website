import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-neutral/15",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Pre-composed card skeleton matching ProductCard dimensions */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral/15 bg-white overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
