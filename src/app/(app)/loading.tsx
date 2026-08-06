import { Skeleton } from "@/components/ui/skeleton";

// One loading file for the whole (app) segment: every page under it is an async
// server component hitting the database, and without this they all navigated to
// a frozen screen. Individual routes can still add their own to override.
export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>

      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <div className="border-b bg-muted/40 p-4">
          <Skeleton className="h-4 w-40" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b p-4 last:border-b-0">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="hidden h-4 w-1/6 sm:block" />
            <Skeleton className="hidden h-4 w-1/6 md:block" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
