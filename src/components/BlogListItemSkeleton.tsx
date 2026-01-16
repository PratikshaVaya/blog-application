import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for the blog list item in sidebar
 */
export function BlogListItemSkeleton() {
  return (
    <div className="p-4 border-l-4 border-l-transparent">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3 mb-2" />
      <div className="flex gap-1">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  );
}
