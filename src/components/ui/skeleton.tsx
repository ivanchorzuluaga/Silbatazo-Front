import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
  count?: number;
}

export function Skeleton({ className, variant = "default", count = 1 }: SkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={cn(
        "animate-pulse rounded-md bg-muted",
        variant === "text" && "h-4 w-full",
        variant === "circular" && "h-10 w-10 rounded-full",
        variant === "rectangular" && "h-20 w-full",
        variant === "default" && "h-4 w-full",
        className
      )}
    />
  ));

  return count > 1 ? (
    <div className="space-y-2">{skeletons}</div>
  ) : (
    skeletons[0]
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <div className="space-y-3">
        <Skeleton variant="rectangular" className="h-6 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
      <Skeleton variant="rectangular" className="h-10 w-full" />
    </div>
  );
}

export function PartidoCardSkeleton() {
  return (
    <div className="rounded-lg border border-border overflow-hidden animate-pulse">
      <div className="h-32 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-5 w-24" />
          <Skeleton variant="circular" className="h-8 w-8" />
        </div>
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton variant="text" className="h-6 w-20" />
          <Skeleton variant="rectangular" className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-border p-6 space-y-3">
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-8 w-12" />
          <Skeleton variant="text" className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}